
// var oauth = ChromeExOAuth.initBackgroundPage({
//   'request_url': ",
//   'authorize_url': <OAuth authorize URL>,
//   'access_url': <OAuth access token URL>,
//   'consumer_key': <OAuth consumer key>,
//   'consumer_secret': <OAuth consumer secret>,
//   'scope': <scope of data access, not used by all OAuth providers>,
//   'app_name': <application name, not used by all OAuth providers>
// });
        // var clientId = '9a1a341bb29b6bf5b13e';
        // var redirectUri = chrome.identity.getRedirectURL('provider_cb')
        // var options = {
        //   'interactive': interactive,
        //   'url': 'https://github.com/login/oauth/authorize' +
        //          '?client_id=' + clientId +
        //          '&redirect_uri=' + encodeURIComponent(redirectUri)
        // }
        // chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        //   console.log('launchWebAuthFlow completed', chrome.runtime.lastError,
        //       redirectUri);

        //   if (chrome.runtime.lastError) {
        //     callback(new Error(chrome.runtime.lastError));
        //     return;
        //   }

//         var client_id = 'fbae39ece502e521f0a5';
// var redirectUri = chrome.identity.getRedirectURL("oauth2");     
// var auth_url = "https://github.com/login/oauth/authorize?clientId=" + client_id + "&redirect_uri=" + redirectUri + "&response_type=token";

//     chrome.identity.launchWebAuthFlow({'url':auth_url,'interactive':true}, function(redirect_url){
//         console.log(redirect_url)

// chrome.experimental.cookies.get(object details, function callback);
//     });
        // var redirect_Uri = chrome.identity.getRedirectURL() + "github"
// chrome.identity.launchWebAuthFlow(
//   {'url': 'https://github.com/login/oauth/authorize?clientId=fbae39ece502e521f0a5+' 
//   +redirect_Uri + "= encodeURIComponent(redirectUri) + " &response_type=token 
//          ,'interactive': true
//        },
//   function(redirect_url) { console.log(redirect_url)})

// chrome.identity.getAuthToken({
//   'interactive': true
// }, function(token) {
//   if (chrome.runtime.lastError) {
//     alert("Error");
//   } else {

//     console.log(token);
//     alert(token);
//   }

// });


onload = function() {
  var login = document.getElementById("login");
  var output = document.getElementById("output");
  var clientId = '9a1a341bb29b6bf5b13e';

  login.onclick = function() {
    var redirectUrl = chrome.identity.getRedirectURL();
    var clientId = '9a1a341bb29b6bf5b13e';
    var authUrl = "https://github.com/oauth/authorize/?" +
        "client_id=" + clientId + "&" +
        "response_type=token&" +
        "redirect_uri=" + encodeURIComponent(redirectUrl);
 
    chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true},
        function(responseUrl) {
      console.log(responseUrl);
      var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
      console.log(accessToken);

      // var api = new InstagramAPI(accessToken);
      // api.request("users/self/feed", undefined, function(data) {  
      //   console.log(data);
      //   output.textContent = JSON.stringify(data, null, 4);
        

      });
    });
  };
};

// var InstagramAPI = function(accessToken) {
//   this.request = function(method, arguments, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//       callback(JSON.parse(xhr.response));
//     };

//     xhr.open("GET", "https://api.instagram.com/v1/" + method + "?access_token=" + accessToken);
//     xhr.send();
//   };
// }
