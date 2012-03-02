var odesk = require('../'),
    rl = require('readline');


var key = '';
var secret = '';

function getUserData(key, secret) {
    console.log("\nEmulating web-based app...");
    var o = new odesk(key, secret);
    o.OAuth.getAuthorizeUrl('http://localhost/complete', function(error, url, requestToken, requestTokenSecret) {
        if(error) console.log(error);
        else {
            console.log("Please go to this URL (authorize the app if necessary):");
            console.log(url);
            console.log("After that you should be redirected back to your app URL with additional ?oauth_verifier= parameter");
            var i = rl.createInterface(process.stdin, process.stdout);
            i.question("Enter oauth_verifier: ", function(verifier) {
                i.close();
                process.stdin.destroy();
                o.OAuth.getAccessToken(requestToken, requestTokenSecret, verifier, function(error, accessToken, accessTokenSecret) {
                    if(error) console.log(error);
                    else {
                        o.OAuth.accessToken = accessToken;
                        o.OAuth.accessTokenSecret = accessTokenSecret;
                        // Async requests
                        o.get('auth/v1/info.json', function(error, data) {
                            console.log("Authenticated user info:\n", error || data, "\n");
                        });
                        o.get('team/v1/teamrooms.json', function(error, data) {
                            console.log("Team rooms:\n", error || data, "\n");
                        });
                        o.get('hr/v2/userroles.json', function(error, data) {
                            console.log("HR user roles:\n", error || data, "\n");
                        });
                    }
                });
            });
        }
    });
}

(function main() {
    if(key && secret) getUserData(key, secret);
    else {
        var i = rl.createInterface(process.stdin, process.stdout);
        i.question("Enter API key: ", function(key) {
            i.question("Enter API secret: ", function(secret) {
                i.close();
                getUserData(key, secret);
            });
        });
    }
})();
