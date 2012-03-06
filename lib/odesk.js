var OAuth = require('./oauth').OAuth,
    URL = require('url');


exports.oDesk = function(key, secret) {
    this.baseUrl = 'https://www.odesk.com/api/';
    this.OAuth = new OAuth(key, secret);
}

exports.oDesk.prototype._secureRequest = function(method, path, data, callback) {
    if(!(this.OAuth.accessToken && this.OAuth.accessTokenSecret)) {
        throw new Error('OAuth.accessToken and OAuth.accessTokenSecret must be set.')
    } else {
        var extraParams = {};
        if(typeof data == "function") {
            callback = data;
            data = "";
        }
        if(method != 'GET') {
            extraParams = data || {};
            data = null;
            if(method == 'PUT' || method == 'DELETE') {
                extraParams['http_method'] = method.toLowerCase();
                method = 'POST';
            }
        }
        var url = URL.resolve(this.baseUrl, path);
        this.OAuth._performSecureRequest(this.OAuth.accessToken, this.OAuth.accessTokenSecret, method, url, extraParams, data, null, function(error, data, response) {
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
exports.oDesk.prototype.post = function(path, data, callback) {
    return this._secureRequest("POST", path, data, callback)
}
exports.oDesk.prototype.put = function(path, data, callback) {
    return this._secureRequest("PUT", path, data, callback)
}
exports.oDesk.prototype.delete = function(path, callback) {
    return this._secureRequest("DELETE", path, callback)
}
