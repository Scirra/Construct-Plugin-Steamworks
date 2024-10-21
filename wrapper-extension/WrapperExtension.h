
#include "IApplication.h"
#include "IExtension.h"

#include "SteamCallbacks.h"

class WrapperExtension : public IExtension {
public:
	WrapperExtension(IApplication* iApplication_);

	// IExtension overrides
	void Init();
	void Release();
#ifdef _WIN32
	void OnMainWindowCreated(HWND hWnd_);
#else
	void OnMainWindowCreated();
#endif

	// Web messaging methods
	void OnWebMessage(const char* messageId, size_t paramCount, const ExtensionParameterPOD* paramArr, double asyncId);
	void HandleWebMessage(const std::string& messageId, const std::vector<ExtensionParameter>& params, double asyncId);

	void SendWebMessage(const std::string& messageId, const std::map<std::string, ExtensionParameter>& params, double asyncId = -1.0);
	void SendAsyncResponse(const std::map<std::string, ExtensionParameter>& params, double asyncId);

	// Handler methods for specific kinds of message
	void OnInitMessage(const std::string& initAppId, bool isDevelopmentMode, double asyncId);
	void OnShowOverlayMessage(size_t option);
	void OnShowOverlayURLMessage(const std::string& url, bool isModal);
	void OnSetAchievementMessage(const std::string& name, double asyncId);
	void OnClearAchievementMessage(const std::string& name, double asyncId);
	void OnIsDLCInstalledMessage(const std::string& appIdStr, double asyncId);
	void OnInstallDLCMessage(AppId_t appId);
	void OnUninstallDLCMessage(AppId_t appId);

	// Steam events (called via SteamCallbacks class)
	void OnGameOverlayActivated(bool isShowing);
	void OnUserStatsReceived(EResult eResult);
	void OnUserStatsStored(EResult eResult);
	void OnDLCInstalledCallback(AppId_t appId);

protected:
	IApplication* iApplication;
	bool didSteamInitOk;

	std::unique_ptr<SteamCallbacks> steamCallbacks;
};