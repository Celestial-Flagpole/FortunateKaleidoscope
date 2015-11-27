//this file is all done ---- dont mess with it

angular.module('sniphub.services', [])

.factory('SniphubServices', function ($http) {

  var fetchTopTen = function () {
    return $http({
      method: 'GET',
      url: '/api/topten'
    }).then(function successCallback ( response ) {
      //store all links in scope.data
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db');
    });
  };


  var addSnippet = function ( user, text, title, tabPrefix, tags, scope, forkedFrom ) {
    //If it doesn't have a forkedFrom, set to null
    forkedFrom = forkedFrom || null;
    return $http({
      method: 'POST',
      url: '/api/snippet',
      data: {
        "username" : user,
        "text" : text,
        "tabPrefix" : tabPrefix,
        "title" : title,
        "scope" : scope,
        "tags" : tags,
        "forkedFrom" : forkedFrom
       }
    }).then(function successCallback ( response ) {
      console.log("after success");
      return response;
    });
  };

  var forkSnippet = function ( user, text, title, tabPrefix, tags, scope, forkedFrom, snippetId ) {

    return $http({
      method: 'POST',
      url: '/api/snippet/fork',
      data: {
        "username" : user,
        "text" : text,
        "tabPrefix" : tabPrefix,
        "title" : title,
        "scope" : scope,
        "tags": tags,
        "forkedFrom" : forkedFrom,
        "id": snippetId
       }
    }).then(function successCallback ( response ) {
      console.log("after success");
      return response;
    });
  };

  var starSnippet = function (snippetId) {
    return $http({
      method: 'POST',
      url: '/api/snippet/star',
      data: {
        "id": snippetId
      }
    })
      .then(function successCallback (response) {
        return response;
      }, function errorCallback (response) {
      console.log('Error in starring snippet in db')
    });
  };

  var gistSnippet = function (snippetId) {
    return $http({
      method: 'POST',
      url: '/download/gist',
      data: {
        "snippetId": snippetId
      }
      })
      .then(function successCallback (response) {
        return response;
      }, function errorCallback (response) {
        console.log('Error in creating a gist :(');
      });
  };

  var updateSnippet = function ( snippetId, user, text, title, tabPrefix, tags, scope, forkedFrom ) {
    forkedFrom = forkedFrom || null;
    return $http({
      method: 'POST',
      url: '/api/user/' + user + '/' + snippetId,
      data: {
        "username" : user,
        "text" : text,
        "tabPrefix" : tabPrefix,
        "title" : title,
        "scope" : scope,
        "tags" : tags,
        "forkedFrom" : forkedFrom
       }
    }).then(function successCallback ( response ) {
      console.log("after success")
      return response;
    });

  };

  var fetchByUser = function ( user ) {
    // /api/user/:userId ->
    return $http({
      method: 'GET',
      url: '/api/user/' + user,
    }).then(function successCallback ( response ) {
      //store all links in scope.data
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db');
    });
  };

  var fetchBySnippetId = function ( user, id ) {
    return $http({
      method: 'GET',
      url: '/api/user/' + user + '/' + id
    }).then(function successCallback ( response ) {
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db')
    });
  };

  var searchByTerm = function ( term ) {
    return $http({
      method: 'POST',
      url: '/api/search',
      data: { "term" : term }
    }).then(function successCallback ( response ) {
      //store all links in scope.data
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db');
    });
  };

  var followUser = function (userToFollow, user) {
    return $http({
      method: 'POST',
      url: '/api/user/' + user + '/follow',
      data: { "userToFollow": userToFollow, "user" : user }
    }).then(function successCallback ( response ) {
      //store all links in scope.data
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db');
    });
  };

  var getFollowers = function (user) {
    return $http({
      method: 'GET', 
      url: '/api/user/' + user + '/follow'
    }).then (function successCallback (response) {
      return response;
    }, function errorCallback (response) {
      console.log('Error in getting followers from db');
    });
  };

  return {
    updateSnippet: updateSnippet,
    fetchBySnippetId: fetchBySnippetId,
    fetchTopTen : fetchTopTen,
    addSnippet : addSnippet,
    fetchByUser: fetchByUser,
    searchByTerm : searchByTerm,
    followUser: followUser,
    getFollowers: getFollowers,
    forkSnippet: forkSnippet,
    starSnippet: starSnippet,
    gistSnippet: gistSnippet
  };
})
.factory('Auth', function ($http, $location, $window) {

  //Parse the cookie based on parameter and return the result
  var isAuth = function ( parameter ) {
    var isAuth = document.cookie.split( ';' )
                .map( function( x ) { return x.trim().split( '=' ); } )
                .reduce(function( a, b ) { a[ b[ 0 ] ] = b[ 1 ]; return a; },
                {} )[ parameter ];
    return isAuth;
  };



  return {
    isAuth: isAuth,
  };
});
