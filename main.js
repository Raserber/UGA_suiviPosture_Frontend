// Modules to control application life and create native browser window
const { app, BrowserWindow, autoUpdater } = require("electron")
const path = require("node:path")

if (require("electron-squirrel-startup")) app.quit();

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1900,
    height: 1060,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icon/icon.png")
  })

  // and load the index.html of the app.
  mainWindow.loadFile("public/index.html")

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on("activate", function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const server = "https://auto-update.iut1-posture.raserber.fr"
const url = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url })

setInterval(() => {
  autoUpdater.checkForUpdates()
  console.log("check for update")
}, 60000)

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded. Restart the application to apply the updates."
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})