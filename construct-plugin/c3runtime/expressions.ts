
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Exps =
{
	AccountID(this: SDKInstanceClass)
	{
		return this.accountId;
	},

	StaticAccountKey(this: SDKInstanceClass)
	{
		return this.staticAccountKey;
	},

	PersonaName(this: SDKInstanceClass)
	{
		return this.personaName;
	},

	PlayerSteamLevel(this: SDKInstanceClass)
	{
		return this.playerSteamLevel;
	},

	AppID(this: SDKInstanceClass)
	{
		return this.appId;
	},

	SteamUILanguage(this: SDKInstanceClass)
	{
		return this.steamUILanguage;
	},

	CurrentGameLanguage(this: SDKInstanceClass)
	{
		return this.currentGameLanguage;
	},

	AvailableGameLanguages(this: SDKInstanceClass)
	{
		// note expression returns comma-separated string
		return this._availableGameLanguages;
	},

	Achievement(this: SDKInstanceClass)
	{
		return this._triggerAchievement;
	},

	TriggerAppID(this: SDKInstanceClass)
	{
		return this._triggerAppId;
	}
};
