
import type { SDKInstanceClass } from "./instance.ts";

const C3 = globalThis.C3;

C3.Plugins.Steamworks_Ext.Type = class SteamworksExtType extends globalThis.ISDKObjectTypeBase<SDKInstanceClass>
{
	constructor()
	{
		super();
	}
	
	_onCreate()
	{	
	}
};
