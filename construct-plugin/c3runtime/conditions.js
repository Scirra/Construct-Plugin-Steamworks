
const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Cnds =
{
	IsAvailable()
	{
		return this.isAvailable;
	},

	IsRunningOnSteamDeck()
	{
		return this.isRunningOnSteamDeck;
	},

	OnGameOverlayShown()
	{
		return true;
	},

	OnGameOverlayHidden()
	{
		return true;
	},

	OnAnyAchievementUnlockSuccess()
	{
		return true;
	},

	OnAchievementUnlockSuccess(achievement)
	{
		return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
	},

	OnAnyAchievementUnlockError()
	{
		return true;
	},

	OnAchievementUnlockError(achievement)
	{
		return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
	},

	OnDLCInstalledCheckComplete()
	{
		return true;
	},

	IsDLCInstalled(appId)
	{
		return this.isDlcInstalled(appId);
	},

	OnDLCInstalled()
	{
		return true;
	}
};
