
const C3 = self.C3;

C3.Plugins.Steamworks_Ext.Exps =
{
	AccountID()
	{
		return this._GetAccountID();
	},

	StaticAccountKey()
	{
		return this._GetStaticAccountKey();
	},

	PersonaName()
	{
		return this._GetPersonaName();
	},

	PlayerSteamLevel()
	{
		return this._GetPlayerSteamLevel();
	},

	AppID()
	{
		return this._GetAppID();
	},

	SteamUILanguage()
	{
		return this._GetSteamUILanguage();
	},

	CurrentGameLanguage()
	{
		return this._GetCurrentGameLanguage();
	},

	AvailableGameLanguages()
	{
		return this._GetAvailableGameLanguages();
	},

	Achievement()
	{
		return this._triggerAchievement;
	}
};
