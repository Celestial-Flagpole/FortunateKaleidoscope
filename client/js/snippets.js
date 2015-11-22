// FIX ALL THIS
angular.module('sniphub.snippets', ['hljs'])

.controller('SnippetsController', function (Auth, $scope, $location, $window, SniphubServices) {
  $scope.snippets = [];
  $scope.followers = [];
  
  $scope.getUsername = function () {
    $scope.loggedInUser = Auth.isAuth('username');
  };

  $scope.followUser = function (userToFollow, user) {
    user = $scope.loggedInUser;
    SniphubServices.followUser(userToFollow, user)
      .then(function (response) {
        // TODO: DO SOMETHING;
      });
  };

  // MOVE TO SNIPPETUSER controller
  // $scope.getFollowers = function (user) {
  //   user = $scope.loggedInUser;
  //   SniphubServices.getFollower(user)
  //     .then(function (response) {
  //       $scope.followers = response.data;
  //     })
  // };

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
      //call the factory function with new user and forkedFrom data
      if (Array.isArray(tags)) {
        var tagsArray = tags;
      } else {
        var tagsArray = tags.split(',');
      }
      SniphubServices.forkSnippet(user, text, title, tabPrefix, tagsArray, scope, forkedFrom, snippetId).then(function (response) {
        $scope.fetchTopTen();
      });
    }
  };

  $scope.starSnippet = function (snippetId) {
    SniphubServices.starSnippet(snippetId)
      .then(function (response) {
        console.log('Snippet was starred!*');
      });
  };

  $scope.gistSnippet = function (snippetId) {
    SniphubServices.gistSnippet(snippetId)
      .then(function (response) {
        console.log('Gist was created! WOHOOOO');
        console.log(response);
        $window.open(response.data.body.html_url);
      });
  };

  //call once upon app load
  $scope.$watch('$viewContentLoaded', function () {
    $scope.getUsername();
    $scope.fetchTopTen();
  });

});
