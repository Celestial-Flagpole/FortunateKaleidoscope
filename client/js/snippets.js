// FIX ALL THIS
angular.module('sniphub.snippets', ['hljs'])

.controller('SnippetsController', function (Auth, $scope, $location, $window, SniphubServices) {
  $scope.snippets = [];
  $scope.followers = [];
  $scope.stars = [];
  
  $scope.getUsername = function () {
    $scope.loggedInUser = Auth.isAuth('username');
  };

  $scope.followUser = function (userToFollow, user) {
    console.log('got here');
    console.log(userToFollow, user);
    user = $scope.loggedInUser;
    SniphubServices.followUser(userToFollow, user)
      .then(function (response) {
        // TODO: DO SOMETHING;
      });
  };

  $scope.fetchTopTen = function () {
    //call factory function
    SniphubServices.fetchTopTen()
      .then(function (snippets) {
        $scope.snippets = snippets.data;
        $scope.snippets.forEach(function (item) {
          item.text = unescape(item.text);
          item.title = unescape(item.title);
          item.tags = item.tags.map(function (tag) {
            return tag.tagname;
          });
        });
      });
  };

  $scope.forkSnippet = function (user, text, title, tabPrefix, tags, scope, forkedFrom, snippetId) {
    //calls the auth cookie parser to get the currently logged in username.
    console.log('snippets controller', tags)
    user = $scope.loggedInUser;
    // Only forks if the user is not the same as the forked from.
    if (user !== forkedFrom) {
      // Get the tag(s) for the current snippet. We have to do a sanity check on whether the tags passed in
      // is an Array or a string list of tags. We want to send the factory an array of tags, so need to 
      // convert to an array if needed.
      if (Array.isArray(tags)) {
        var tagsArray = tags;
      } else {
        var tagsArray = tags.split(',');
      }
      // Call the factory function with new user and forkedFrom data
      SniphubServices.forkSnippet(user, text, title, tabPrefix, tagsArray, scope, forkedFrom, snippetId)
        .then(function (response) {
        $scope.fetchTopTen();
      });
    }
  };

  $scope.starSnippet = function (snippetId) {
    SniphubServices.starSnippet(snippetId)
      .then(function (response) {
        $scope.snippets.forEach(function (snippet) {
          if (snippet.id === response.data.id) {
            snippet.starCount = response.data.starCount;
          }
        });
        console.log('Snippet was starred!*', response.data);
      });
  };

  $scope.gistSnippet = function (snippetId) {
    SniphubServices.gistSnippet(snippetId)
      .then(function (response) {
        console.log('Gist was created! WOHOOOO');
        $window.open(response.data.body.html_url);
      });
  };

  //call once upon app load
  $scope.$watch('$viewContentLoaded', function () {
    $scope.getUsername();
    $scope.fetchTopTen();
  });

});
