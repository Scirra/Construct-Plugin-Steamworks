const SDK = self.SDK;
////////////////////////////////////////////
// The plugin ID is how Construct identifies different kinds of plugins.
// *** NEVER CHANGE THE PLUGIN ID AFTER RELEASING A PLUGIN! ***
// If you change the plugin ID after releasing the plugin, Construct will think it is an entirely different
// plugin and assume it is incompatible with the old one, and YOU WILL BREAK ALL EXISTING PROJECTS USING THE PLUGIN.
// Only the plugin name is displayed in the editor, so to rename your plugin change the name but NOT the ID.
// If you want to completely replace a plugin, make it deprecated (it will be hidden but old projects keep working),
// and create an entirely new plugin with a different plugin ID.
const PLUGIN_ID = "Steamworks_Ext";
////////////////////////////////////////////
const PLUGIN_CATEGORY = "platform-specific";
const PLUGIN_CLASS = SDK.Plugins.Steamworks_Ext = class Steamworks_Ext extends SDK.IPluginBase {
    constructor() {
        super(PLUGIN_ID);
        SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());
        this._info.SetName(self.lang(".name"));
        this._info.SetDescription(self.lang(".description"));
        this._info.SetCategory(PLUGIN_CATEGORY);
        this._info.SetAuthor("Scirra");
        this._info.SetHelpUrl(self.lang(".help-url"));
        this._info.SetIsSingleGlobal(true);
        this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
        SDK.Lang.PushContext(".properties");
        this._info.SetProperties([
            new SDK.PluginProperty("text", "app-id"),
            new SDK.PluginProperty("check", "development-mode", true),
            new SDK.PluginProperty("check", "enable-overlay", true)
        ]);
        this._info.SetWrapperExportProperties("scirra-steam", ["app-id", "development-mode"]);
        SDK.Lang.PopContext(); // .properties
        SDK.Lang.PopContext();
        // Add necessary DLLs as wrapper extension dependencies.
        this._info.AddFileDependency({
            filename: "Steam_x64.ext.dll",
            type: "wrapper-extension",
            platform: "windows-x64"
        });
        this._info.AddFileDependency({
            filename: "steam_api64.dll",
            type: "wrapper-extension",
            platform: "windows-x64"
        });
        this._info.AddFileDependency({
            filename: "D3D11Overlay_x64.ext.dll",
            type: "wrapper-extension",
            platform: "windows-x64"
        });
        this._info.AddFileDependency({
            filename: "steamworks.ext.dylib",
            type: "wrapper-extension",
            platform: "macos-universal"
        });
        this._info.AddFileDependency({
            filename: "libsteam_api.dylib",
            type: "wrapper-extension",
            platform: "macos-universal"
        });
        this._info.AddFileDependency({
            filename: "steamworks-x64.ext.so",
            type: "wrapper-extension",
            platform: "linux-x64"
        });
        this._info.AddFileDependency({
            filename: "libsteam_api.so",
            type: "wrapper-extension",
            platform: "linux-x64"
        });
    }
};
PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
export {};
