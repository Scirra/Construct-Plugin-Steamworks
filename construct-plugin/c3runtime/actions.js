
const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Acts =
{
	ShowOverlay(option)
	{
		this._showOverlay(option);
	},

	ShowOverlayURL(url, modal)
	{
		this._showOverlayURL(url, modal);
	},

	async UnlockAchievement(achievement)
	{
		await this.unlockAchievement(achievement);
	},

	async ClearAchievement(achievement)
	{
		await this.clearAchievement(achievement);
	}
};
