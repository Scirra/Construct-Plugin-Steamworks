
const C3 = globalThis.C3;

const VALID_OVERLAY_OPTIONS = ["friends", "community", "players", "settings", "official-game-group", "stats", "achievements"];

C3.Plugins.Steamworks_Ext.Instance = class Steamworks_ExtInstance extends globalThis.ISDKInstanceBase
{
	constructor()
	{
		// Set "scirra-steam" component ID, matching the same component ID set by the wrapper extension.
		super({ wrapperComponentId: "scirra-steam" });
		
		// Steam properties
		this._isAvailable = false;
		this._isRunningOnSteamDeck = false;
		this._accountId = 0;
		this._staticAccountKey = "";
		this._personaName = "";
		this._playerSteamLevel = 0;
		let initAppIdStr = "";			// app ID property, only used during initialization
		this._appId = 0;
		this._steamUILanguage = "";
		this._currentGameLanguage = "";
		this._availableGameLanguages = "";
		let isDevelopmentMode = false;

		this._dlcSet = new Set();

		// For running callbacks while loading
		this._loadingTimerId = -1;

		// For triggers
		this._triggerAchievement = "";
		this._triggerAppId = 0;
		
		const properties = this._getInitProperties();
		if (properties)
		{
			// Read the optional app ID, development mode and overlay properties for initialization.
			initAppIdStr = properties[0].trim();
			isDevelopmentMode = properties[1];
		}

		// Listen for overlay shown/hidden events from the extension.
		// NOTE: this is implemented but currently non-functional as the Steam overlay currently will always use
		// its fallback mode, which does not fire overlay events.
		this._addWrapperExtensionMessageHandler("on-game-overlay-activated", e => this._onGameOverlayActivated(e));

		this._addWrapperExtensionMessageHandler("on-dlc-installed", e => this._onDlcInstalled(e));

		// Corresponding wrapper extension is available
		if (this._isWrapperExtensionAvailable())
		{
			// Run async init during loading.
			this.runtime.sdk.addLoadPromise(this._init(initAppIdStr, isDevelopmentMode));

			// Steamworks needs the app to regularly call SteamAPI_RunCallbacks(), which is done by sending
			// the "run-callbacks" message every tick. However Construct's Tick() callback only starts
			// once the loading screen finishes. In order to allow Steam to continue running callbacks while
			// the loading screen is showing (necessary for features like the overlay), set a timer to
			// run callbacks every 20ms until the first tick, which clears the timer.
			this._loadingTimerId = globalThis.setInterval(() => this._runCallbacks(), 20);

			this._setTicking(true);
		}
	}
	
	async _init(initAppIdStr, isDevelopmentMode)
	{
		// Send init message to wrapper extension and wait for result.
		// Pass the app ID specified in properties to optionally tell Steam which app ID to use.
		const result = await this._sendWrapperExtensionMessageAsync("init", [initAppIdStr, isDevelopmentMode]);

		// Check availability of Steam features.
		this._isAvailable = !!result["isAvailable"];
		
		// If available, read the other initialization properties sent from the extension.
		if (this._isAvailable)
		{
			this._isRunningOnSteamDeck = result["isRunningOnSteamDeck"];
			this._personaName = result["personaName"];
			this._accountId = result["accountId"];
			this._staticAccountKey = result["staticAccountKey"];
			this._playerSteamLevel = result["playerSteamLevel"];
			this._appId = result["appId"];
			this._steamUILanguage = result["steamUILanguage"];
			this._currentGameLanguage = result["currentGameLanguage"];
			this._availableGameLanguages = result["availableGameLanguages"];
		}
	}
	
	_release()
	{
		super._release();
	}

	_tick()
	{
		// On the first tick, clear the timer running callbacks for the loading screen.
		if (this._loadingTimerId !== -1)
		{
			globalThis.clearInterval(this._loadingTimerId);
			this._loadingTimerId = -1;
		}
		
		this._runCallbacks();
	}

	_runCallbacks()
	{
		// Tell extension to call SteamAPI_RunCallbacks().
		this._sendWrapperExtensionMessage("run-callbacks");
	}

	// NOTE: implemented but currently non-functional
	_onGameOverlayActivated(e)
	{
		const isShowing = e["isShowing"];

		// Dispatch scripting event and fire appropriate trigger
		const overlayActivatedEvent = new C3.Event("overlay-activated", false);
		overlayActivatedEvent.isShowing = isShowing;
		this.dispatchEvent(overlayActivatedEvent);

		if (isShowing)
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayShown);
		else
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayHidden);
	}

	_onDlcInstalled(e)
	{
		this._triggerAppId = e["appId"];

		this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnDLCInstalled);

		this._triggerAppId = 0;
	}

	_showOverlay(option)
	{
		if (!this._isAvailable)
			return;

		this._sendWrapperExtensionMessage("show-overlay", [option]);
	}

	_showOverlayURL(url, modal)
	{
		if (!this._isAvailable)
			return;
		
		this._sendWrapperExtensionMessage("show-overlay-url", [url, modal]);
	}
	
	_saveToJson()
	{
		return {
			// data to be saved for savegames
		};
	}
	
	_loadFromJson(o)
	{
		// load state for savegames
	}

	/////////////////////////////
	// Public script interface
	get isAvailable()
	{
		return this._isAvailable;
	}

	get isRunningOnSteamDeck()
	{
		return this._isRunningOnSteamDeck;
	}

	get personaName()
	{
		return this._personaName;
	}

	get accountId()
	{
		return this._accountId;
	}

	get staticAccountKey()
	{
		return this._staticAccountKey;
	}

	get playerSteamLevel()
	{
		return this._playerSteamLevel;
	}

	get appId()
	{
		return this._appId;
	}

	get steamUILanguage()
	{
		return this._steamUILanguage;
	}

	get currentGameLanguage()
	{
		return this._currentGameLanguage;
	}

	// For the public script API use a method that returns an array, splitting the
	// comma-separated string
	getAvailableGameLanguages()
	{
		return this._availableGameLanguages.split(",");
	}

	showOverlay(optionStr)
	{
		const option = VALID_OVERLAY_OPTIONS.indexOf(optionStr);
		if (option === -1)
			throw new Error(`invalid overlay option '${optionStr}'`);

		this._showOverlay(option);
	}

	showOverlayURL(url, modal)
	{
		this._showOverlayURL(url, !!modal);
	}

	async unlockAchievement(achievement)
	{
		if (!this._isAvailable)
			return false;
		
		const result = await this._sendWrapperExtensionMessageAsync("set-achievement", [achievement]);

		this._triggerAchievement = achievement;

		const isOk = result["isOk"];
		if (isOk)
		{
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAnyAchievementUnlockSuccess);
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAchievementUnlockSuccess);
		}
		else
		{
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAnyAchievementUnlockError);
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAchievementUnlockError);
		}

		// Return result for script interface
		return isOk;
	}

	async clearAchievement(achievement)
	{
		if (!this._isAvailable)
			return false;
		
		const result = await this._sendWrapperExtensionMessageAsync("clear-achievement", [achievement]);

		// Just log result as this is primarily for testing purposes
		const isOk = result["isOk"];
		if (isOk)
		{
			console.info(`[Steamworks-Ext] Cleared achievement '${achievement}'`);
		}
		else
		{
			console.warn(`[Steamworks-Ext] Failed to clear achievement '${achievement}'`);
		}

		// Return result for script interface
		return isOk;
	}

	async checkDlcInstalled(appIds)
	{
		if (!this._isAvailable)
			return;
		
		const result = await this._sendWrapperExtensionMessageAsync("is-dlc-installed", [appIds.map(id => String(id)).join(",")]);

		const isOk = result["isOk"];
		if (isOk)
		{
			const resultArr = result["results"].split(",");
			for (let i = 0, len = resultArr.length; i < len; ++i)
			{
				const result = resultArr[i];
				const isInstalled = (result === "true");
				const appId = appIds[i];
				if (appId)
				{
					if (isInstalled)
						this._dlcSet.add(appId);
					else
						this._dlcSet.delete(appId);
				}
			}
		}

		// Trigger 'On DLC installed check complete'
		this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnDLCInstalledCheckComplete);

		// Return result for script interface
		return isOk;
	}

	isDlcInstalled(appId)
	{
		return this._dlcSet.has(appId);
	}

	installDlc(appId)
	{
		if (!this._isAvailable)
			return;

		this._sendWrapperExtensionMessage("install-dlc", [appId]);
	}

	uninstallDlc(appId)
	{
		if (!this._isAvailable)
			return;

		this._sendWrapperExtensionMessage("uninstall-dlc", [appId]);
	}
};
