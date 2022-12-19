chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
  if (request.action == "fetchUrl") {
    // fetch the current tab's URL
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var tabUrl = tab.url;

      // preserve the value of sendResponse in a closure
      (function(response) {
        response({url: tabUrl});
      })(sendResponse);
    });

    // return true to keep the message channel open
    // until sendResponse is called
    return true;
  }
});