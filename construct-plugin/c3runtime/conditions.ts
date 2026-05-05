
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Cnds =
{
	IsAvailable(this: SDKInstanceClass)
	{
		return this.isAvailable;
	},

	IsRunningOnSteamDeck(this: SDKInstanceClass)
	{
		return this.isRunningOnSteamDeck;
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
	}
};
