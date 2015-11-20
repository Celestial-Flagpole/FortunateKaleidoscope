// FIX ALL THIS
angular.module('sniphub.snippets', ['hljs'])

.controller('SnippetsController', function (Auth, $scope, $location, SniphubServices) {
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
      .then(function ( snippets ) {
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

  $scope.forkSnippet = function ( user, text, title, tabPrefix, scope, forkedFrom ) {
    //calls the auth cookie parser to get the currently logged in username.
    user = $scope.loggedInUser
    // Only forks if the user is not the same as the forked from.
    if ( user !== forkedFrom ) {
      //call the factory function with new user and forkedFrom data
      SniphubServices.addSnippet( user, text, title, tabPrefix, scope, forkedFrom ).then(function ( response ) {
        $scope.fetchTopTen();
      });
    }
  };

  //call once upon app load
  $scope.$watch('$viewContentLoaded', function () {
    $scope.getUsername();
    $scope.fetchTopTen();
  });

});
