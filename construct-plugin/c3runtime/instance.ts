
const C3 = globalThis.C3;

const VALID_OVERLAY_OPTIONS = ["friends", "community", "players", "settings", "official-game-group", "stats", "achievements"];

class Steamworks_ExtInstance extends globalThis.ISDKInstanceBase
{
	_isAvailable: boolean;
	_isRunningOnSteamDeck: boolean;
	_accountId: number;
	_staticAccountKey: string;
	_personaName: string;
	_playerSteamLevel: number;
	_appId: number;
	_steamUILanguage: string;
	_currentGameLanguage: string;
	_availableGameLanguages: string;

	_isOverlayEnabled: boolean;
	_loadingTimerId: number;
	_triggerAchievement: string;

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
		this._isOverlayEnabled = false;

		// For running callbacks while loading
		this._loadingTimerId = -1;

		// For triggers
		this._triggerAchievement = "";
		
		const properties = this._getInitProperties();
		if (properties)
		{
			// Read the optional app ID, development mode and overlay properties for initialization.
			initAppIdStr = (properties[0] as string).trim();
			isDevelopmentMode = properties[1] as boolean;
			this._isOverlayEnabled = properties[2] as boolean;
		}

		// Listen for overlay shown/hidden events from the extension.
		this._addWrapperExtensionMessageHandler("on-game-overlay-activated", e => this._onGameOverlayActivated(e as JSONObject));

		// Corresponding wrapper extension is available
		if (this._isWrapperExtensionAvailable())
		{
			// Run async init during loading.
			this.runtime.addLoadPromise(this._init(initAppIdStr, isDevelopmentMode));

			// Steamworks needs the app to regularly call SteamAPI_RunCallbacks(), which is done by sending
			// the "run-callbacks" message every tick. However Construct's Tick() callback only starts
			// once the loading screen finishes. In order to allow Steam to continue running callbacks while
			// the loading screen is showing (necessary for features like the overlay), set a timer to
			// run callbacks every 20ms until the first tick, which clears the timer.
			this._loadingTimerId = globalThis.setInterval(() => this._runCallbacks(), 20);

			this._setTicking(true);
		}
	}
	
	async _init(initAppIdStr: string, isDevelopmentMode: boolean)
	{
		// Send init message to wrapper extension and wait for result.
		// Pass the app ID specified in properties to optionally tell Steam which app ID to use.
		const result_ = await this._sendWrapperExtensionMessageAsync("init", [initAppIdStr, isDevelopmentMode]);

		const result = result_ as JSONObject;

		// Check availability of Steam features.
		this._isAvailable = !!result["isAvailable"];
		
		// If available, read the other initialization properties sent from the extension.
		if (this._isAvailable)
		{
			this._isRunningOnSteamDeck = !!result["isRunningOnSteamDeck"];
			this._personaName = result["personaName"] as string;
			this._accountId = result["accountId"] as number;
			this._staticAccountKey = result["staticAccountKey"] as string;
			this._playerSteamLevel = result["playerSteamLevel"] as number;
			this._appId = result["appId"] as number;
			this._steamUILanguage = result["steamUILanguage"] as string;
			this._currentGameLanguage = result["currentGameLanguage"] as string;
			this._availableGameLanguages = result["availableGameLanguages"] as string;

			// Steam initialized OK. If the overlay is enabled, tell the D3D11Overlay extension to create its overlay
			// for Steam to render its overlay in to. If the overlay is disabled Steam appears to fail to create
			// its overlay as it doesn't support WebView2, but it does have fallbacks, and the setting allows using
			// those fallbacks if preferable for any reason.
			// NOTE: this.runtime.sendWrapperExtensionMessage added in a beta release so check for support before calling
			// TODO: remove these checks when support reaches a stable release
			if (this._isOverlayEnabled && this.runtime.sendWrapperExtensionMessage)
			{
				this.runtime.sendWrapperExtensionMessage("d3d11-overlay", "create-overlay", [
					false,		// isTransparent - use opaque overlay as Steam overlay doesn't work with alpha
					false		// initiallyShowing - start off hidden and only show when overlay activated
				]);
			}
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

	_onGameOverlayActivated(e: JSONObject)
	{
		const isShowing = e["isShowing"] as boolean;

		if (this._isOverlayEnabled && this.runtime.sendWrapperExtensionMessage)
		{
			// Tell the D3D11Overlay extension to show/hide its overlay according to the visibility of the Steam Overlay.
			this.runtime.sendWrapperExtensionMessage("d3d11-overlay", "set-showing", [isShowing]);
		}

		// Dispatch scripting event and fire appropriate trigger
		// TypeScript note: cast to 'any' to add custom properties
		const overlayActivatedEvent = new C3.Event("overlay-activated", false) as any;
		overlayActivatedEvent.isShowing = isShowing;
		this.dispatchEvent(overlayActivatedEvent);

		if (isShowing)
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayShown);
		else
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayHidden);
	}

	_showOverlay(option: number)
	{
		if (!this._isAvailable)
			return;

		this._sendWrapperExtensionMessage("show-overlay", [option]);
	}

	_showOverlayURL(url: string, modal: boolean)
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
	
	_loadFromJson(o: JSONValue)
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

	showOverlay(optionStr: string)
	{
		const option = VALID_OVERLAY_OPTIONS.indexOf(optionStr);
		if (option === -1)
			throw new Error(`invalid overlay option '${optionStr}'`);

		this._showOverlay(option);
	}

	showOverlayURL(url: string, modal: boolean)
	{
		this._showOverlayURL(url, modal);
	}

	async unlockAchievement(achievement: string)
	{
		if (!this._isAvailable)
			return false;
		
		const result_ = await this._sendWrapperExtensionMessageAsync("set-achievement", [achievement]);

		const result = result_ as JSONObject;

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

	async clearAchievement(achievement: string)
	{
		if (!this._isAvailable)
			return false;
		
		const result_ = await this._sendWrapperExtensionMessageAsync("clear-achievement", [achievement]);

		const result = result_ as JSONObject;

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
};

C3.Plugins.Steamworks_Ext.Instance = Steamworks_ExtInstance;

export type { Steamworks_ExtInstance as SDKInstanceClass };
