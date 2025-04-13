# Wuthery Localizator

Lets you localize your game with any language you want.

> [!CAUTION]
> You may get banned for using this tool. There weren't any reports of bans **yet**, but we highly recommend against using Wuthery Localizator on your main account.

## Preview

![Preview](/images/preview.png)

## Installing and using the localizator

Here is a small guide on how to install and use Wuthery Localizator.

> [!CAUTION]
> Please read the instructions carefully. If you don't follow them, you may get banned.

### Installation

Follow these steps to install Wuthery Localizator:
1. Go to the latest release and download [localizator installer](https://github.com/Wuthery/Localizator/releases/latest/download/wuthery-localizator-app_0.1.0_x64-setup.exe).
2. Run the installer and follow the instructions.
3. Launch Wuthery Localizator.
4. Configure options to suit your needs.
5. Click **Patch** to apply the changes.
6. Click **Launch Game** to start the game.

### Usage

#### Options

- **Game Path** - Path to the root folder of the game. Example: `E:\Wuthering Waves`
- **Disable Anti Data** - Disables anti-cheat packets sent by the game via UDP. The game will still send ACE data over TCP so this doesn't guarantee that you won't get banned.
- **Enable HTTP Interceptor** - Intercepts and drops some useless requests to Kuro datacenter. In fact those are unlikely to be related to the anti-cheat. but better be safe than sorry.
- **Disable Tpsafe** - Completely disables the anti-cheat. This is the most effective way to avoid getting banned, but you will get kicked every 10-15 minutes because the game server will not receive any anti-cheat data.
- **Disable censorship** - Disables censorship when you look at your character from below.
- **Localization DB URL** - URL to the localization database. Defaults to Ukrainian language (as this localizator was originally made for it).

#### Recommended settings

Because of the complexity of ACE (anti-cheat used by the game), there are two general options of using the localizator:

1. With anti-cheat completely disabled (**"Disable Tpsafe"** option enabled). The downside here is that you will get kicked every 10-15 minutes because the game server will not receive any anti-cheat data.
2. With anti-cheat partially enabled. Uncheck the **"Disable Tpsafe"** option and enable **"Disable Anti Data"** and **"Enable HTTP Interceptor"** options. This way you will be able to play the game without getting kicked, but there is a risk of getting banned.

#### Different localizations

To change locale, you need to change the **Localization DB URL**. Any language from the [`/localizations`](/localizations) directory can be used.

Use the following format:
```
https://github.com/Wuthery/Localizator/releases/latest/download/<language-code>.db
```
Example (for Ukrainian language): https://github.com/Wuthery/Localizator/releases/latest/download/uk.db.

**Note:** Instead of adding a new language, the localizator modifies the existing English localizations. So you must choose it in game settings for the localization to work.

#### Unpatching

Wuthery localizator modifies game files when you "patch" the game. Whenever you want to log into the game without using the localizator, **you must unpatch the game first**. If you don't do it, the patched pak will be loaded and you may get banned.

## Contributing

If you would like to contribute to localization, feel free to clone this repository and edit language files in [`/localizations`](/localizations/) directory. If you want a new language to be added to the repo, please open an issue.

## Scripts

The repository contains a few helpful JS scripts.

### Generate localization files from db files

Useful for updating the localization files with the latest changes from the game. Put **lang_multi_text.db** in `src/lang_multi_text.db` and run the following command:
```bash
pnpm update-from-db
```

### Generate db files usable in the game

To generate db files from the localization files, run the following command:
```bash
pnpm generate-dbs
```

## Changelog

### 0.2.0

- Added option to disable console.
- Some internal fixes and improvements.

### 0.1.0

- Initial release.
