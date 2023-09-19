
const C3 = self.C3;

C3.Plugins.Steamworks_Ext.Cnds =
{
	IsAvailable()
	{
		return this._IsAvailable();
	},

	IsRunningOnSteamDeck()
	{
		return this._IsRunningOnSteamDeck();
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
	}
};
