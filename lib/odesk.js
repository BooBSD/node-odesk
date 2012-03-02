var OAuth = require('./oauth').OAuth,
    URL = require('url');


exports.oDesk = function(key, secret) {
    this.baseUrl = 'https://www.odesk.com/api/';
    this.OAuth = new OAuth(key, secret);
}

exports.oDesk.prototype._secureRequest = function(method, path, callback) {
    if(!(this.OAuth.accessToken && this.OAuth.accessTokenSecret)) {
        throw new Error('OAuth.accessToken and OAuth.accessTokenSecret must be set.')
    } else {
        var url = URL.resolve(this.baseUrl, path);
        this.OAuth._performSecureRequest(this.OAuth.accessToken, this.OAuth.accessTokenSecret, method, url, null, "", null, function(error, data, response) {
            if(response.headers['content-type'] == 'application/json') {
                data = JSON.parse(data);
            }
            return callback(error, data)
        });
    }
}

exports.oDesk.prototype.get = function(path, callback) {
    return this._secureRequest("GET", path, callback)
}
exports.oDesk.prototype.post = function(path, callback) {
    return this._secureRequest("POST", path, callback)
}
exports.oDesk.prototype.put = function(path, callback) {
    return this._secureRequest("PUT", path, callback)
}
exports.oDesk.prototype.delete = function(path, callback) {
    return this._secureRequest("DELETE", path, callback)
}
