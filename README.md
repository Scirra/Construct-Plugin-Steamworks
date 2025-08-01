# Steamworks for Windows, macOS & Linux

This repository contains code for the [Steamworks Construct plugin](https://www.construct.net/en/make-games/addons/1105/steamworks), and its associated wrapper extension (a DLL which integrates the Steamworks SDK). This allows integrating Construct projects with Steam using the Windows WebView2, macOS WKWebView and Linux CEF export options. There are two main components in this repository:

- *construct-plugin*: the Construct plugin, written in JavaScript using the [Construct Addon SDK](https://github.com/Scirra/Construct-Addon-SDK)
- *wrapper-extension*: a Visual Studio 2022 project, Xcode project, and CMake project to build the wrapper extension DLL on Windows, macOS and Linux respectively, written in C++.

The wrapper extension builds an *.ext.dll* (Windows), *.ext.dylib* (macOS) and *.ext.so* (Linux) file in the *construct-plugin* subfolder. The Construct plugin is configured to load the wrapper extension in the Windows/macOS/Linux exporters, and then communicates with it via a messaging API.

## Build

> [!WARNING]
> If you want to modify the plugin for your own purposes, we strongly advise to **change the Construct plugin ID.** This will avoid serious compatibility problems which could result in your project becoming unopenable. For more information see the [Contributing guide](https://github.com/Scirra/Construct-Plugin-Steamworks/blob/main/CONTRIBUTING.md).

### Windows
To build the wrapper extension for Windows, you will need:

- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) or newer (the *Community* edition is free)
- The [Steamworks SDK](https://partner.steamgames.com/doc/sdk) - download and extract the *sdk* subfolder in the *steamworks-sdk* subfolder such that the file `steamworks-sdk\public\steam\steam_api.h` exists.

The Construct plugin requires 2 DLLs, both in the x64 (64-bit) architecture (the only architecture currently supported). These are:

- **Steam_x64.ext.dll** - the wrapper extension DLL, built from the *wrapper-extension* files
- **steam_api64.dll** - the Steamworks API DLLs from the Steamworks SDK

For convenience these DLLs are provided in this repository. However if you make changes you may want to replace some of these DLLs.

### macOS

This repository includes an Xcode project for macOS. This allows you to build the wrapper extension like any other *.dylib* project. Typically this involves using the *Archive* option in Xcode to perform a release build. The library is configured to build a universal binary including both x64 and arm64 code, so it works without emulation on both older Intel-based macOS systems, as well as newer Apple Silicon-based systems.

There are two necessary .dylib files, both of which are universal binaries:

- **steamworks.ext.dylib** - the wrapper extension dynamic library (equivalent of a DLL) built from the *wrapper-extension* files
- **libsteam_api.dylib** - the Steamworks API library from the Steamworks SDK.

Note libsteam_api.dylib has a code signature from Valve, but steamworks.ext.dylib has no code signature. (Construct's macOS exporter includes scripts to code sign your app, and that will cover .dylib files.)

### Linux

To build the wrapper extension for Linux, use CMake. Create a new empty *build* directory in the *wrapper-extension* folder, open a terminal in that folder, and run:

```
cmake -DCMAKE_BUILD_TYPE=Release ..
make
```

Currently only the x64 architecture is supported for Linux. There are two necessary .so files:

- **steamworks-x64.ext.so** - the wrapper extension shared object (equivalent of a DLL) built from the *wrapper-extension* files
- **libsteam_api.so** - the Steamworks API shared object from the Steamworks SDK

For convenience these SOs are provided in this repository. However if you make changes you may want to replace some of these SOs.

## Testing

Use [developer mode](https://www.construct.net/en/make-games/manuals/addon-sdk/guide/using-developer-mode) for a more convenient way to test the Construct plugin during development.

For details about configuring and exporting projects for Steam, refer to the [Steamworks plugin documentation](https://www.construct.net/en/make-games/addons/1105/steamworks/documentation).

A sample Construct project is provided in this repository which is just a technical test of the plugin features.

## Distributing

The Construct plugin is distributed as a [.c3addon file](https://www.construct.net/en/make-games/manuals/addon-sdk/guide/c3addon-file), which is essentially a renamed zip file with the addon files.

> [!WARNING]
> If you want to modify the plugin for your own purposes, we strongly advise to **change the Construct plugin ID.** This will avoid serious compatibility problems which could result in your project becoming unopenable. Further, if you wish to add support for more Steam API methods, you may be better off creating an independent plugin rather than modifying this one. For more information see the [Contributing guide](https://github.com/Scirra/Construct-Plugin-Steamworks/blob/main/CONTRIBUTING.md).

## Support

If you think there is an issue with this plugin, please file it following all the guidelines at the [main Construct issue tracker](https://github.com/Scirra/Construct-bugs), so we can keep all our issues in the same place. Issues have been disabled for this repository.

## Contributing

Due to Scirra Ltd's obligation to provide long-term commercial support, we may reject any submitted changes to this plugin. However there are other options such as developing an independent companion plugin. For more information see the [Contributing guide](https://github.com/Scirra/Construct-Plugin-Steamworks/blob/main/CONTRIBUTING.md).

## License

This code is published under the [MIT license](LICENSE).