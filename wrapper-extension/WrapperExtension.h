
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

	void InitSteamworksSDK(const std::string& initAppId, bool isDevelopmentMode);
	void LogMessage(const std::string& msg);

	// Web messaging methods
	void OnWebMessage(const char* messageId, size_t paramCount, const ExtensionParameterPOD* paramArr, double asyncId);
	void HandleWebMessage(const std::string& messageId, const std::vector<ExtensionParameter>& params, double asyncId);

	void SendWebMessage(const std::string& messageId, const std::map<std::string, ExtensionParameter>& params, double asyncId = -1.0);
	void SendAsyncResponse(const std::map<std::string, ExtensionParameter>& params, double asyncId);

	// Handler methods for specific kinds of message
	void OnInitMessage(double asyncId);
	void OnShowOverlayMessage(size_t option);
	void OnShowOverlayURLMessage(const std::string& url, bool isModal);
	void OnShowOverlayInviteDialog(const std::string& steamIdLobbyStr);
	void OnSetAchievementMessage(const std::string& name, double asyncId);
	void OnClearAchievementMessage(const std::string& name, double asyncId);
	void OnGetAchievementInfoMessage(const std::string& name, double asyncId);
	void OnSetStat(const std::string& apiName, double data, bool isInt, double asyncId);
	void OnGetStat(const std::string& apiName, bool isInt, double asyncId);
	void OnStoreStats(double asyncId);
	void OnResetAllStats(bool achievementsToo, double asyncId);
	void OnIsDLCInstalledMessage(const std::string& appIdStr, double asyncId);
	void OnInstallDLCMessage(AppId_t appId);
	void OnUninstallDLCMessage(AppId_t appId);
	void OnGetAuthTicketForWebApi(const std::string& identity, double asyncId);
	void OnCancelAuthTicket(HAuthTicket hAuthTicket);
	void OnFindLeaderboard(const std::string& leaderboardName, double asyncId);
	void OnUploadLeaderboardScore(const std::string& hSteamLeaderboardStr, int32_t score, bool forceUpdate, double asyncId);
	void OnDownloadLeaderboardEntries(const std::string& hSteamLeaderboardStr, const std::string& dataRequestStr, int start, int end, double asyncId);
	void OnGetLeaderboardEntry(const std::string& hSteamLeaderboardEntriesStr, int index, double asyncId);
	void OnSetRichPresence(const std::string& key, const std::string& value);
	void OnClearRichPresence();
	void OnTriggerScreenshot();
	void OnScreenshotData(const std::string& base64data, int width, int height);

	// Steam events (called via SteamCallbacks class)
	void OnGameOverlayActivated(bool isShowing);
	void OnUserStatsReceived(EResult eResult);
	void OnUserStatsStored(EResult eResult);
	void OnDLCInstalledCallback(AppId_t appId);
	void OnGetTicketForWebApiResponse(GetTicketForWebApiResponse_t* pCallback);
	void OnScreenshotRequested();

protected:
	IApplication* iApplication;
	bool didSteamInitOk;

	double pendingAuthTicketForWebApiAsyncId;
	double pendingFindLeaderboardAsyncId;
	double pendingUploadLeaderboardScoreAsyncId;
	double pendingDownloadLeaderboardEntriesAsyncId;

	std::unique_ptr<SteamCallbacks> steamCallbacks;

	void OnFindLeaderboardResult(LeaderboardFindResult_t* pCallback, bool bIOFailure);
	CCallResult<WrapperExtension, LeaderboardFindResult_t> findLeaderboardCallResult;

	void OnUploadLeaderboardScoreResult(LeaderboardScoreUploaded_t* pCallback, bool bIOFailure);
	CCallResult<WrapperExtension, LeaderboardScoreUploaded_t> uploadLeaderboardScoreCallResult;

	void OnDownloadLeaderboardEntriesResult(LeaderboardScoresDownloaded_t* pCallback, bool bIOFailure);
	CCallResult<WrapperExtension, LeaderboardScoresDownloaded_t> downloadLeaderboardEntriesCallResult;
};