const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gearshift", {
  switchModel: (command) => ipcRenderer.invoke("switch-model", command),
});