
#include "pch.h"
#include "WrapperExtension.h"

#include "json.hpp"

#if defined(__APPLE__) || defined(__linux__)
#include <stdlib.h>		// for setenv()
#endif

const char* COMPONENT_ID = "scirra-steam";

//////////////////////////////////////////////////////
// Boilerplate stuff
WrapperExtension* g_Extension = nullptr;

// Main DLL export function to initialize extension.
extern "C" {
	DLLEXPORT IExtension* WrapperExtInit(IApplication* iApplication)
	{
		g_Extension = new WrapperExtension(iApplication);
		return g_Extension;
	}
}

// Helper method to call HandleWebMessage() with more useful types, as OnWebMessage() must deal with
// plain-old-data types for crossing a DLL boundary.
void WrapperExtension::OnWebMessage(const char* messageId_, size_t paramCount, const ExtensionParameterPOD* paramArr, double asyncId)
{
	HandleWebMessage(messageId_, UnpackExtensionParameterArray(paramCount, paramArr), asyncId);
}

void WrapperExtension::SendWebMessage(const std::string& messageId, const std::map<std::string, ExtensionParameter>& params, double asyncId)
{
	std::vector<NamedExtensionParameterPOD> paramArr = PackNamedExtensionParameters(params);
	iApplication->SendWebMessage(messageId.c_str(), paramArr.size(), paramArr.empty() ? nullptr : paramArr.data(), asyncId);
}

// Helper method for sending a response to an async message (when asyncId is not -1.0).
// In this case the message ID is not used, so this just calls SendWebMessage() with an empty message ID.
void WrapperExtension::SendAsyncResponse(const std::map<std::string, ExtensionParameter>& params, double asyncId)
{
	SendWebMessage("", params, asyncId);
}

//////////////////////////////////////////////////////
// WrapperExtension
WrapperExtension::WrapperExtension(IApplication* iApplication_)
	: iApplication(iApplication_),
	  didSteamInitOk(false),
	  pendingAuthTicketForWebApiAsyncId(-1)
{
	LogMessage("Loaded extension");

	// Tell the host application the SDK version used. Don't change this.
	iApplication->SetSdkVersion(WRAPPER_EXT_SDK_VERSION);

	// Register the "scirra-steam" component for JavaScript messaging
	iApplication->RegisterComponentId(COMPONENT_ID);
}

void WrapperExtension::Init()
{
	// Called during startup after all other extensions have been loaded.
	// Parse the content of package.json and read the exported app ID and development mode properties.
	// These are exported with the SetWrapperExportProperties() method and end up in package.json like this:
	//{
	//	...
	//	"exported-properties": {
	//		"scirra-steam": {
	//			"app-id": "480",
	//			"development-mode": true
	//		}
	//	}
	//}
	// Note the app ID is a string.
	std::string appId;
	bool isDevelopmentMode = false;

	try {
		auto packageJson = nlohmann::json::parse(iApplication->GetPackageJsonContent());
		const auto& steamProps = packageJson["exported-properties"][COMPONENT_ID];
		appId = steamProps["app-id"].get<std::string>();
		TrimString(appId);
		isDevelopmentMode = steamProps["development-mode"].get<bool>();

		std::stringstream ss;
		ss << "Parsed package JSON (app ID " << appId << ", development mode " << isDevelopmentMode << ")";
		LogMessage(ss.str());
	}
	catch (...)
	{
		LogMessage("Failed to read properties package JSON");
		return;
	}

	InitSteamworksSDK(appId, isDevelopmentMode);
}

void WrapperExtension::Release()
{
	LogMessage("Releasing extension");

	if (didSteamInitOk)
	{
		// Destroy SteamCallbacks class.
		steamCallbacks.reset(nullptr);

		// Shut down Steam API.
		SteamAPI_Shutdown();
	}
}

void WrapperExtension::InitSteamworksSDK(const std::string& initAppId, bool isDevelopmentMode)
{
	// Before calling SteamAPI_Init(), check if the plugin has an app ID set.
	if (!initAppId.empty())
	{
		// If development mode is set and an app ID is provided, then store the app ID
		// in the SteamAppId environment variable for this process. This is undocumented but
		// works OK and is used in other Steam codebases, and is a more convenient way to specify
		// the app ID during testing than having to use steam_appid.txt. Without this (if no
		// app ID is provided, or if development mode is turned off for release) then Steam will
		// determine the app ID automatically (including checking steam_appid.txt if anyone
		// prefers using that), but initialization will fail if Steam cannot determine any app ID.
		if (isDevelopmentMode)
		{
#ifdef _WIN32
			std::wstring initAppIdW = Utf8ToWide(initAppId);
			SetEnvironmentVariable(L"SteamAppId", initAppIdW.c_str());
#else
			setenv("SteamAppId", initAppId.c_str(), 1);
#endif
		}
		else
		{
			// When not in development mode, call SteamAPI_RestartAppIfNecessary() with the
			// provided app ID and quit the app if it returns true. This requires the app ID
			// as a number, so convert the string to a number (ignoring any exception). 
			// The presence of the SteamAppId environment variable (or steam_appid.txt)
			// suppresses SteamAPI_RestartAppIfNecessary() returning true, so this is
			// only done if the development mode setting is turned off.
			uint32 appId = 0;
			try {
				appId = std::stoul(initAppId);
			}
			catch (...)
			{
				appId = 0;				// ignore exception
			}

			if (appId != 0 && SteamAPI_RestartAppIfNecessary(appId))
			{
				LogMessage("SteamAPI_RestartAppIfNecessary() returned true; quitting app");
#ifdef _WIN32
				PostQuitMessage(0);
#else
				exit(0);
#endif

				// There's no point doing anything else now the app is quitting, so return.
				return;
			}
		}
	}

	// Initialize the Steam API.
	didSteamInitOk = SteamAPI_Init();
	if (didSteamInitOk)
	{
		LogMessage("Steam API initialized successfully");
	}
	else
	{
		LogMessage("Steam API failed to initialize");
	}
}

void WrapperExtension::LogMessage(const std::string& msg)
{
	// Log messages both to the browser console with the LogToConsole() method, and also to the debug output
	// with the DebugLog() helper function, to ensure whichever log we're looking at includes the log messages.
	std::stringstream ss;
	ss << "[Steamworks] " << msg;
	iApplication->LogToConsole(IApplication::LogLevel::normal, ss.str().c_str());
	
	// Add trailing newline for debug output
	ss << "\n";
	DebugLog(ss.str().c_str());
}

#ifdef _WIN32
void WrapperExtension::OnMainWindowCreated(HWND hWnd)
{
}
#else
void WrapperExtension::OnMainWindowCreated()
{
}
#endif

void WrapperExtension::OnGameOverlayActivated(bool isShowing)
{
	// Send message to JavaScript to fire overlay trigger.
	SendWebMessage("on-game-overlay-activated", {
		{ "isShowing", isShowing }
	});
}

void WrapperExtension::OnUserStatsReceived(EResult eResult)
{
	// Not currently used. Could be used to check RequestCurrentStats() completed successfully.
	LogMessage("On user stats received");
}

void WrapperExtension::OnUserStatsStored(EResult eResult)
{
	// Not currently used. Could be used to check StoreStats() completed successfully.
}

void WrapperExtension::OnDLCInstalledCallback(AppId_t appId)
{
	// Send message to JavaScript to fire corresponding trigger.
	SendWebMessage("on-dlc-installed", {
		{ "appId", static_cast<double>(appId) }
	});
}

// For handling a message sent from JavaScript.
// This method mostly just unpacks parameters and calls a dedicated method to handle the message.
void WrapperExtension::HandleWebMessage(const std::string& messageId, const std::vector<ExtensionParameter>& params, double asyncId)
{
	if (messageId == "init")
	{
		OnInitMessage(asyncId);
	}
	else if (messageId == "run-callbacks")
	{
		SteamAPI_RunCallbacks();
	}
	else if (messageId == "show-overlay")
	{
		size_t option = static_cast<size_t>(params[0].GetNumber());

		OnShowOverlayMessage(option);
	}
	else if (messageId == "show-overlay-url")
	{
		const std::string& url = params[0].GetString();
		bool isModal = params[1].GetBool();

		OnShowOverlayURLMessage(url, isModal);
	}
	else if (messageId == "set-achievement")
	{
		const std::string& name = params[0].GetString();

		OnSetAchievementMessage(name, asyncId);
	}
	else if (messageId == "clear-achievement")
	{
		const std::string& name = params[0].GetString();

		OnClearAchievementMessage(name, asyncId);
	}
	else if (messageId == "is-dlc-installed")
	{
		const std::string& appIdStr = params[0].GetString();

		OnIsDLCInstalledMessage(appIdStr, asyncId);
	}
	else if (messageId == "install-dlc")
	{
		AppId_t appId = static_cast<AppId_t>(params[0].GetNumber());

		OnInstallDLCMessage(appId);
	}
	else if (messageId == "uninstall-dlc")
	{
		AppId_t appId = static_cast<AppId_t>(params[0].GetNumber());

		OnUninstallDLCMessage(appId);
	}
	else if (messageId == "get-auth-ticket-for-web-api")
	{
		const std::string& identity = params[0].GetString();

		OnGetAuthTicketForWebApi(identity, asyncId);
	}
	else if (messageId == "cancel-auth-ticket")
	{
		HAuthTicket hAuthTicket = static_cast<HAuthTicket>(params[0].GetNumber());

		OnCancelAuthTicket(hAuthTicket);
	}
}

void WrapperExtension::OnInitMessage(double asyncId)
{
	// Note the actual initialization is done in InitSteamworksSDK(). This just sends the result
	// of initialization back to the Construct plugin.
	if (didSteamInitOk)
	{
		// Create SteamCallbacks class.
		// Note the Steamworks SDK documentation states that Steam should be initialized before creating
		// objects that listen for callbacks, which SteamCallbacks does, hence it being a separate class.
		steamCallbacks.reset(new SteamCallbacks(*this));

		// Get current steam user ID for accessing account IDs
		CSteamID steamId = SteamUser()->GetSteamID();

		// Get app owner ID as well, since it can be different from the current user if accessing the
		// app via Family Sharing.
		CSteamID appOwnerId = SteamApps()->GetAppOwner();

		// Send init data back to JavaScript with key details from the API.
		SendAsyncResponse({
			{ "isAvailable",				true },
			{ "isRunningOnSteamDeck",		SteamUtils()->IsSteamRunningOnSteamDeck() },

			{ "personaName",				SteamFriends()->GetPersonaName() },
			{ "accountId",					static_cast<double>(steamId.GetAccountID()) },
			// Note the static account key is a uint64 which isn't guaranteed to fit in JavaScript's
			// number type (as a double has only 53 bits of integer precision), so convert it to a string.
			{ "staticAccountKey",			std::to_string(steamId.GetStaticAccountKey()) },
			{ "playerSteamLevel",			static_cast<double>(SteamUser()->GetPlayerSteamLevel()) },

			// App owner account IDs, as per above
			{ "appOwnerAccountId",			static_cast<double>(appOwnerId.GetAccountID()) },
			{ "appOwnerStaticAccountKey",	std::to_string(appOwnerId.GetStaticAccountKey()) },

			{ "appId",						static_cast<double>(SteamUtils()->GetAppID()) },
			{ "steamUILanguage",			SteamUtils()->GetSteamUILanguage() },
			{ "currentGameLanguage",		SteamApps()->GetCurrentGameLanguage() },
			{ "availableGameLanguages",		SteamApps()->GetAvailableGameLanguages() }
			}, asyncId);
	}
	else
	{
		// If Steam did not initialize successfully none of the other details can be sent,
		// so just send a response with isAvailable set to false
		SendAsyncResponse({
			{ "isAvailable", false }
		}, asyncId);
	}
}

// String parameters for ActivateGameOverlay() in order they are specified by the addon
const char* overlayOptions[] = {
	"friends", "community", "players", "settings", "officialgamegroup", "stats", "achievements"
};

void WrapperExtension::OnShowOverlayMessage(size_t option)
{
	// The option is an index in to a combo matching the order of overlayOptions.
	size_t maxOpt = sizeof(overlayOptions) / sizeof(overlayOptions[0]);
	if (option >= maxOpt)
		return;
	
	SteamFriends()->ActivateGameOverlay(overlayOptions[option]);
}

void WrapperExtension::OnShowOverlayURLMessage(const std::string& url, bool isModal)
{
	SteamFriends()->ActivateGameOverlayToWebPage(url.c_str(),
		isModal ? k_EActivateGameOverlayToWebPageMode_Modal : k_EActivateGameOverlayToWebPageMode_Default);
}

void WrapperExtension::OnSetAchievementMessage(const std::string& name, double asyncId)
{
	if (SteamUserStats()->SetAchievement(name.c_str()))
	{
		// Successfully set achievement. Proceed to immediately send the changed
		// achievement data for permanent storage.
		if (SteamUserStats()->StoreStats())
		{
			// Successfully sent store request. Note this isn't actually guaranteed to be
			// successful until a UserStatsStored_t callback comes back with a success result,
			// but due to the complexity of handling async code in C++ this just isn't checked,
			// so reaching this point is treated as a successful change of achievement.
			SendAsyncResponse({
				{ "isOk", true }
			}, asyncId);
			return;
		}
	}
	
	// If reached here then something above failed, so send a failure result.
	SendAsyncResponse({
		{ "isOk", false }
	}, asyncId);
}

void WrapperExtension::OnClearAchievementMessage(const std::string& name, double asyncId)
{
	// As with OnSetAchievementMessage() but calls ClearAchievement().
	if (SteamUserStats()->ClearAchievement(name.c_str()))
	{
		if (SteamUserStats()->StoreStats())
		{
			SendAsyncResponse({
				{ "isOk", true }
			}, asyncId);
			return;
		}
	}

	SendAsyncResponse({
		{ "isOk", false }
	}, asyncId);
}

void WrapperExtension::OnIsDLCInstalledMessage(const std::string& appIdStr, double asyncId)
{
	std::vector<std::string> appIdArr = SplitString(appIdStr, ",");
	std::vector<std::string> results;

	for (auto i = appIdArr.begin(), end = appIdArr.end(); i != end; ++i)
	{
		AppId_t appId;
		try {
			appId = std::stoul(*i);
		}
		catch (...)
		{
			appId = 0;
		}

		results.push_back(appId != 0 && SteamApps()->BIsDlcInstalled(appId) ? "true" : "false");
	}

	SendAsyncResponse({
		{ "isOk", true },
		{ "results", JoinStrings(results, ",") }
	}, asyncId);
}

void WrapperExtension::OnInstallDLCMessage(AppId_t appId)
{
	SteamApps()->InstallDLC(appId);
}

void WrapperExtension::OnUninstallDLCMessage(AppId_t appId)
{
	SteamApps()->UninstallDLC(appId);
}

void WrapperExtension::OnGetAuthTicketForWebApi(const std::string& identity, double asyncId)
{
	// Save the pending async ID and wait for the GetTicketForWebApiResponse_t event, which then calls
	// OnGetTicketForWebApiResponse(). Note that as there does not appear to be any way to correlate
	// this call with the resulting event, this can only correctly handle one request at a time.
	// Therefore if another call is made while another is still pending, return a failure.
	if (pendingAuthTicketForWebApiAsyncId != -1)
	{
		LogMessage("GetAuthTicketForWebApi(): another call is in progress so failing");
		SendAsyncResponse({
			{ "isOk", false }
		}, asyncId);
		return;
	}

	pendingAuthTicketForWebApiAsyncId = asyncId;

	// If the identity is an empty string, pass nullptr instead of a string to indicate none provided.
	SteamUser()->GetAuthTicketForWebApi(identity.empty() ? nullptr : identity.c_str());
}

void WrapperExtension::OnGetTicketForWebApiResponse(GetTicketForWebApiResponse_t* pCallback)
{
	// Use the asyncId from the call to OnGetAuthTicketForWebApi().
	double asyncId = pendingAuthTicketForWebApiAsyncId;
	pendingAuthTicketForWebApiAsyncId = -1;

	// If the asyncId is -1, then we weren't expecting this callback. Just log a message and bail out.
	if (asyncId == -1)
	{
		LogMessage("GetAuthTicketForWebApi() callback ignored due to no async id");
		return;
	}

	if (pCallback->m_eResult != k_EResultOK || pCallback->m_hAuthTicket == k_HAuthTicketInvalid)
	{
		// Handle failure result
		LogMessage("GetAuthTicketForWebApi() failed: EResult " + std::to_string(pCallback->m_eResult));

		SendAsyncResponse({
			{ "isOk", false }
		}, asyncId);
	}
	else
	{
		// Success. Convert the ticket binary data to a hex string (validating the data looks OK).
		// Also note HAuthTicket is really a uint32 and so can safely be returned to JavaScript as a number.
		std::string ticketHexStr;
		if (pCallback->m_cubTicket > 0 && pCallback->m_cubTicket < GetTicketForWebApiResponse_t::k_nCubTicketMaxLength)
		{
			std::vector<uint8_t> ticketBytes(pCallback->m_rgubTicket, pCallback->m_rgubTicket + pCallback->m_cubTicket);
			ticketHexStr = BytesToHexString(ticketBytes);
		}

		SendAsyncResponse({
			{ "isOk", true },
			{ "authTicket", static_cast<double>(pCallback->m_hAuthTicket) },
			{ "ticketHexStr", ticketHexStr }
		}, asyncId);
	}
}

void WrapperExtension::OnCancelAuthTicket(HAuthTicket hAuthTicket)
{
	SteamUser()->CancelAuthTicket(hAuthTicket);
}