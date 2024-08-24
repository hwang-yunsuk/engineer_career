/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const CONFIG = {
  TITLE: 'engineer_career'
}

function doGet(e) {
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(CONFIG.TITLE)
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

function triggerReload() {
  const getUrl = ScriptApp.getService().getUrl()
  return JSON.stringify({
    url: getUrl,
    call: true,
    message: 'get url'
  })
}
