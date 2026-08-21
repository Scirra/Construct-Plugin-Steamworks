const C3 = globalThis.C3;
C3.Plugins.Steamworks_Ext.Cnds =
    {
        IsAvailable() {
            return this.isAvailable;
        },
        // Deprecated condition - superseded by IsRunningOnSteamHardware
        IsRunningOnSteamDeck() {
            return this.isRunningOnSteamDeck;
        },
        IsRunningOnSteamHardware(index) {
            const steamHardware = this.runningOnSteamHardware;
            // Note the index is 0 = none, 1 = steam deck, 2 = steam machine, 3 = steam frame, 4 = any.
            // For "any", just check that the steam hardware is not "none".
            if (index === 4) {
                return steamHardware !== "none";
            }
            else {
                return steamHardware === ["none", "steam-deck", "steam-machine", "steam-frame"][index];
            }
        },
        IsRunningUnderProton() {
            return this.isRunningUnderProton;
        },
        OnGameOverlayShown() {
            return true;
        },
        OnGameOverlayHidden() {
            return true;
        },
        OnAnyAchievementUnlockSuccess() {
            return true;
        },
        OnAchievementUnlockSuccess(achievement) {
            return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
        },
        OnAnyAchievementUnlockError() {
            return true;
        },
        OnAchievementUnlockError(achievement) {
            return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
        },
        OnAnyGetAchievementInfoSuccess() {
            return true;
        },
        OnGetAchievementInfoSuccess(achievement) {
            return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
        },
        OnAnyGetAchievementInfoError() {
            return true;
        },
        OnGetAchievementInfoError(achievement) {
            return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
        },
        AchievementIsAchieved() {
            return this._getAchievementIsAchieved();
        },
        OnAnyGetStat() {
            return true;
        },
        OnGetStat(name) {
            return this._triggerStatName === name;
        },
        OnDLCInstalledCheckComplete() {
            return true;
        },
        IsDLCInstalled(appId) {
            return this.isDlcInstalled(appId);
        },
        OnDLCInstalled() {
            return true;
        },
        OnGetAuthTicketForWebApiSuccess() {
            return true;
        },
        OnGetAuthTicketForWebApiError() {
            return true;
        },
        OnAnyUploadLeaderboardScoreSuccess() {
            return true;
        },
        OnUploadLeaderboardScoreSuccess(leaderboardName) {
            return leaderboardName === this._triggerLeaderboardName;
        },
        OnAnyUploadLeaderboardScoreError() {
            return true;
        },
        OnUploadLeaderboardScoreError(leaderboardName) {
            return leaderboardName === this._triggerLeaderboardName;
        },
        DidScoreChange() {
            return this._triggerDidScoreChange;
        },
        OnAnyDownloadLeaderboardEntriesSuccess() {
            return true;
        },
        OnDownloadLeaderboardEntriesSuccess(leaderboardName) {
            return leaderboardName === this._triggerLeaderboardName;
        },
        OnAnyDownloadLeaderboardEntriesError() {
            return true;
        },
        OnDownloadLeaderboardEntriesError(leaderboardName) {
            return leaderboardName === this._triggerLeaderboardName;
        }
    };
export {};
