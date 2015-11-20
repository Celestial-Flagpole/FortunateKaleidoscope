angular.module('sniphub.filter', [])
.filter('snippetFilter', function ($filter) {
    return function (snippets, searchStr) {
      var filtered = [];
      
      if (searchStr !== undefined && searchStr[0] === "@") {
        var username = searchStr.slice(1);
        var userMatch = new RegExp(username, 'i');
        for(var i = 0; i < snippets.length; i++) {
          var snippet = snippets[i];
          if(userMatch.test(snippet.user.username)) {
            filtered.push(snippet);
          }
        }
      } else if (searchStr !== undefined && searchStr[0] === "#") {

      } else if (searchStr !== undefined) {
        var jsonData = $filter('filter')(snippets, searchStr);
        filtered = jsonData;
      } else {
        for (var i = 0; i < snippets.length; i++) {
          filtered.push(snippets[i]);
        }
      }
      return filtered;
    };
});