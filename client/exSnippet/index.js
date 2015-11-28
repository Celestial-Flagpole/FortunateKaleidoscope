var gh = (function() {
  'use strict';

  var signin_button;
  var revoke_button;
  var user_info_div;
  var access_token;
  var User = {
    id:'',
    login:'',
    email:''
  };
  var tokenFetcher = (function() {
    var clientId = 'fbae39ece502e521f0a5';
    var secret = 'e8ede608a5dccc649af9966881b50f0befea8f67';
    var redirectUri = 'https://' + chrome.runtime.id + 
                      '.chromiumapp.org/' + 'github/'
    var redirectRe = new RegExp(redirectUri + '[#\?](.*)');
    access_token = null;

    return {
      getToken: function(interactive, callback) {
        if (access_token) {
          callback(null, access_token);
          return;
        }

        var options = {
          'interactive': interactive,
          url:'https://www.github.com/login/oauth/authorize?client_id=' + clientId +
              '&response_type=token' +'&redirect_uri=' + encodeURIComponent(redirectUri)
        }
        chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
          console.log(options);
          console.log(redirectUri)
          if (chrome.runtime.lastError) {
            console.log("running WebAuthFlow");
            callback(new Error(chrome.runtime.lastError));
            return;
          }
          var matches = redirectUri.match(redirectRe);
          console.log("matches: " + matches);
          if (matches && matches.length > 1)
            handleProviderResponse(parseRedirectFragment(matches[1]));
          else
            console.log('in Error');
            callback(new Error('Invalid redirect URI'));
        });

        function parseRedirectFragment(fragment) {
          console.log('fragment: ', fragment);
          var pairs = fragment.split(/&/);
          var values = {};

          pairs.forEach(function(pair) {
            var nameval = pair.split(/=/);
            values[nameval[0]] = nameval[1];
          });

          return values;
        }
        function handleProviderResponse(values) {
          console.log("in handleProvider")
          console.log(values)
          if (values.hasOwnProperty('access-token')) {
            console.log('in handleProvider: ', values.access_token);
            setAccesstoken(values.access_token);
          } else if (values.hasOwnProperty('code')) {
            exchangeCodeForToken(values.code);
          } else {
            callback(newError('Neither access_token nor code available.'));
          }
        }

        function exchangeCodeForToken(code) {
          console.log("in exchangeCodeForToken code: ", code);
          var xhr = new XMLHttpRequest();
          xhr.open('GET',
            'https://github.com/login/oauth/access_token?' +
            'client_id=' + clientId +
            '&client_secret=' + secret +
            '&code=' + code);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('Accept', 'application/json');
          console.log("sent request for token");
          xhr.onload = function() {
            console.log('in onload')
            if (this.status === 200) {
              console.log("status === 200")
              console.log(this.responseText);
              var response = JSON.parse(this.responseText);
              console.log(response.access_token)
              setAccessToken(response.access_token);
              access_token = response;
            }
          };
          xhr.send();
        }
        function setAccessToken(token) {
          console.log("token: ", token)
          access_token = token;
          callback(null, access_token);
        }
      },
      removeCachedToken: function(token_to_remove) {
        if (access_token == token_to_remove)
          access_token = null;
      }
    }
  })();
  function xhrWithAuth(method, url, interactive, callback) {
    var retry = true;
    getToken();

  function getToken() {
    tokenFetcher.getToken(interactive, function(error, token) {
      if (error) {
        callback(error);
        return;
      }
      access_token = token;
      requestStart();
    });
  }
  function requestStart() {
    console.log("in requestStart testing post request")
    // chrome.cookies.set({
    //   "name": "username",
    //   "url": "https://sniphub.herokuapp.com/",
    //   "expirationDate": (new Date().getTime()/1000) + 3600,
    //   "value": "MCavataio"
    // }, function (cookie) {
    //   console.log(JSON.stringify(cookie));
    // })
    

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.onload = requestComplete;
    xhr.send();
  }

  function requestComplete() {
    if (this.status != 200 && retry) {
      console.log("in requestComplete *************")
      retry = false;
      tokenFetcher.removeCachedToken(access_token);

      access_token = null;
      getToken();
    } else {
      console.log("in else requestComplete")
      callback(null, this.status, this.response);
    }
  }
}
function getUserInfo(interactive) {
  console.log("accessToken in getUser: ", access_token)
  xhrWithAuth('GET',
    'https://api.github.com/user?access_token=' + access_token,
    interactive,
    onUserInfoFetched)
}
  function showButton(button) {
    button.style.display = 'inline';
    button.disabled = false;
  }

  function hideButton(button) {
    button.style.display = 'none';
  }

  function disableButton(button) {
    button.disabled = true;
  }
  function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
      
      var user_info = JSON.parse(response);
      User.id = user_info.id;
      console.log(User.login)
      User.email = user_info.email;
      User.login = user_info.login;
      document.getElementById('user_info').innerHTML = "<b>Hello " + User.login;
      hideButton(signin_button);
      var user = User;

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/snippet",
      data: {
        "username" : user,
        "text" : "hello",
        "tabPrefix" : "test",
        "title" : "testing with ajax",
        "scope" : "no scope",
        "tags" : "here",
        "forkedFrom" : null
       }
    })
    } else {
      console.log('in else')
      showButton(signin_button)
    }
  }
  function interactiveSignIn() {
  disableButton(signin_button);
  tokenFetcher.getToken(true, function(error, access_token) {
    if (error) {
      showButton(signin_button);
    } else {
      console.log("interactiveSignIn :", access_token)
      getUserInfo(true);
    }
  });
}
  function revokeToken() {
    console.log(access_token)
    console.log(User.login)
  var xhr = new XMLHttpRequest();
      xhr.open('DELETE',
        'https://github.com/settings/connections/' + User.id + '/tokens/' + access_token.access_token)
      xhr.setRequestHeader('Authorization', 'Basic')
        // '/applications/fbae39ece502e521f0a5/tokens/' + access_token.access_token);
      xhr.send()
    user_info_div.textContent = '';
    hideButton(revoke_button);
    showButton(signin_button);
  }
  
  return {
    onload: function () {
      signin_button = document.querySelector('#signin');
      signin_button.onclick = interactiveSignIn;
      revoke_button = document.querySelector('#revoke');
      revoke_button.onclick = revokeToken;
      user_info_div = document.getElementById('user_info');
      console.log(signin_button, revoke_button, user_info_div);
      showButton(signin_button);
      getUserInfo(false);
    }
  };
})();

window.onload = gh.onload;


// function cookieinfo(){
//     chrome.cookies.getAll({},function (cookie){
//         console.log(cookie.length);
//         allCookieInfo = "";
//         for(i=0;i<cookie.length;i++){
//             console.log(cookie[i]);

//             if(cookie[i].domain === ".github.com" && cookie[i].value && cookie[i].name === "dotcom_user") 
//               allCookieInfo = allCookieInfo + JSON.stringify(cookie[i]);
//         }
//         localStorage.github = allCookieInfo;
//         console.log(allCookieInfo)
//     });
// }
// window.onload=cookieinfo;










