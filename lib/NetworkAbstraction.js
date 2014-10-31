/**
 * Created by jjohnson on 12/9/13.
 */

var https = require("https");
var url = require("url");
var request = require("request");
var hostname, apiVersion, apiKey = null;

function NetworkAbstraction(givenKey, domain, preview) {
    hostname = domain;
    hostname += ".";
    hostname += (!preview ? "okta.com" : "oktapreview.com");
    apiVersion = "v1";
    apiKey = givenKey;
}

NetworkAbstraction.prototype.get = function(what, query, callback) {
    sendHttpReqNoBody("GET", constructURL(what), query, callback);
}

NetworkAbstraction.prototype.post = function(where, what, query, callback) {
    sendHttpReq("POST", constructURL(where), what, query, callback);
}

NetworkAbstraction.prototype.put = function(where, what, query, callback) {
    sendHttpReq("PUT", constructURL(where), what, query, callback);
}

NetworkAbstraction.prototype.delete = function(where, query, callback) {
    sendHttpReqNoBody("DELETE", constructURL(where), query, callback);
}

// POST and PUT requests are mostly identical.
var sendHttpReq = function(method, where, what, query, callback) {
    var opts = {};
    var followLink;
    if(query)
    {
        followLink =  query.followLink;
        delete query.followLink;
    }
    if(what == undefined) opts.body = "";
    else opts.body = JSON.stringify(what);
    opts.headers = {};
    opts.headers['Content-Length'] = opts.body.length;
    opts.headers['Content-Type'] = "application/json";
    opts.headers['Authorization'] = "SSWS " + apiKey;
    opts.method = method;
    opts.uri = url.parse(where);
    if(query != null) opts.qs = query;
    request(opts, function(error, clientResp, resp) { handleResponse(error, followLink, clientResp, resp, callback) });
}

var sendHttpReqNoBody = function(method, where, query, callback) {
    var opts = {};
    var followLink;
    if(query)
    {
        followLink =  query.followLink;
        delete query.followLink;
    }
    if(query != null) opts.qs = query;
    opts.headers = {};
    opts.headers['Authorization'] = "SSWS " + apiKey;
    opts.method = method;
    opts.uri = url.parse(where);
    request(opts, function(error, clientResp, resp) { handleResponse(error, followLink, clientResp, resp, callback) });
}

function handleResponse(error, followLink, clientResp, resp, callback) {
    //console.log(require('util').inspect(clientResp, {depth:null}));
    var doFollowLink = true;
    if(followLink === false)
    {
        doFollowLink = false;
    }
    if(callback == undefined) return;
    if(error) {
        callback({error: error, success: false});
    } else {
        var jsonResp;
        if(clientResp.statusCode == 200) {
            try {
                jsonResp = JSON.parse(resp);
            } catch(err) {
                callback({success: false, paged: false, error: "Returned JSON is invalid", resp: resp});
            }
            var outObj = {success: true, paged: false};
            if (jsonResp.obj != undefined) outObj.resp = jsonResp.obj;
            else outObj.resp = jsonResp;
            if (clientResp.headers.link != undefined) {
                // Follow Pagination links
                outObj.paged = true;
                outObj.pageEnd = true;
                var links = clientResp.headers.link.split(",");
                var hasNext = false;
                for(i in links) {
                    var link = links[i];
                    var bits = link.split(";");
                    if (bits[1] == " rel=\"next\"") {
                        var finalLink = bits[0].substr(2, bits[0].length - 3);
                        outObj.pageEnd = false;
                        if(!doFollowLink)
                        {
                            outObj.next = finalLink;
                            break;
                        }
                        else
                            sendHttpReqNoBody("GET", finalLink, null, callback);
                    }
                }
            }
            callback(outObj);
        } else if(clientResp.statusCode == 204) {
            callback({success: true, paged: false});
        } else if(clientResp.statusCode == 401) {
            try {
                resp = JSON.parse(resp);
            } catch (err) {
                // no-op
            }
            callback({success: false, paged: false, error: "Unauthorized", resp: resp});
        } else {
            callback({success: false, paged: false, error: "Received HTTP Status code: " + clientResp.statusCode, resp: resp})
        }
    }
}

function constructURL(what) {
    return "https://" + hostname + "/api/" + apiVersion + "/" + what;
}

module.exports = NetworkAbstraction;