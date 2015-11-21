var blue = $('p').val()
$('document').ready(function() {

  // chrome.identity.launchWebAuthFlow(
  // {'url': 'https://github.com/login/oauth/authorize', 'interactive': true},
  // function(redirect_url) { console.log(redirect_url)})
  // $.ajax({
  //   type: 'POST',
  //   url: 'http://localhost:3000/api/snippets',
  //   data: data
  //   }
  // })
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

    })
  }
}
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