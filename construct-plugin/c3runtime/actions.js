const C3 = globalThis.C3;
C3.Plugins.Steamworks_Ext.Acts =
    {
        ShowOverlay(option) {
            this._showOverlay(option);
        },
        ShowOverlayURL(url, modal) {
            this._showOverlayURL(url, modal);
        },
        ShowOverlayInviteDialog(lobbyId) {
            this._showOverlayInviteDialog(lobbyId);
        },
        async UnlockAchievement(achievement) {
            await this.unlockAchievement(achievement);
        },
        async ClearAchievement(achievement) {
            await this.clearAchievement(achievement);
        },
        async GetAchievementInfo(achievement) {
            await this.getAchievementInfo(achievement);
        },
        async CheckDLCInstalled(appIds) {
            let appIdArr;
            if (typeof appIds === "number")
                appIdArr = [appIds];
            else
                appIdArr = appIds.split(",").map(s => Number(s));
            await this.checkDlcInstalled(appIdArr);
        },
        InstallDLC(appId) {
            this.installDlc(appId);
        },
        UninstallDLC(appId) {
            this.uninstallDlc(appId);
        },
        async GetAuthTicketForWebApi(identity) {
            await this.getAuthTicketForWebApi(identity);
        },
        CancelAuthTicket(authTicket) {
            this.cancelAuthTicket(authTicket);
        },
        SetRichPresence(key, value) {
            this.setRichPresence(key, value);
        },
        ClearRichPresence() {
            this.clearRichPresence();
        },
        TriggerScreenshot() {
            this.triggerScreenshot();
        },
        async UploadLeaderboardScore(leaderboardName, score, forceUpdate) {
            await this.uploadLeaderboardScore(leaderboardName, score, forceUpdate);
        },
        async DownloadLeaderboardEntries(leaderboardName, dataType, start, end) {
            await this.downloadLeaderboardEntries(leaderboardName, ["global", "global-around-user", "friends"][dataType], start, end);
        }
    };
export {};
