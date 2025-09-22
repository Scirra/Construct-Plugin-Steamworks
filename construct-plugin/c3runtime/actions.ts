
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Acts =
{
	ShowOverlay(this: SDKInstanceClass, option: number)
	{
		this._showOverlay(option);
	},

	ShowOverlayURL(this: SDKInstanceClass, url: string, modal: boolean)
	{
		this._showOverlayURL(url, modal);
	},

	async UnlockAchievement(this: SDKInstanceClass, achievement: string)
	{
		await this.unlockAchievement(achievement);
	},

	async ClearAchievement(this: SDKInstanceClass, achievement: string)
	{
		await this.clearAchievement(achievement);
	},

	async CheckDLCInstalled(this: SDKInstanceClass, appIds: string | number)
	{
		let appIdArr;
		if (typeof appIds === "number")
			appIdArr = [appIds];
		else
			appIdArr = appIds.split(",").map(s => Number(s));

		await this.checkDlcInstalled(appIdArr);
	},

	InstallDLC(this: SDKInstanceClass, appId: number)
	{
		this.installDlc(appId);
	},

	UninstallDLC(this: SDKInstanceClass, appId: number)
	{
		this.uninstallDlc(appId);
	},

	async GetAuthTicketForWebApi(this: SDKInstanceClass, identity: string)
	{
		await this.getAuthTicketForWebApi(identity);
	},

	CancelAuthTicket(this: SDKInstanceClass, authTicket: number)
	{
		this.cancelAuthTicket(authTicket);
	},

	SetRichPresence(this: SDKInstanceClass, key: string, value: string)
	{
		this.setRichPresence(key, value);
	},

	ClearRichPresence(this: SDKInstanceClass)
	{
		this.clearRichPresence();
	}
};
