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
var newProfile = OktaAPI.Helpers.constructGroup("Test-" + now, "Test group from " + now);
var uid, gid;

log("Starting Test Suite...", true);

okta.addGroup(newProfile, function(d) {
    checking("addGroup");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    ok();
    gid = d.resp.id;
    getUser();
});

function doThingsWithGroup() {
    okta.getGroup(gid, function(d) {
        checking("getGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id");
        ok();
    });
    okta.updateGroup(gid, newProfile, function(d) {
        checking("updateGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id");
        ok();
    });
    okta.addUserToGroup(gid, uid, function(d) {
        checking("addUserToGroup");
        d.should.have.property("success", true);
        ok();
        okta.removeUserFromGroup(gid, uid, function(d) {
            checking("removeUserFromGroup");
            d.should.have.property("success", true);
            ok();
        });
    });
    okta.getUsersInGroup(gid, function(d) {
        checking("getUsersInGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    })
    okta.getGroups(null, function(d) {
        checking("getGroups");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });
    okta.getAppsForGroup(gid, null, function(d) {
        checking("getAppsForGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });
}

function getUser() {
    okta.getUser("snofox@snofox.net", function(d) {
        if (!d.success) {
            throw new Error("Failed to get user from Okta: " + d.error);
        } else if (d.resp.hasOwnProperty("errorCode")) {
            throw new Error("Failed to get user from Okta: " + d.resp.errorCode);
        }
        uid = d.resp.id;
        doThingsWithGroup();
    });
}

function deleteEveryThing() {
    okta.deleteGroup(gid, function(d) {
        checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });
}

setTimeout(deleteEveryThing, 5000);