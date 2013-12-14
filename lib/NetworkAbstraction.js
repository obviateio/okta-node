/**
 * Created by jjohnson on 12/9/13.
 */

var https = require("https");
var url = require("url");
var request = require("request");
var hostname, apiVersion = null;

function NetworkAbstraction(apiKey, domain, preview) {
    hostname = domain;
    hostname += ".";
    hostname += (!preview ? "okta.com" : "oktapreview.com");
    apiVersion = "v1";
    request = request.defaults({
            headers: {Authorization: "SSWS " + apiKey}
        }
    );
}

NetworkAbstraction.prototype.get = function(what, query, callback) {
    sendHttpReqNoBody("GET", what, query, callback);
}

NetworkAbstraction.prototype.post = function(where, what, query, callback) {
    sendHttpReq("POST", where, what, query, callback);
}

NetworkAbstraction.prototype.put = function(where, what, query, callback) {
    sendHttpReq("PUT", where, what, query, callback);
}

NetworkAbstraction.prototype.delete = function(where, query, callback) {
    sendHttpReqNoBody("DELETE", where, query, callback);
}

// POST and PUT requests are mostly identical.
var sendHttpReq = function(method, where, what, query, callback) {
    var opts = {};
    if(what == undefined) opts.body = "";
    else opts.body = JSON.stringify(what);
    opts.headers = {};
    opts.headers['Content-Length'] = opts.body.length;
    opts.headers['Content-Type'] = "application/json";
    opts.method = method;
    opts.uri = url.parse(constructURL(where));
    if(query != null) opts.qs = query;
    request(opts, function(error, clientResp, resp) { handleResponse(error, resp, callback) });
}

var sendHttpReqNoBody = function(method, where, query, callback) {
    var opts = {};
    if(query != null) opts.qs = query;
    opts.method = method;
    opts.uri = url.parse(constructURL(where));
    request(opts, function(error, clientResp, resp) { handleResponse(error, resp, callback) });
}

function handleResponse(error, resp, callback) {
    if(callback == undefined) return;
    if(error) {
        callback({error: error, success: false});
    } else {
        var jsonResp;
        if(resp.statusCode == 200) {
            try {
                jsonResp = JSON.parse(resp);
            } catch(err) {
                callback({success: false, error: "Returned JSON is invalid", resp: resp});
            }
            callback({success: true, resp: jsonResp});
        } else if(resp.statusCode == 204) {
            callback({success: true});
        } else if(resp.statusCode == 401) {
            try {
                resp = JSON.parse(resp);
            } catch (err) {
                // no-op
            }
            callback({success: false, error: "Unauthorized", resp: resp});
        } else {
            callback({success: false, error: "Received HTTP Status code: " + resp.statusCode, resp: resp})
        }
    }
}

function constructURL(what) {
    return "https://" + hostname + "/api/" + apiVersion + "/" + what;
}

module.exports = NetworkAbstraction;