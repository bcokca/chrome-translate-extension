// var translate = require('./index');

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {

      var myElement = $("#text p");

      if(!selection || selection == ''){
          myElement.html("Please select your text!");
      }else{
          myElement.html('translating ... ');

          $.post( "https://chrome-extension-translator.herokuapp.com/translate", {from: 'en', to: 'tr', text: selection[0]},
              function( data ) {
                myElement.html( data );
          });
      }

    });

  });
});
