
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Exps =
{
	AccountID(this: SDKInstanceClass)
	{
		return this.accountId;
	},

	SteamID64Bit(this: SDKInstanceClass)
	{
		return this.steamId64Bit;
	},

	StaticAccountKey(this: SDKInstanceClass)
	{
		return this.staticAccountKey;
	},

	AppOwnerAccountID(this: SDKInstanceClass)
	{
		return this.appOwnerAccountId;
	},

	AppOwnerSteamID64Bit(this: SDKInstanceClass)
	{
		return this.appOwnerSteamId64Bit;
	},

	AppOwnerStaticAccountKey(this: SDKInstanceClass)
	{
		return this.appOwnerStaticAccountKey;
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

	AchievementUnlockTime(this: SDKInstanceClass)
	{
		return this._getAchievementUnlockTime();
	},

	TriggerAppID(this: SDKInstanceClass)
	{
		return this._triggerAppId;
	},

	AuthTicket(this: SDKInstanceClass)
	{
		return this.authTicket;
	},

	TicketHexStr(this: SDKInstanceClass)
	{
		return this.ticketHexStr;
	},

	GlobalRankNew(this: SDKInstanceClass)
	{
		return this._triggerGlobalRankNew;
	},

	GlobalRankPrevious(this: SDKInstanceClass)
	{
		return this._triggerGlobalRankPrevious;
	},

	LeaderboardName(this: SDKInstanceClass)
	{
		return this._triggerLeaderboardName;
	},

	LeaderboardEntryCount(this: SDKInstanceClass, leaderboardName: string)
	{
		return this._getLeaderboardEntryCount(leaderboardName);
	},

	LeaderboardEntryNameAt(this: SDKInstanceClass, leaderboardName: string, index: number)
	{
		return this._getLeaderboardEntryAt(leaderboardName, index)?.personaName ?? "";
	},

	LeaderboardEntryRankAt(this: SDKInstanceClass, leaderboardName: string, index: number)
	{
		return this._getLeaderboardEntryAt(leaderboardName, index)?.globalRank ?? "";
	},

	LeaderboardEntryScoreAt(this: SDKInstanceClass, leaderboardName: string, index: number)
	{
		return this._getLeaderboardEntryAt(leaderboardName, index)?.score ?? "";
	}
};
