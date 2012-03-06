var oauth = require('oauth'),
    qs = require('querystring');


exports.OAuth = function(key, secret) {
    this.requestUrl = "https://www.odesk.com/api/auth/v1/oauth/token/request";
    this.accessUrl = "https://www.odesk.com/api/auth/v1/oauth/token/access";
    this.key = key;
    this.secret = secret;
    this.version = "1.0";
    this.callback = null;
    this.signatureMethod = "HMAC-SHA1";
    this.nonceSize = 32;
    this.customHeaders = {
        'Accept' : "application/json",
        'Connection' : "close",
        'User-Agent': "Node-oDesk"
    }
    return new oauth.OAuth(this.requestUrl, this.accessUrl, this.key, this.secret, this.version, this.callback, this.signatureMethod, this.nonceSize, this.customHeaders)
}

oauth.OAuth.prototype.getRequestToken = function(callback) {
    var self = this;
    this.getOAuthRequestToken(function(error, requestToken, requestTokenSecret, parsedQueryString) {
        if(error) callback(error);
        else {
            self.requestToken = requestToken;
            self.requestTokenSecret = requestTokenSecret;
            return callback(error, requestToken, requestTokenSecret)
        }
    });
}

oauth.OAuth.prototype.getAccessToken = oauth.OAuth.prototype.getOAuthAccessToken

oauth.OAuth.prototype.getAuthorizeUrl = function(callbackUrl, callback) {
    var authorizeUrl = "https://www.odesk.com/services/api/auth";
    var params = {};
    if(typeof callbackUrl == "function") {
        callback = callbackUrl;
    } else {
        params.oauth_callback = callbackUrl;
    }
    if(this.requestToken && this.requestTokenSecret) {
        params.oauth_token = this.requestToken;
        return callback(null, authorizeUrl + "?" + qs.stringify(params), this.requestToken, this.requestTokenSecret);
    } else {
        this.getRequestToken(function(error, requestToken, requestTokenSecret, parsedQueryString) {
            if(error) callback(error);
            else {
                params.oauth_token = requestToken;
                return callback(null, authorizeUrl + "?" + qs.stringify(params), requestToken, requestTokenSecret);
            }
        });
    }
}
