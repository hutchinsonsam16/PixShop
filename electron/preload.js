// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  // You can expose protected APIs to the renderer process here, for example:
  // const { contextBridge } = require('electron');
  // contextBridge.exposeInMainWorld('myAPI', {
  //   doAThing: () => {}
  // });
});
