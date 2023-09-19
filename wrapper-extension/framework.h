#pragma once

// Windows header files
#define WIN32_LEAN_AND_MEAN             // Exclude rarely-used stuff from Windows headers
#include <windows.h>

// STL includes
#include <vector>		// std::vector
#include <map>			// std::map
#include <string>		// std::wstring
#include <memory>		// std::unique_ptr

// Include Steamworks SDK.
// Add a compile check for the header as it's not shipped with this codebase.
// The SDK should be extracted in a subfolder named "steamworks-sdk", such that the include path below exists.
#if __has_include("steamworks-sdk\\public\\steam\\steam_api.h")

	// NOTE: the project properties define _CRT_SECURE_NO_WARNINGS to suppress security errors in the Steamworks SDK
	#include "steamworks-sdk\\public\\steam\\steam_api.h"

	// Link Steamworks lib file
#if defined(_M_X64)
	#pragma comment(lib, "steamworks-sdk\\redistributable_bin\\win64\\steam_api64.lib")
#elif defined(_M_IX86)
	#pragma comment(lib, "steamworks-sdk\\redistributable_bin\\steam_api.lib")
#else
	#error "Unable to identify architecture for Steamworks lib file"
#endif

#else
	#error "Unable to find steam_api.h. Make sure the Steamworks SDK is extracted in the steamworks-sdk subfolder such that the file 'steamworks-sdk\\public\\steam\\steam_api.h' exists."
#endif

// SDK utilities
#include "Utils.h"
