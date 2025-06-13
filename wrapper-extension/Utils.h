#pragma once

#include "IExtension.h"

#ifdef _WIN32

std::wstring Utf8ToWide(const std::string& utf8string);
std::string WideToUtf8(const std::wstring& widestring);

#endif

std::vector<ExtensionParameter> UnpackExtensionParameterArray(size_t paramCount, const ExtensionParameterPOD* paramArr);
std::vector<NamedExtensionParameterPOD> PackNamedExtensionParameters(const std::map<std::string, ExtensionParameter>& params);

void DebugLog(const std::string& message);

std::vector<std::string> SplitString(const std::string& str, const std::string& sep);
std::string JoinStrings(const std::vector<std::string>& vec, const std::string& sep);

void TrimString(std::string& str);
