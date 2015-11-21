  var redirectUri = chrome.identity.getRedirectURL() + "github"
  var clientId = '9a1a341bb29b6bf5b13e';
  var authUrl = "https://github.com/oauth/authorize/?" +
      "client_id=" + clientId + "&" +
      "redirect_uri=" + encodeURIComponent(redirectUri) +
      "&response_type=token"

  chrome.identity.launchWebAuthFlow({url: "https://github.com/oauth/authorize/?client_id=9a1a341bb29b6bf5b13e&redirect_uri=" + 
    encodeURIComponent(redirectUri) + "$response_type=token", interactive: true},
      function(responseUrl) {
        console.log(responseUrl);
        console.log("hello")
        // var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
        // console.log(accessToken);
      })
    })
