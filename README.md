# Screenshot Browser Extension

[<img src="src/assets/img/icon-128.png" height="40"/>](https://chrome.google.com/webstore/detail/screenshot-extension/hmkbkbpdnembpeadgpcmjekihjmckdjh)

![package.json version](https://img.shields.io/github/package-json/v/lxieyang/screenshot-extension/master)
[![MIT License](https://img.shields.io/github/license/lxieyang/screenshot-extension)](LICENSE)

![last commit](https://img.shields.io/github/last-commit/lxieyang/screenshot-extension/master)
![commit freq](https://img.shields.io/github/commit-activity/w/lxieyang/screenshot-extension)

<!--
[![users](https://img.shields.io/chrome-web-store/users/hmkbkbpdnembpeadgpcmjekihjmckdjh)](https://chrome.google.com/webstore/detail/screenshot-extension/hmkbkbpdnembpeadgpcmjekihjmckdjh)
-->

Based on [Chrome Extension Boilerplate with React 17 and Webpack 5](https://github.com/lxieyang/chrome-extension-boilerplate-react)

![preview](preview/preview-original.png)

## To install

### From Chrome store

[<img src="preview/chrome-web-store-img.png" height="40"/>](https://chrome.google.com/webstore/detail/screenshot-extension/hmkbkbpdnembpeadgpcmjekihjmckdjh)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hmkbkbpdnembpeadgpcmjekihjmckdjh)](https://chrome.google.com/webstore/detail/screenshot-extension/hmkbkbpdnembpeadgpcmjekihjmckdjh)

### From Github Releases

1. Download the latest `build.zip` from the [Release](https://github.com/lxieyang/screenshot-extension/releases) page. Or click [here](https://github.com/lxieyang/screenshot-extension/releases/download/v1.0.0/build.zip).
2. Unzip
3. Go to `chrome://extensions/` (or `edge://extensions/` if you're using MS Edge) and enable `Developer mode`.
4. Click `Load Unpacked`, then select the unzipped folder (which contains a file called `manifest.json`).

### Build from the source

1. Clone this git repo
2. Run `npm install`.
3. Run `npm run build`, which will generate a `build` folder.
4. Go to `chrome://extensions/` (or `edge://extensions/` if you're using MS Edge) and enable `Developer mode`.
5. Click `Load Unpacked`, then select the `build` folder (which contains a file called `manifest.json`).

## To use

- Hold the `Option/Alt` key and drag the mouse to create partial screenshots.
- Click the extension icon to create full-page screenshots.

---

Michael Xieyang Liu | [Website](https://lxieyang.github.io)
