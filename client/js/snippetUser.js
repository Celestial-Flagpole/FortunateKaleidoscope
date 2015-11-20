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
        });
      });
  };

  $scope.getFollowers = function (user) {
    SniphubServices.getFollowers(user)
      .then(function (response) {
        $scope.followers = [response.data[0].Followers];
        console.log($scope.followers)
      })
  };

  $scope.$watch('$viewContentLoaded', function () {
    $scope.getUsername();
    $scope.fetchByUser($scope.params.id);
    $scope.getFollowers($scope.params.id);
  });

})
