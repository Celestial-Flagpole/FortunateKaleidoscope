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
        var searchTags = searchStr.replace(/\s|#|\s#/g, '').split(',');
        console.log("searchTags", searchTags);
        for (var i = 0; i < snippets.length; i++) {
          var tags = snippets[i].tags.join(',').replace(/\s|#|\s#/g, '').split(',');;
          var included = true;
          for (var j = 0; j < searchTags.length; j++) {
            if(tags.indexOf(searchTags[j]) === -1) {
              included = false;
            } 
          }
          if (included) {
            filtered.push(snippets[i]);
          }
        }
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