#pragma once

class WrapperExtension;

// This class exists purely to receive callbacks from the Steamworks SDK,
// and forward them to WrapperExtension methods.
class SteamCallbacks {
public:
	SteamCallbacks(WrapperExtension& extension_);

protected:
	WrapperExtension& extension;

	STEAM_CALLBACK(SteamCallbacks, OnGameOverlayActivated, GameOverlayActivated_t);
	STEAM_CALLBACK(SteamCallbacks, OnUserStatsReceived, UserStatsReceived_t);
	STEAM_CALLBACK(SteamCallbacks, OnUserStatsStored, UserStatsStored_t);
	STEAM_CALLBACK(SteamCallbacks, OnDLCInstalled, DlcInstalled_t);
	STEAM_CALLBACK(SteamCallbacks, GetTicketForWebApiResponse, GetTicketForWebApiResponse_t);
};