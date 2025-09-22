const C3 = globalThis.C3;
C3.Plugins.Steamworks_Ext.Acts =
    {
        ShowOverlay(option) {
            this._showOverlay(option);
        },
        ShowOverlayURL(url, modal) {
            this._showOverlayURL(url, modal);
        },
        async UnlockAchievement(achievement) {
            await this.unlockAchievement(achievement);
        },
        async ClearAchievement(achievement) {
            await this.clearAchievement(achievement);
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
        }
    };
export {};
