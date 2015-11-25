var blue = $('p').val()
$('document').ready(function() {
  $('#signin').click(function() {
    .init({
        client_id: "9a1a341bb29b6bf5b13e",    // replace with your own Client ID!!
        redirect_uri: chrome.identity.getRedirectURL(),
        response_type: "token"
    });
  });
  $('.addSnippet').click(function() {
    var text = $('#dropBox').val();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/snippet',
      data: {
        // "username": user,
        // "title": title,
        "text": text,
        // "scope": scope
      }
    })
  })
})

  // chrome.identity.launchWebAuthFlow(
  // {'url': 'https://github.com/login/oauth/authorize', 'interactive': true},
  // function(redirect_url) { console.log(redirect_url)})
  // $.ajax({
  //   type: 'POST',
  //   url: 'http://localhost:3000/api/snippets',
  //   data: data
  //   }
//   // })
// onload = function() {
//   var login = document.getElementById("login");
//   var output = document.getElementById("output");
//   var clientId = '9a1a341bb29b6bf5b13e';

//   login.onclick = function() {
  // var redirectUri = chrome.identity.getRedirectURL() + "github"
  // var clientId = '9a1a341bb29b6bf5b13e';
  // var authUrl = "https://github.com/oauth/authorize/?" +
  //     "client_id=" + clientId + "&" +
  //     "redirect_uri=" + encodeURIComponent(redirectUri) +
  //     "&response_type=token"

  // chrome.identity.launchWebAuthFlow({url: "https://github.com/oauth/authorize/?client_id=9a1a341bb29b6bf5b13e&redirect_uri=" + 
  //   encodeURIComponent(redirectUri) + "$response_type=token", interactive: true},
  //     function(responseUrl) {
  //       console.log(responseUrl);
  //       console.log("hello")
  //       // var accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
  //       // console.log(accessToken);
  //     })
  //   })

// })