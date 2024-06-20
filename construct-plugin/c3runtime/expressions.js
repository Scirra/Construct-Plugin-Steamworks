
const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Exps =
{
	AccountID()
	{
		return this.accountId;
	},

	StaticAccountKey()
	{
		return this.staticAccountKey;
	},

	PersonaName()
	{
		return this.personaName;
	},

	PlayerSteamLevel()
	{
		return this.playerSteamLevel;
	},

	AppID()
	{
		return this.appId;
	},

	SteamUILanguage()
	{
		return this.steamUILanguage;
	},

	CurrentGameLanguage()
	{
		return this.currentGameLanguage;
	},

	AvailableGameLanguages()
	{
		// note expression returns comma-separated string
		return this._availableGameLanguages;
	},

	Achievement()
	{
		return this._triggerAchievement;
	}
};
