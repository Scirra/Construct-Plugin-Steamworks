
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
	}
};
