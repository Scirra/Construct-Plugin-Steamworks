
const C3 = self.C3;

C3.Plugins.Steamworks_Ext.Acts =
{
	ShowOverlay(option)
	{
		this._ShowOverlay(option);
	},

	ShowOverlayURL(url, modal)
	{
		this._ShowOverlayURL(url, modal);
	},

	async UnlockAchievement(achievement)
	{
		await this._UnlockAchievement(achievement);
	},

	async ClearAchievement(achievement)
	{
		await this._ClearAchievement(achievement);
	}
};
