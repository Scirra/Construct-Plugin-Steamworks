
const C3 = globalThis.C3;

const VALID_OVERLAY_OPTIONS = ["friends", "community", "players", "settings", "official-game-group", "stats", "achievements"];

class Steamworks_ExtInstance extends globalThis.ISDKInstanceBase
{
	_isAvailable: boolean;
	_isRunningOnSteamDeck: boolean;
	_accountId: number;
	_staticAccountKey: string;
	_appOwnerAccountId: number;
	_appOwnerStaticAccountKey: string;
	_personaName: string;
	_playerSteamLevel: number;
	_appId: number;
	_steamUILanguage: string;
	_currentGameLanguage: string;
	_availableGameLanguages: string;

	_loadingTimerId: number;
	_triggerAchievement: string;

	_dlcSet: Set<number>;
	_triggerAppId: number;

	_hAuthTicket: number;
	_ticketHexStr: string;

	constructor()
	{
		// Set "scirra-steam" component ID, matching the same component ID set by the wrapper extension.
		super({ wrapperComponentId: "scirra-steam" });
		
		// Steam properties
		this._isAvailable = false;
		this._isRunningOnSteamDeck = false;
		this._accountId = 0;
		this._staticAccountKey = "";
		this._appOwnerAccountId = 0;
		this._appOwnerStaticAccountKey = "";
		this._personaName = "";
		this._playerSteamLevel = 0;
		this._appId = 0;
		this._steamUILanguage = "";
		this._currentGameLanguage = "";
		this._availableGameLanguages = "";

		this._dlcSet = new Set();

		this._hAuthTicket = 0;
		this._ticketHexStr = "";

		// For running callbacks while loading
		this._loadingTimerId = -1;

		// For triggers
		this._triggerAchievement = "";
		this._triggerAppId = 0;
		
		// Note the properties for App ID and development mode are not read here - instead they are exported
		// to the package.json file with the call to SetWrapperExportProperties(). The wrapper extension
		// then reads these values and sends the app ID when responding to the "init" message.
		//const properties = this._getInitProperties();

		// Listen for overlay shown/hidden events from the extension.
		// NOTE: this is implemented but currently non-functional as the Steam overlay currently will always use
		// its fallback mode, which does not fire overlay events.
		this._addWrapperExtensionMessageHandler("on-game-overlay-activated", e => this._onGameOverlayActivated(e as JSONObject));

		this._addWrapperExtensionMessageHandler("on-dlc-installed", e => this._onDlcInstalled(e as JSONObject));

		// Corresponding wrapper extension is available
		if (this._isWrapperExtensionAvailable())
		{
			// Run async init during loading.
			this.runtime.sdk.addLoadPromise(this._init());

			// Steamworks needs the app to regularly call SteamAPI_RunCallbacks(), which is done by sending
			// the "run-callbacks" message every tick. However Construct's Tick() callback only starts
			// once the loading screen finishes. In order to allow Steam to continue running callbacks while
			// the loading screen is showing (necessary for features like the overlay), set a timer to
			// run callbacks every 20ms until the first tick, which clears the timer.
			this._loadingTimerId = globalThis.setInterval(() => this._runCallbacks(), 20);

			this._setTicking(true);
		}
	}
	
	async _init()
	{
		// Send init message to wrapper extension and wait for result.
		// Pass the app ID specified in properties to optionally tell Steam which app ID to use.
		const result_ = await this._sendWrapperExtensionMessageAsync("init");

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
			this._appOwnerAccountId = result["appOwnerAccountId"] as number;
			this._appOwnerStaticAccountKey = result["appOwnerStaticAccountKey"] as string;
			this._playerSteamLevel = result["playerSteamLevel"] as number;
			this._appId = result["appId"] as number;
			this._steamUILanguage = result["steamUILanguage"] as string;
			this._currentGameLanguage = result["currentGameLanguage"] as string;
			this._availableGameLanguages = result["availableGameLanguages"] as string;
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
	_onGameOverlayActivated(e: JSONObject)
	{
		const isShowing = e["isShowing"] as boolean;

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

	_onDlcInstalled(e: JSONObject)
	{
		this._triggerAppId = (e["appId"] as number);

		this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnDLCInstalled);

		this._triggerAppId = 0;
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

	get appOwnerAccountId()
	{
		return this._appOwnerAccountId;
	}

	get appOwnerStaticAccountKey()
	{
		return this._appOwnerStaticAccountKey;
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
			throw new Error("not available");
		
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
			throw new Error("not available");
		
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

	async checkDlcInstalled(appIds: number[])
	{
		if (!this._isAvailable)
			throw new Error("not available");
		
		const result_ = await this._sendWrapperExtensionMessageAsync("is-dlc-installed", [appIds.map(id => String(id)).join(",")]);

		const result = result_ as JSONObject;

		const isOk = result["isOk"];
		if (isOk)
		{
			const resultArr = (result["results"] as string).split(",");
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

	isDlcInstalled(appId: number)
	{
		return this._dlcSet.has(appId);
	}

	installDlc(appId: number)
	{
		if (!this._isAvailable)
			return;

		this._sendWrapperExtensionMessage("install-dlc", [appId]);
	}

	uninstallDlc(appId: number)
	{
		if (!this._isAvailable)
			return;

		this._sendWrapperExtensionMessage("uninstall-dlc", [appId]);
	}

	async getAuthTicketForWebApi(identity = "")
	{
		if (!this._isAvailable)
			throw new Error("not available");

		const result_ = await this._sendWrapperExtensionMessageAsync("get-auth-ticket-for-web-api", [identity]);

		const result = result_ as JSONObject;

		if (result["isOk"])
		{
			this._hAuthTicket = result["authTicket"] as number;
			this._ticketHexStr = result["ticketHexStr"] as string;

			// Fire success trigger
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGetAuthTicketForWebApiSuccess);

			// Return obtained ticket details for script API
			return {
				authTicket: this._hAuthTicket,
				ticketHexStr: this._ticketHexStr
			};
		}
		else
		{
			// Fire failure trigger
			this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGetAuthTicketForWebApiError);

			// Reject returned promise
			throw new Error("getAuthTicketForWebApi failed");
		}
	}

	get authTicket()
	{
		return this._hAuthTicket;
	}

	get ticketHexStr()
	{
		return this._ticketHexStr;
	}

	cancelAuthTicket(authTicket: number)
	{
		if (!this._isAvailable)
			return;

		// If the last held auth ticket is cancelled, clear it.
		if (authTicket === this._hAuthTicket)
			this._hAuthTicket = 0;

		this._sendWrapperExtensionMessage("cancel-auth-ticket", [authTicket]);
	}
};

C3.Plugins.Steamworks_Ext.Instance = Steamworks_ExtInstance;

export type { Steamworks_ExtInstance as SDKInstanceClass };
