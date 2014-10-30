var OktaAPI = require("../index.js");
var okta = new OktaAPI("00sG9QNcq956v_90a7SV5WmwbM06SrZ_rbHs_VpyR5", "khe", false);
var should = require("should");
var log = function(str, newline) {
	if(newline == undefined) newline = false;
	process.stdout.write(str + (newline ? "\n" : ""));
}
var checking = function(str) {
	log("Checking " + str + "()");
}
var ok = function() {
	log(" OK!", true);
}

var now = new Date().valueOf();

log("Starting Test Suite...", true);

var sessionId;

okta.createSession("kevin.he@okta.com", "160891Preview", null, function(d) {
    checking("createSession");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    sessionId = d.resp.id;
    ok();
    doThingsWithSession();
});

okta.createSession("kevin.he@okta.com", "160891Preview", {'additionalFields' : 'cookieToken'}, function(d) {
    checking("createSession with one time token");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    //sessionId = d.resp.id;
    ok();
});

function doThingsWithSession() {
    okta.validateSession(sessionId, function(d) {
        checking("validateSession");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id", sessionId);
        ok();
    });
    okta.extendSession(sessionId, function(d) {
        checking("extendSession");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id", sessionId);
        ok();
    });
}

setTimeout(function() {
    okta.closeSession(sessionId, function(d) {
        checking("closeSession");
        d.should.have.property("success", true);
        ok();
    });
}, 5000);