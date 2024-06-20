
const SDK = self.SDK;

const PLUGIN_CLASS = SDK.Plugins.Steamworks_Ext;

PLUGIN_CLASS.Instance = class Steamworks_ExtInstance extends SDK.IInstanceBase
{
	constructor(sdkType: SDK.ITypeBase, inst: SDK.IObjectInstance)
	{
		super(sdkType, inst);
	}
	
	Release()
	{
	}
	
	OnCreate()
	{
	}
	
	OnPropertyChanged(id: string, value: EditorPropertyValueType)
	{
	}
	
	LoadC2Property(name: string, valueString: string)
	{
		return false;		// not handled
	}
};

export {}