var OktaAPI = require("../index.js");
var okta = new OktaAPI("", "jjohnson", true);
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

okta.createSession("snofox@snofox.net", "", null, function(d) {
    checking("createSession");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    sessionId = d.resp.id;
    ok();
    doThingsWithSession();
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