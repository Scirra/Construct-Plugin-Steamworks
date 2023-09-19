#pragma once

#include "IExtension.h"

std::wstring Utf8ToWide(const std::string& utf8string);
std::string WideToUtf8(const std::wstring& widestring);

std::vector<ExtensionParameter> UnpackExtensionParameterArray(size_t paramCount, const ExtensionParameterPOD* paramArr);
std::vector<NamedExtensionParameterPOD> PackNamedExtensionParameters(const std::map<std::string, ExtensionParameter>& params);