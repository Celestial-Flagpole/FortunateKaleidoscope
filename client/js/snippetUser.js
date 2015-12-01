angular.module('sniphub.snippetsUser', [])

.controller('SnippetsUserController', function (Auth, $state, $stateParams, $scope, $location, SniphubServices) {
$scope.snippets = [];
$scope.username = '';
$scope.followers = [];
$scope.params = $stateParams;

$scope.getUsername = function () {
  $scope.loggedInUser = Auth.isAuth('username');
};

$scope.fetchByUser = function ( user ) {
    //call factory function
    SniphubServices.fetchByUser( user )
      .then(function ( snippets ) {
        $scope.snippets = snippets.data;
        $scope.username = snippets.data[0].user.username;
        $scope.snippets.forEach(function (item) {
          item.text = unescape(item.text);
          item.title = unescape(item.title);
          item.tags = item.tags.map(function (tag) {
            return tag.tagname;
          });
        });
      });
  };

  $scope.getFollowers = function (user) {
    SniphubServices.getFollowers(user)
      .then(function (response) {
        if (response.data.length === 0) {
          $scope.followers = [];
        } else {
          for (var i = 0; i < response.data.length; i++) {
            $scope.followers.push(response.data[i].username)
          }    
        }
        console.log($scope.followers)
      })
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

  $scope.$watch('$viewContentLoaded', function () {
    $scope.getUsername();
    $scope.fetchByUser($scope.params.id);
    $scope.getFollowers($scope.params.id);
  });

})
