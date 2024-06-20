
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.Steamworks_Ext;

PLUGIN_CLASS.Type = class Steamworks_ExtType extends SDK.ITypeBase
{
	constructor(sdkPlugin: SDK.IPluginBase, iObjectType: SDK.IObjectType)
	{
		super(sdkPlugin, iObjectType);
	}
};

export {}