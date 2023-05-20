console.log('Background script is running.');

// register the service worker
chrome.runtime.onInstalled.addListener(function() {
  console.log('Service worker is registered.');
});

// listen for a click on the extension button
chrome.action.onClicked.addListener(function(tab) {
  chrome.extension.getBackgroundPage().console.log("hello world")
  // execute the content script in the active tab
  //chrome.tabs.executeScript(tab.id, {file: "content-script.js"});
});