
#include "pch.h"

#include "SteamCallbacks.h"
#include "WrapperExtension.h"

// This class exists purely to receive callbacks from the Steamworks SDK,
// and forward them to WrapperExtension methods.
SteamCallbacks::SteamCallbacks(WrapperExtension& extension_)
	: extension(extension_)
{
}

void SteamCallbacks::OnGameOverlayActivated(GameOverlayActivated_t* pCallback)
{
	extension.OnGameOverlayActivated(pCallback->m_bActive);
}

void SteamCallbacks::OnUserStatsReceived(UserStatsReceived_t* pCallback)
{
	extension.OnUserStatsReceived(pCallback->m_eResult);
}

void SteamCallbacks::OnUserStatsStored(UserStatsStored_t* pCallback)
{
	extension.OnUserStatsStored(pCallback->m_eResult);
}

void SteamCallbacks::OnDLCInstalled(DlcInstalled_t* pCallback)
{
	extension.OnDLCInstalledCallback(pCallback->m_nAppID);
}