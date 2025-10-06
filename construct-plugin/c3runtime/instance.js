const C3 = globalThis.C3;
const VALID_OVERLAY_OPTIONS = ["friends", "community", "players", "settings", "official-game-group", "stats", "achievements"];
class Steamworks_ExtInstance extends globalThis.ISDKInstanceBase {
    // Steam properties
    #isAvailable = false;
    #isRunningOnSteamDeck = false;
    #accountId = 0;
    #steamId64Bit = "";
    #staticAccountKey = "";
    #appOwnerAccountId = 0;
    #appOwnerSteamId64Bit = "";
    #appOwnerStaticAccountKey = "";
    #personaName = "";
    #playerSteamLevel = 0;
    #appId = 0;
    #steamUILanguage = "";
    #currentGameLanguage = "";
    _availableGameLanguages = ""; // note returned by an expression so is public
    #dlcSet = new Set();
    // For running callbacks while loading
    #loadingTimerId = -1;
    // For triggers. Note as these are read externally they are left as public properties
    // but with an underscore to indicate internal use.
    _triggerAchievement = "";
    _triggerAppId = 0;
    // Authentication
    #hAuthTicket = 0;
    #ticketHexStr = "";
    constructor() {
        // Set "scirra-steam" component ID, matching the same component ID set by the wrapper extension.
        super({ wrapperComponentId: "scirra-steam" });
        // Note the properties for App ID and development mode are not read here - instead they are exported
        // to the package.json file with the call to SetWrapperExportProperties(). The wrapper extension
        // then reads these values and sends the app ID when responding to the "init" message.
        //const properties = this._getInitProperties();
        // Listen for overlay shown/hidden events from the extension.
        // NOTE: this is implemented but currently non-functional as the Steam overlay currently will always use
        // its fallback mode, which does not fire overlay events.
        this._addWrapperExtensionMessageHandler("on-game-overlay-activated", e => this.#onGameOverlayActivated(e));
        this._addWrapperExtensionMessageHandler("on-dlc-installed", e => this.#onDlcInstalled(e));
        // Corresponding wrapper extension is available
        if (this._isWrapperExtensionAvailable()) {
            // Run async init during loading.
            this.runtime.sdk.addLoadPromise(this.#init());
            // Steamworks needs the app to regularly call SteamAPI_RunCallbacks(), which is done by sending
            // the "run-callbacks" message every tick. However Construct's Tick() callback only starts
            // once the loading screen finishes. In order to allow Steam to continue running callbacks while
            // the loading screen is showing (necessary for features like the overlay), set a timer to
            // run callbacks every 20ms until the first tick, which clears the timer.
            this.#loadingTimerId = globalThis.setInterval(() => this.#runCallbacks(), 20);
            this._setTicking(true);
        }
    }
    async #init() {
        // Send init message to wrapper extension and wait for result.
        // Pass the app ID specified in properties to optionally tell Steam which app ID to use.
        const result_ = await this._sendWrapperExtensionMessageAsync("init");
        const result = result_;
        // Check availability of Steam features.
        this.#isAvailable = !!result["isAvailable"];
        // If available, read the other initialization properties sent from the extension.
        if (this.#isAvailable) {
            this.#isRunningOnSteamDeck = !!result["isRunningOnSteamDeck"];
            this.#personaName = result["personaName"];
            this.#accountId = result["accountId"];
            this.#steamId64Bit = result["steamId64Bit"];
            this.#staticAccountKey = result["staticAccountKey"];
            this.#appOwnerAccountId = result["appOwnerAccountId"];
            this.#appOwnerSteamId64Bit = result["appOwnerSteamId64Bit"];
            this.#appOwnerStaticAccountKey = result["appOwnerStaticAccountKey"];
            this.#playerSteamLevel = result["playerSteamLevel"];
            this.#appId = result["appId"];
            this.#steamUILanguage = result["steamUILanguage"];
            this.#currentGameLanguage = result["currentGameLanguage"];
            this._availableGameLanguages = result["availableGameLanguages"];
        }
    }
    _release() {
        super._release();
    }
    _tick() {
        // On the first tick, clear the timer running callbacks for the loading screen.
        if (this.#loadingTimerId !== -1) {
            globalThis.clearInterval(this.#loadingTimerId);
            this.#loadingTimerId = -1;
        }
        this.#runCallbacks();
    }
    #runCallbacks() {
        // Tell extension to call SteamAPI_RunCallbacks().
        this._sendWrapperExtensionMessage("run-callbacks");
    }
    // NOTE: implemented but currently non-functional
    #onGameOverlayActivated(e) {
        const isShowing = e["isShowing"];
        // Dispatch scripting event and fire appropriate trigger
        // TypeScript note: cast to 'any' to add custom properties
        const overlayActivatedEvent = new C3.Event("overlay-activated", false);
        overlayActivatedEvent.isShowing = isShowing;
        this.dispatchEvent(overlayActivatedEvent);
        if (isShowing)
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayShown);
        else
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGameOverlayHidden);
    }
    #onDlcInstalled(e) {
        this._triggerAppId = e["appId"];
        this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnDLCInstalled);
        this._triggerAppId = 0;
    }
    _showOverlay(option) {
        if (!this.#isAvailable)
            return;
        this._sendWrapperExtensionMessage("show-overlay", [option]);
    }
    _showOverlayURL(url, modal) {
        if (!this.#isAvailable)
            return;
        this._sendWrapperExtensionMessage("show-overlay-url", [url, modal]);
    }
    _saveToJson() {
        return {
        // data to be saved for savegames
        };
    }
    _loadFromJson(o) {
        // load state for savegames
    }
    /////////////////////////////
    // Public script interface
    get isAvailable() {
        return this.#isAvailable;
    }
    get isRunningOnSteamDeck() {
        return this.#isRunningOnSteamDeck;
    }
    get personaName() {
        return this.#personaName;
    }
    get accountId() {
        return this.#accountId;
    }
    get steamId64Bit() {
        return this.#steamId64Bit;
    }
    get staticAccountKey() {
        return this.#staticAccountKey;
    }
    get appOwnerAccountId() {
        return this.#appOwnerAccountId;
    }
    get appOwnerSteamId64Bit() {
        return this.#appOwnerSteamId64Bit;
    }
    get appOwnerStaticAccountKey() {
        return this.#appOwnerStaticAccountKey;
    }
    get playerSteamLevel() {
        return this.#playerSteamLevel;
    }
    get appId() {
        return this.#appId;
    }
    get steamUILanguage() {
        return this.#steamUILanguage;
    }
    get currentGameLanguage() {
        return this.#currentGameLanguage;
    }
    // For the public script API use a method that returns an array, splitting the
    // comma-separated string
    getAvailableGameLanguages() {
        return this._availableGameLanguages.split(",");
    }
    showOverlay(optionStr) {
        const option = VALID_OVERLAY_OPTIONS.indexOf(optionStr);
        if (option === -1)
            throw new Error(`invalid overlay option '${optionStr}'`);
        this._showOverlay(option);
    }
    showOverlayURL(url, modal) {
        this._showOverlayURL(url, modal);
    }
    async unlockAchievement(achievement) {
        if (!this.#isAvailable)
            throw new Error("not available");
        const result_ = await this._sendWrapperExtensionMessageAsync("set-achievement", [achievement]);
        const result = result_;
        this._triggerAchievement = achievement;
        const isOk = result["isOk"];
        if (isOk) {
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAnyAchievementUnlockSuccess);
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAchievementUnlockSuccess);
        }
        else {
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAnyAchievementUnlockError);
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnAchievementUnlockError);
        }
        // Return result for script interface
        return isOk;
    }
    async clearAchievement(achievement) {
        if (!this.#isAvailable)
            throw new Error("not available");
        const result_ = await this._sendWrapperExtensionMessageAsync("clear-achievement", [achievement]);
        const result = result_;
        // Just log result as this is primarily for testing purposes
        const isOk = result["isOk"];
        if (isOk) {
            console.info(`[Steamworks-Ext] Cleared achievement '${achievement}'`);
        }
        else {
            console.warn(`[Steamworks-Ext] Failed to clear achievement '${achievement}'`);
        }
        // Return result for script interface
        return isOk;
    }
    async checkDlcInstalled(appIds) {
        if (!this.#isAvailable)
            throw new Error("not available");
        const result_ = await this._sendWrapperExtensionMessageAsync("is-dlc-installed", [appIds.map(id => String(id)).join(",")]);
        const result = result_;
        const isOk = result["isOk"];
        if (isOk) {
            const resultArr = result["results"].split(",");
            for (let i = 0, len = resultArr.length; i < len; ++i) {
                const result = resultArr[i];
                const isInstalled = (result === "true");
                const appId = appIds[i];
                if (appId) {
                    if (isInstalled)
                        this.#dlcSet.add(appId);
                    else
                        this.#dlcSet.delete(appId);
                }
            }
        }
        // Trigger 'On DLC installed check complete'
        this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnDLCInstalledCheckComplete);
        // Return result for script interface
        return isOk;
    }
    isDlcInstalled(appId) {
        return this.#dlcSet.has(appId);
    }
    installDlc(appId) {
        if (!this.#isAvailable)
            return;
        this._sendWrapperExtensionMessage("install-dlc", [appId]);
    }
    uninstallDlc(appId) {
        if (!this.#isAvailable)
            return;
        this._sendWrapperExtensionMessage("uninstall-dlc", [appId]);
    }
    async getAuthTicketForWebApi(identity = "") {
        if (!this.#isAvailable)
            throw new Error("not available");
        const result_ = await this._sendWrapperExtensionMessageAsync("get-auth-ticket-for-web-api", [identity]);
        const result = result_;
        if (result["isOk"]) {
            this.#hAuthTicket = result["authTicket"];
            this.#ticketHexStr = result["ticketHexStr"];
            // Fire success trigger
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGetAuthTicketForWebApiSuccess);
            // Return obtained ticket details for script API
            return {
                authTicket: this.#hAuthTicket,
                ticketHexStr: this.#ticketHexStr
            };
        }
        else {
            // Fire failure trigger
            this._trigger(C3.Plugins.Steamworks_Ext.Cnds.OnGetAuthTicketForWebApiError);
            // Reject returned promise
            throw new Error("getAuthTicketForWebApi failed");
        }
    }
    get authTicket() {
        return this.#hAuthTicket;
    }
    get ticketHexStr() {
        return this.#ticketHexStr;
    }
    cancelAuthTicket(authTicket) {
        if (!this.#isAvailable)
            return;
        // If the last held auth ticket is cancelled, clear it.
        if (authTicket === this.#hAuthTicket)
            this.#hAuthTicket = 0;
        this._sendWrapperExtensionMessage("cancel-auth-ticket", [authTicket]);
    }
    setRichPresence(key, value) {
        if (!this.#isAvailable)
            return;
        this._sendWrapperExtensionMessage("set-rich-presence", [key, value]);
    }
    clearRichPresence() {
        if (!this.#isAvailable)
            return;
        this._sendWrapperExtensionMessage("clear-rich-presence");
    }
}
;
C3.Plugins.Steamworks_Ext.Instance = Steamworks_ExtInstance;
export {};
