var OAuth = require('./oauth').OAuth,
    URL = require('url'),
    querystring = require('querystring');


exports.oDesk = function(key, secret) {
    this.baseUrl = 'https://www.odesk.com/api/';
    this.OAuth = new OAuth(key, secret);
}

exports.oDesk.prototype._secureRequest = function(method, path, data, callback) {
    if(typeof data == 'function') {
        callback = data;
        data = null;
    }
    if(!(this.OAuth.accessToken && this.OAuth.accessTokenSecret)) {
        return callback({data: 'OAuth.accessToken and OAuth.accessTokenSecret must be set.'})
    } else {
        var extraParams = {};
        if(method != 'GET') {
            extraParams = data || {};
            data = null;
            if(method == 'PUT' || method == 'DELETE') {
                extraParams['http_method'] = method.toLowerCase();
                method = 'POST';
            }
        } else if(data) {
            // append data params to url for GET request
            path += (path.indexOf("?") == -1) ? '?' : '&';
            path += querystring.stringify(data);
            data = null;
        }
        var url = URL.resolve(this.baseUrl, path);
        this.OAuth._performSecureRequest(this.OAuth.accessToken, this.OAuth.accessTokenSecret, method, url, extraParams, data, null, function(error, data, response) {
            if(error) return callback(error)
            else {
                if(response.headers['content-type'] == 'application/json') {
                    try {
                        var json = JSON.parse(data);
                        return callback(null, json)
                    } catch(error) {
                        return callback(error)
                    }
                } else return callback(null, data)
            }
        });
    }
}

exports.oDesk.prototype.get = function(path, data, callback) {
    return this._secureRequest('GET', path, data, callback)
}
exports.oDesk.prototype.post = function(path, data, callback) {
    return this._secureRequest('POST', path, data, callback)
}
exports.oDesk.prototype.put = function(path, data, callback) {
    return this._secureRequest('PUT', path, data, callback)
}
exports.oDesk.prototype.delete = function(path, data, callback) {
    return this._secureRequest('DELETE', path, data, callback)
}
