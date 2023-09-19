# Read this before contributing or modifying

We are providing the source to this Construct plugin/extension for maximum flexibility for developers publishing Construct content. However this repository is not developed like a traditional open-source project, and in some cases you may be better off developing a separate "companion" plugin rather than modifying this one. Please read this guide if you plan on modifying this plugin.

## Code of conduct

This repository will be managed in accordance with Scirra's [Forum & Community guidelines](https://www.construct.net/en/forum/general/open-topic-33/forum-community-guidelines-141035).

## Accepting contributions

This plugin was authored by Scirra Ltd, the developers of Construct, which is a closed-source commercial tool. Users expect a high level of support and on-going maintenance.

While it might seem useful to submit a large amount of code to this project, we are in fact unlikely to accept large changes. This is mainly because ultimately we know will have to maintain it. We have no guarantee that the original author of a major change will be willing to maintain it, or even be contactable, especially after several years have passed. As this plugin is distributed by Scirra Ltd, responsibility defaults to us, and users will not unreasonably expect us to provide support and maintainance for it in the long-term. Supporting and maintaining large amounts of code written by other people can be extremely difficult, and over the long-term can include fully rewriting it. As a small team already managing a great deal of support and maintenance work for a commercial product, having to answer questions about, maintain, or fully rewrite a large amount of someone else's code is an outcome we specifically want to avoid. This is not a theoretical concern, as we've run in to this exact problem more than once in the past.

If you want to make major additions to this plugin, there is a better option: make a new plugin. A secondary "companion" plugin can integrate the Steamworks SDK and make API calls, but can assume the SDK is already initialized by this plugin. The companion plugin can then be developed entirely independently, and users will be aware that responsibility for maintenance of that plugin lies with someone else.

For example if you want to integrate Steam Workshop features, that involes a broad set of APIs in the [ISteamUGC Interface](https://partner.steamgames.com/doc/api/ISteamUGC). If you submit a PR that adds all of those features to this plugin, we will likely reject it, since it would essentially obligate us to provide long-term commercial support for it. However you can make a new plugin that provides all those features and can be used alongside this plugin.

In this way a set of companion plugins could be developed by the community, providing access to more of the very large API surface of the Steamworks SDK, without obligating Scirra Ltd to provide long-term support for it. Part of the reason we are sharing this code is also to provide an example of how to write the necessary code for such plugins.

Our intent is for this plugin to provide just a small core of essential features that the vast majority of games are likely to make use of. If you have a small, essential, well-written and easily-maintainable change for this plugin, you can submit a PR for that and we may accept such contributions. However we may well advise you to create a separate plugin instead. We reserve the right to reject PRs at our discretion and without providing any reason beyond the explanation provided here.

## Creating a companion plugin

If you want to create a plugin that makes use of more of the Steam API, you'll want to do the following:

- Start with the basic wrapper extension SDK.
- **Change the Construct plugin ID.** Never use the same plugin ID for different plugins or you risk severe compatibility problems and project corruption.
- Rename the plugin, e.g. to *Steam Workshop*.
- Integrate the Steamworks SDK in the same way this wrapper extension does - see *framework.h* for the include code.
- Add features that directly access Steam API features, skipping initialization and shutdown.
- In Construct, add both this plugin and your companion plugin to your project. This plugin will handle initialization for you and then your plugin will provide additional features.

## Making local modifications

In some cases you may want to make a modification to this plugin, but not submit your code changes. We strongly recommend making a companion plugin instead wherever feasible. However if you must, you can clone this plugin and make some changes for your own use. In that case though **you must change the plugin ID**. This essentially makes it an entirely separate kind of plugin. This will avoid severe compatibility problems and project corruption that can result if you locally modify a plugin but don't change it's ID, since your modifications will result in a plugin that Construct thinks is compatible with other projects, but is in fact incompatible.

For example if you want to make a local modification to this plugin, clone it, change the plugin ID from `Steamworks_Ext` to something like `Steamworks_Ext_MyCompanyMods`, rename it (which is only cosmetic but will help avoid confusion), and then make your modifications. Now you have your own unique plugin that you can modify to your heart's content, and won't cause compatibility nightmares with the original plugin. You should then also monitor this original codebase and merge any important changes to your cloned plugin, since they may be important updates to fix bugs or support new versions of other software. That could also prove to be significant on-going maintenance work, which is another reason a companion plugin is preferable.