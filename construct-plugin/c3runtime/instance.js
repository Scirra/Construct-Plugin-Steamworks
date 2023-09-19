
const C3 = self.C3;

C3.Plugins.Steamworks_Ext.Instance = class Steamworks_ExtInstance extends C3.SDKInstanceBase
{
	constructor(inst, properties)
	{
		super(inst);
		
		// Set "scirra-steam" component ID, matching the same component ID set by the wrapper extension.
		this.SetWrapperExtensionComponentId("scirra-steam");
		
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
		
		if (properties)
		{
			// Read the optional app ID, development mode and overlay properties for initialization.
			initAppIdStr = properties[0].trim();
			isDevelopmentMode = properties[1];
			this._isOverlayEnabled = properties[2];
		}

		// Listen for overlay shown/hidden events from the extension.
		this.AddWrapperExtensionMessageHandler("on-game-overlay-activated", e => this._OnGameOverlayActivated(e));

		// Corresponding wrapper extension is available
		if (this.IsWrapperExtensionAvailable())
		{
			// Run async init during loading.
			this._runtime.AddLoadPromise(this._Init(initAppIdStr, isDevelopmentMode));

			// Steamworks needs the app to regularly call SteamAPI_RunCallbacks(), which is done by sending
			// the "run-callbacks" message every tick. However Construct's Tick() callback only starts
			// once the loading screen finishes. In order to allow Steam to continue running callbacks while
			// the loading screen is showing (necessary for features like the overlay), set a timer to
			// run callbacks every 20ms until the first tick, which clears the timer.
			this._loadingTimerId = self.setInterval(() => this._RunCallbacks(), 20);

			this._StartTicking();
		}
	}
	
	async _Init(initAppIdStr, isDevelopmentMode)
	{
		// Send init message to wrapper extension and wait for result.
		// Pass the app ID specified in properties to optionally tell Steam which app ID to use.
		const result = await this.SendWrapperExtensionMessageAsync("init", [initAppIdStr, isDevelopmentMode]);

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

			// Steam initialized OK. If the overlay is enabled, tell the D3D11Overlay extension to create its overlay
			// for Steam to render its overlay in to. If the overlay is disabled Steam appears to fail to create
			// its overlay as it doesn't support WebView2, but it does have fallbacks, and the setting allows using
			// those fallbacks if preferable for any reason.
			if (this._isOverlayEnabled)
			{
				this._runtime.SendWrapperExtensionMessage("d3d11-overlay", "create-overlay", [
					false,		// isTransparent - use opaque overlay as Steam overlay doesn't work with alpha
					false		// initiallyShowing - start off hidden and only show when overlay activated
				]);
			}
		}
	}
	
	Release()
	{
		super.Release();
	}

	Tick()
	{
		// On the first tick, clear the timer running callbacks for the loading screen.
		if (this._loadingTimerId !== -1)
		{
			self.clearInterval(this._loadingTimerId);
			this._loadingTimerId = -1;
		}
		
		this._RunCallbacks();
	}

	_RunCallbacks()
	{
		// Tell extension to call SteamAPI_RunCallbacks().
		this.SendWrapperExtensionMessage("run-callbacks");
	}

	_OnGameOverlayActivated(e)
	{
		const isShowing = e["isShowing"];

		if (this._isOverlayEnabled)
		{
			// Tell the D3D11Overlay extension to show/hide its overlay according to the visibility of the Steam Overlay.
			this._runtime.SendWrapperExtensionMessage("d3d11-overlay", "set-showing", [isShowing]);
		}

		// Dispatch scripting event and fire appropriate trigger
		this.DispatchScriptEvent("overlay-activated", false, { isShowing });

		if (isShowing)
			this.Trigger(self.C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayShown);
		else
			this.Trigger(self.C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayHidden);
	}

	_IsAvailable()
	{
		return this._isAvailable;
	}

	_IsRunningOnSteamDeck()
	{
		return this._isRunningOnSteamDeck;
	}

	_GetPersonaName()
	{
		return this._personaName;
	}

	_GetAccountID()
	{
		return this._accountId;
	}

	_GetStaticAccountKey()
	{
		return this._staticAccountKey;
	}

	_GetPlayerSteamLevel()
	{
		return this._playerSteamLevel;
	}

	_GetAppID()
	{
		return this._appId;
	}

	_GetSteamUILanguage()
	{
		return this._steamUILanguage;
	}

	_GetCurrentGameLanguage()
	{
		return this._currentGameLanguage;
	}

	_GetAvailableGameLanguages()
	{
		return this._availableGameLanguages;
	}

	_ShowOverlay(option)
	{
		this.SendWrapperExtensionMessage("show-overlay", [option]);
	}

	_ShowOverlayURL(url, modal)
	{
		this.SendWrapperExtensionMessage("show-overlay-url", [url, modal]);
	}

	async _UnlockAchievement(achievement)
	{
		if (!this._IsAvailable())
			return false;
		
		const result = await this.SendWrapperExtensionMessageAsync("set-achievement", [achievement]);

		this._triggerAchievement = achievement;

		const isOk = result["isOk"];
		if (isOk)
		{
			this.Trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAnyAchievementUnlockSuccess);
			this.Trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAchievementUnlockSuccess);
		}
		else
		{
			this.Trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAnyAchievementUnlockError);
			this.Trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAchievementUnlockError);
		}

		// Return result for script interface
		return isOk;
	}

	async _ClearAchievement(achievement)
	{
		if (!this._IsAvailable())
			return false;
		
		const result = await this.SendWrapperExtensionMessageAsync("clear-achievement", [achievement]);

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
	
	SaveToJson()
	{
		return {
			// data to be saved for savegames
		};
	}
	
	LoadFromJson(o)
	{
		// load state for savegames
	}

	GetScriptInterfaceClass()
	{
		return self.ISteamworksExtGlobalInstance;
	}
};

// Script interface. Use a WeakMap to safely hide the internal implementation details from the
// caller using the script interface.
const map = new WeakMap();

const VALID_OVERLAY_OPTIONS = ["friends", "community", "players", "settings", "official-game-group", "stats", "achievements"];

self.ISteamworksExtGlobalInstance = class ISteamworksExtGlobalInstance extends self.IInstance {
	constructor()
	{
		super();
		
		// Map by SDK instance
		map.set(this, self.IInstance._GetInitInst().GetSdkInstance());
	}

	get isAvailable()
	{
		return map.get(this)._IsAvailable();
	}

	get isRunningOnSteamDeck()
	{
		return map.get(this)._IsRunningOnSteamDeck();
	}

	get personaName()
	{
		return map.get(this)._GetPersonaName();
	}

	get accountId()
	{
		return map.get(this)._GetAccountID();
	}

	get staticAccountKey()
	{
		return map.get(this)._GetStaticAccountKey();
	}

	get playerSteamLevel()
	{
		return map.get(this)._GetPlayerSteamLevel();
	}

	get appId()
	{
		return map.get(this)._GetAppID();
	}

	get steamUILanguage()
	{
		return map.get(this)._GetSteamUILanguage();
	}

	get currentGameLanguage()
	{
		return map.get(this)._GetCurrentGameLanguage();
	}

	// For the script API use a method that returns an array, splitting the
	// comma-separated string
	getAvailableGameLanguages()
	{
		return map.get(this)._GetAvailableGameLanguages().split(",");
	}

	showOverlay(optionStr)
	{
		const option = VALID_OVERLAY_OPTIONS.indexOf(optionStr);
		if (option === -1)
			throw new Error(`invalid overlay option '${optionStr}'`);

		map.get(this)._ShowOverlay(option);
	}

	showOverlayURL(url, modal)
	{
		map.get(this)._ShowOverlayURL(url, !!modal);
	}

	/* async */ unlockAchievement(achievement)
	{
		return map.get(this)._UnlockAchievement(achievement);
	}

	/* async */ clearAchievement(achievement)
	{
		return map.get(this)._ClearAchievement(achievement);
	}
};
