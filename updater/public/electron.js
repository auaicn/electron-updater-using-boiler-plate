"use strict";
// This is free and unencumbered software released into the public domain.
// See LICENSE for details
exports.__esModule = true;
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
var isDev = require("electron-is-dev");
var path = require("path");
var electron_log_1 = require("electron-log");
var win;
// autoUpdate 가 내부적으로 찍는 로그를 수집하기 위해서 설정한다.
electron_updater_1.autoUpdater.logger = electron_log_1["default"];
electron_updater_1.autoUpdater.on("checking-for-update", function () {
    sendStatusToWindow("Checking for update... " + "current version is " + process.env.npm_package_version);
});
electron_updater_1.autoUpdater.on("update-available", function (info) {
    sendStatusToWindow("Update available.");
});
electron_updater_1.autoUpdater.on("update-not-available", function (info) {
    sendStatusToWindow("Update not available.");
});
electron_updater_1.autoUpdater.on("error", function (err) {
    sendStatusToWindow("Error in auto-updater. " + err);
});
electron_updater_1.autoUpdater.on("download-progress", function (progressObj) {
    var log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
        log_message +
            " (" +
            progressObj.transferred +
            "/" +
            progressObj.total +
            ")";
    sendStatusToWindow(log_message);
});
// autoUpdater.on("update-downloaded", (info) => {
//   sendStatusToWindow("Update downloaded");
// });
electron_updater_1.autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateURL) {
    electron_log_1["default"].info('Successfully downloaded from', updateURL);
    var dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };
    electron_1.dialog.showMessageBox(dialogOpts).then(function (returnValue) {
        if (returnValue.response === 0)
            electron_updater_1.autoUpdater.quitAndInstall();
    });
});
function sendStatusToWindow(text) {
    electron_log_1["default"].info('[Event]', text);
    win.webContents.send("message", text);
}
//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
// let template = [];
// if (process.platform === "darwin") {
//   // OS X
//   const name = app.getName();
//   template.unshift({
//     label: name,
//     submenu: [
//       {
//         label: "About " + name,
//         role: "about",
//       },
//       {
//         label: "Quit",
//         accelerator: "Command+Q",
//         click() {
//           app.quit();
//         },
//       },
//     ],
//   });
// }
//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
function createDefaultWindow() {
    win = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.webContents.openDevTools();
    win.on("closed", function () {
        win = null;
    });
    //   win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
    win.loadURL(isDev
        ? "http://localhost:3000"
        : "file://".concat(path.join(__dirname, "../build/index.html")));
    return win;
}
electron_1.app.on("ready", function () {
    // Create the Menu
    //   const menu = Menu.buildFromTemplate(template);
    //   Menu.setApplicationMenu(menu);
    createDefaultWindow();
});
electron_1.app.on("window-all-closed", function () {
    electron_1.app.quit();
});
//
// CHOOSE one of the following options for Auto updates
//
//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
electron_1.app.on("ready", function () {
    electron_log_1["default"].info('App starting...');
    // log.info('AutoUpdater feed URL:', autoUpdater.getFeedURL()); // deprecated
    electron_updater_1.autoUpdater.checkForUpdates();
});
//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })
