/*
*   Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*   Only tests operaations done on groups. Should call all the functions at 
*   least once.
*
*/


var OktaAPI = require("../index.js");
var okta = new OktaAPI("", "", false);
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

/*
*   add a new group 
*/
okta.addGroup(newProfile, function(d) {
    checking("addGroup");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    ok();
    gid = d.resp.id;
    getUser();
});



function deleteEveryThing() {

    /*
    *   deletes a group 
    */
    okta.deleteGroup(gid, function(d) {
        checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });
}

function doThingsWithGroup() {

    /*
    *   gets a group by it's id
    */
    okta.getGroup(gid, function(d) {
        checking("getGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id");
        ok();
    });

    /*
    *   updates a group with a new profile
    */
    okta.updateGroup(gid, newProfile, function(d) {
        checking("updateGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").with.property("id");
        ok();
    });

    /*
    *   adds a user to a group by group id and user id
    */
    okta.addUserToGroup(gid, uid, function(d) {
        checking("addUserToGroup");
        d.should.have.property("success", true);
        ok();

        /*
        *   removes a user to a group by group id and user id
        */
        okta.removeUserFromGroup(gid, uid, function(d) {
            checking("removeUserFromGroup");
            d.should.have.property("success", true);
            ok();
        });
    });

    /*
    *   gets all users in a group by group id
    */
    okta.getUsersInGroup(gid,null, function(d) {
        checking("getUsersInGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all users in a group by group id, with a filter
    */
    okta.getUsersInGroup(gid, {'limit' : 20}, function(d) {
        checking("getUsersInGroup with limit");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all groups
    */
    okta.getGroups(null, function(d) {
        checking("getGroups");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all groups, with filter 
    */
    okta.getGroups({'q': "Test-" + now, 'limit' : 1 }, function(d) {
        checking("getGroups with query");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });

    /*
    *   gets all apps assigned to group
    */
    okta.getAppsForGroup(gid, null, function(d) {
        checking("getAppsForGroup");
        d.should.have.property("success", true);
        d.should.have.property("resp").instanceof(Array);
        ok();
    });
}

function getUser() {
    /*
    *   gets a user to put in a group
    */
    okta.getUser("test@example.com", function(d) {
        if (!d.success) {
            throw new Error("Failed to get user from Okta: " + d.error);
        } else if (d.resp.hasOwnProperty("errorCode")) {
            throw new Error("Failed to get user from Okta: " + d.resp.errorCode);
        }
        uid = d.resp.id;
        doThingsWithGroup();
    });
}

setTimeout(deleteEveryThing, 5000);


