# Wuthery Localizator

Lets you localize your game with any language you want.

> [!CAUTION]
> You may get banned for using this tool. There weren't any reports of bans **yet**, but we highly recommend against using Wuthery Localizator on your main account.

## Installing and using the localizator

TBD.

## Contributing

If you would like to contribute to localization, feel free to do so via our [Crowdin Project](https://crowdin.com/project/wuthery-localizator). If you want a new language to be added to the repo, please open an issue.

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
