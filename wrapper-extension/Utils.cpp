
#include "pch.h"
#include "Utils.h"

#include <algorithm>	// std::find_if

#ifdef __APPLE__
#import <Foundation/Foundation.h>
#elif __linux__
#include <iostream>		// std::cout (for DebugLog)
#endif

#ifdef _WIN32

std::wstring Utf8ToWide(const std::string& utf8string)
{
	// Empty strings are equivalent
	if (utf8string.empty())
		return std::wstring();

	// Request number of wchars needed to fit this string (note some arguments are int instead of size_t)
	int wcharcount = MultiByteToWideChar(CP_UTF8, 0, utf8string.data(), (int)utf8string.size(), NULL, 0);

	// Conversion failed or still empty: return empty string
	if (wcharcount <= 0)
		return std::wstring();

	// Create a string to return and allocate memory for the content
	std::wstring buffer;
	buffer.resize(wcharcount);

	// Do the conversion
	MultiByteToWideChar(CP_UTF8, 0, utf8string.data(), (int)utf8string.size(), &(buffer.front()), wcharcount);

	// Return converted string
	return buffer;
}

std::string WideToUtf8(const std::wstring& widestring)
{
	// Empty strings are equivalent
	if (widestring.empty())
		return std::string();

	// Calculate bytes required for output buffer (note some arguments are int instead of size_t)
	int bytecount = WideCharToMultiByte(CP_UTF8, 0, widestring.data(), (int)widestring.size(), NULL, 0, NULL, NULL);

	// Conversion failed or still empty: return empty string
	if (bytecount <= 0)
		return std::string();

	// Create a string to return and allocate memory for the content
	std::string buffer;
	buffer.resize(bytecount);

	// Do the conversion
	WideCharToMultiByte(CP_UTF8, 0, widestring.data(), (int)widestring.size(), &(buffer.front()), bytecount, NULL, NULL);

	// Return converted string
	return buffer;
}

#endif // _WIN32

std::vector<ExtensionParameter> UnpackExtensionParameterArray(size_t paramCount, const ExtensionParameterPOD* paramArr)
{
	std::vector<ExtensionParameter> ret;
	ret.reserve(paramCount);

	for (size_t i = 0; i < paramCount; ++i)
	{
		const ExtensionParameterPOD& epRaw = paramArr[i];

		ExtensionParameter ep = {};
		ep.type = epRaw.type;

		switch (epRaw.type) {
		case EPT_Boolean:		// boolean also stored in number field
		case EPT_Number:
			ep.number = epRaw.number;
			break;
		case EPT_String:
			ep.str = epRaw.str;
			break;
		}

		ret.push_back(ep);
	}

	return ret;
}

std::vector<NamedExtensionParameterPOD> PackNamedExtensionParameters(const std::map<std::string, ExtensionParameter>& params)
{
	std::vector<NamedExtensionParameterPOD> ret;
	ret.reserve(params.size());

	for (auto i = params.begin(), end = params.end(); i != end; ++i)
	{
		NamedExtensionParameterPOD nep = {};
		nep.key = i->first.c_str();
		nep.value.type = i->second.type;

		switch (i->second.type) {
		case EPT_Boolean:		// boolean also stored in number field
		case EPT_Number:
			nep.value.number = i->second.number;
			break;
		case EPT_String:
			nep.value.str = i->second.str.c_str();
			break;
		}

		ret.push_back(nep);
	}

	return ret;
}

void DebugLog(const std::string& message)
{
	// Use OutputDebugString() on Windows and NSLog() on macOS. On Linux just log to the terminal.
#ifdef _WIN32
	std::wstring messageW = Utf8ToWide(message);
	OutputDebugString(messageW.c_str());
#elif __APPLE__
    NSString* nsStr = [NSString stringWithUTF8String:message.c_str()];
    NSLog(@"%@", nsStr);
#else
	std::cout << message;
#endif
}

std::vector<std::string> SplitString(const std::string& str, const std::string& sep)
{
	std::vector<std::string> ret;
	size_t next = 0;
	size_t last = 0;

	while ((next = str.find(sep, last)) != std::string::npos)
	{
		ret.push_back(str.substr(last, next - last));
		last = next + sep.length();
	}

	ret.push_back(str.substr(last));
	return ret;
}

std::string JoinStrings(const std::vector<std::string>& vec, const std::string& sep)
{
	std::string ret;

	for (auto i = vec.begin(), end = vec.end(); i != end; ++i)
	{
		ret += *i;

		if (i + 1 != end)
			ret += sep;
	}

	return ret;
}

// Trim whitespace from a string
void TrimStringLeft(std::string& str)
{
	auto i = std::find_if(str.begin(), str.end(), [](char ch) {
		return !std::isspace(ch);
		});

	str.erase(str.begin(), i);
}

void TrimStringRight(std::string& str)
{
	while (!str.empty() && std::isspace(str.back()))
		str.pop_back();
}

void TrimString(std::string& str)
{
	TrimStringRight(str);
	TrimStringLeft(str);
}