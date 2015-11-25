$(window).load(function() {
 
    if (window.location.origin == chrome.identity.redirectURL()) {
 
        var hash = window.location.hash;
 
        // get access token
        var start = hash.indexOf("#access_token=");
        if ( start >= 0 ) {
            start = start + "#access_token=".length;
 
            var end = hash.indexOf("&token_type");
            var access_token = hash.substring(start, end);
 
            // Store it
            chrome.storage.local.set({"access_token":access_token}); 
 
            // Close the window
            window.close();
        }
    }
});
