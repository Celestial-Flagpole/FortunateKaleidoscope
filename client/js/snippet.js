angular.module('sniphub.snippet', [])

.controller('SnippetController', function (Auth, $scope, $stateParams, SniphubServices) {

  $scope.params = $stateParams;

  $scope.fetchSnippetById = function (user, id) {
  //fetch the snippet by provided snippet id;
    SniphubServices.fetchBySnippetId(user, id).then(function (snippet) {
      //Populates input fields with data from snippet
      console.log("Snippet", snippet);
      $scope.snippet = snippet.data;
      //$scope.inputEntry = unescape($scope.snippet.text);
      $scope.text = unescape(snippet.data.text);
      $scope.titleField = unescape($scope.snippet.title);
      $scope.tabField = $scope.snippet.tabPrefix;
      $scope.scope = $scope.snippet.scope;
      $scope.userField = Auth.isAuth('username');
      $scope.snippetId = $scope.snippet.id;
      $scope.snippet.tags = $scope.snippet.tags;
    });
  };

  $scope.$watch('$viewContentLoaded', function () {
    $scope.fetchSnippetById($scope.params.id, $scope.params.snippetId);
  });

});