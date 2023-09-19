
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.Steamworks_Ext;

PLUGIN_CLASS.Instance = class Steamworks_ExtInstance extends SDK.IInstanceBase
{
	constructor(sdkType, inst)
	{
		super(sdkType, inst);
	}
	
	Release()
	{
	}
	
	OnCreate()
	{
	}
	
	OnPropertyChanged(id, value)
	{
	}
	
	LoadC2Property(name, valueString)
	{
		return false;		// not handled
	}
};
