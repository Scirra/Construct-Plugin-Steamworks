
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Cnds =
{
	IsAvailable(this: SDKInstanceClass)
	{
		return this.isAvailable;
	},

	// Deprecated condition - superseded by IsRunningOnSteamHardware
	IsRunningOnSteamDeck(this: SDKInstanceClass)
	{
		return this.isRunningOnSteamDeck;
	},

	IsRunningOnSteamHardware(this: SDKInstanceClass, index: number)
	{
		const steamHardware = this.runningOnSteamHardware;

		// Note the index is 0 = none, 1 = steam deck, 2 = steam machine, 3 = steam frame, 4 = any.
		// For "any", just check that the steam hardware is not "none".
		if (index === 4)
		{
			return steamHardware !== "none";
		}
		else
		{
			return steamHardware === ["none", "steam-deck", "steam-machine", "steam-frame"][index];
		}
	},

	IsRunningUnderProton(this: SDKInstanceClass)
	{
		return this.isRunningUnderProton;
	},

	OnGameOverlayShown(this: SDKInstanceClass)
	{
		return true;
	},

	OnGameOverlayHidden(this: SDKInstanceClass)
	{
		return true;
	},

	OnAnyAchievementUnlockSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnAchievementUnlockSuccess(this: SDKInstanceClass, achievement: string)
	{
		return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
	},

	OnAnyAchievementUnlockError(this: SDKInstanceClass)
	{
		return true;
	},

	OnAchievementUnlockError(this: SDKInstanceClass, achievement: string)
	{
		return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
	},

	OnAnyGetAchievementInfoSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnGetAchievementInfoSuccess(this: SDKInstanceClass, achievement: string)
	{
		return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
	},

	OnAnyGetAchievementInfoError(this: SDKInstanceClass)
	{
		return true;
	},
	
	OnGetAchievementInfoError(this: SDKInstanceClass, achievement: string)
	{
		return achievement.toLowerCase() === this._triggerAchievement.toLowerCase();
	},

	AchievementIsAchieved(this: SDKInstanceClass)
	{
		return this._getAchievementIsAchieved();
	},

	OnAnyGetStat(this: SDKInstanceClass)
	{
		return true
	},

	OnGetStat(this: SDKInstanceClass, name: string)
	{
		return this._triggerStatName === name;
	},

	OnDLCInstalledCheckComplete(this: SDKInstanceClass)
	{
		return true;
	},

	IsDLCInstalled(this: SDKInstanceClass, appId: number)
	{
		return this.isDlcInstalled(appId);
	},

	OnDLCInstalled(this: SDKInstanceClass)
	{
		return true;
	},

	OnGetAuthTicketForWebApiSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnGetAuthTicketForWebApiError(this: SDKInstanceClass)
	{
		return true;
	},

	OnAnyUploadLeaderboardScoreSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnUploadLeaderboardScoreSuccess(this: SDKInstanceClass, leaderboardName: string)
	{
		return leaderboardName === this._triggerLeaderboardName;
	},

	OnAnyUploadLeaderboardScoreError(this: SDKInstanceClass)
	{
		return true;
	},

	OnUploadLeaderboardScoreError(this: SDKInstanceClass, leaderboardName: string)
	{
		return leaderboardName === this._triggerLeaderboardName;
	},

	DidScoreChange(this: SDKInstanceClass)
	{
		return this._triggerDidScoreChange;
	},

	OnAnyDownloadLeaderboardEntriesSuccess(this: SDKInstanceClass)
	{
		return true;
	},

	OnDownloadLeaderboardEntriesSuccess(this: SDKInstanceClass, leaderboardName: string)
	{
		return leaderboardName === this._triggerLeaderboardName;
	},

	OnAnyDownloadLeaderboardEntriesError(this: SDKInstanceClass)
	{
		return true;
	},

	OnDownloadLeaderboardEntriesError(this: SDKInstanceClass, leaderboardName: string)
	{
		return leaderboardName === this._triggerLeaderboardName;
	}
};
