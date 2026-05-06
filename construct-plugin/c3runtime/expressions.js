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
        AchievementUnlockTime() {
            return this._getAchievementUnlockTime();
        },
        TriggerAppID() {
            return this._triggerAppId;
        },
        AuthTicket() {
            return this.authTicket;
        },
        TicketHexStr() {
            return this.ticketHexStr;
        },
        GlobalRankNew() {
            return this._triggerGlobalRankNew;
        },
        GlobalRankPrevious() {
            return this._triggerGlobalRankPrevious;
        },
        LeaderboardName() {
            return this._triggerLeaderboardName;
        },
        LeaderboardEntryCount(leaderboardName) {
            return this._getLeaderboardEntryCount(leaderboardName);
        },
        LeaderboardEntryNameAt(leaderboardName, index) {
            return this._getLeaderboardEntryAt(leaderboardName, index)?.personaName ?? "";
        },
        LeaderboardEntryRankAt(leaderboardName, index) {
            return this._getLeaderboardEntryAt(leaderboardName, index)?.globalRank ?? "";
        },
        LeaderboardEntryScoreAt(leaderboardName, index) {
            return this._getLeaderboardEntryAt(leaderboardName, index)?.score ?? "";
        }
    };
export {};
