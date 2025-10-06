const C3 = globalThis.C3;
C3.Plugins.Steamworks_Ext.Exps =
    {
        AccountID() {
            return this.accountId;
        },
        SteamID64Bit() {
            return this.steamId64Bit;
        },
        StaticAccountKey() {
            return this.staticAccountKey;
        },
        AppOwnerAccountID() {
            return this.appOwnerAccountId;
        },
        AppOwnerSteamID64Bit() {
            return this.appOwnerSteamId64Bit;
        },
        AppOwnerStaticAccountKey() {
            return this.appOwnerStaticAccountKey;
        },
        PersonaName() {
            return this.personaName;
        },
        PlayerSteamLevel() {
            return this.playerSteamLevel;
        },
        AppID() {
            return this.appId;
        },
        SteamUILanguage() {
            return this.steamUILanguage;
        },
        CurrentGameLanguage() {
            return this.currentGameLanguage;
        },
        AvailableGameLanguages() {
            // note expression returns comma-separated string
            return this._availableGameLanguages;
        },
        Achievement() {
            return this._triggerAchievement;
        },
        TriggerAppID() {
            return this._triggerAppId;
        },
        AuthTicket() {
            return this.authTicket;
        },
        TicketHexStr() {
            return this.ticketHexStr;
        }
    };
export {};
