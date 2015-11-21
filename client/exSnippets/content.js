  // var redirectUri = chrome.identity.getRedirectURL() + "github"
  // var clientId = '9a1a341bb29b6bf5b13e';
  // var authUrl = "https://github.com/oauth/authorize/?" +
  //     "client_id=" + clientId + "&" +
  //     "redirect_uri=" + encodeURIComponent(redirectUri) +
  //     "&response_type=token"


  // chrome.identity.launchWebAuthFlow({url: "authUrl", interactive: true},
  //     function(responseUrl) {
  //       console.log(responseUrl);
  //       // var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
  //       // console.log(accessToken);


  //     })
  //   })










// onload = function() {
//   var login = document.getElementById("login");
//   var output = document.getElementById("output");
//   var clientId = '9a1a341bb29b6bf5b13e';

//   login.onclick = function() {
//     var redirectUrl = chrome.identity.getRedirectURL();
//     var clientId = '9a1a341bb29b6bf5b13e';
//     var authUrl = "https://github.com/oauth/authorize/?" +
//         "client_id=" + clientId + "&" +
//         "response_type=token&" +
//         "redirect_uri=" + encodeURIComponent(redirectUrl);
 
//     chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true},
//         function(responseUrl) {
//       console.log(responseUrl);
//       var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
//       console.log(accessToken);

//       var api = new InstagramAPI(accessToken);
//       api.request("users/self/feed", undefined, function(data) {  
//         console.log(data);
//         output.textContent = JSON.stringify(data, null, 4);
        

//       });
//     });
//   };
// };
