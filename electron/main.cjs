const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 760,
    backgroundColor: "#050505",
    webPreferences: {
      preload: __dirname + "/preload.cjs",
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

ipcMain.handle("switch-model", async (_, command) => {
  return new Promise((resolve, reject) => {
    const script = `
      tell application "System Events"
        keystroke "${command}"
        key code 36
      end tell
    `;

    exec(`osascript -e '${script}'`, (error) => {
      if (error) reject(error.message);
      else resolve(true);
    });
  });
});