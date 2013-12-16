var OktaAPI = require("../index.js");
var okta = new OktaAPI("00n3pI5aq6y9eoZwrS9zRFygEfBj-dwYt4D20cFPeW", "jjohnson", true);
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
var newProfile = OktaAPI.Helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@ncis.navy.mil");
var newCreds = OktaAPI.Helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");
var newUserId, newGroup;

log("Starting Test Suite...", true);

function main() {
	okta.addUser(newProfile, newCreds, false, function(data) {
		checking("addUser");
		data.should.have.property("success", true)
		data.should.have.property("resp").with.property("id");
		newUserId = data.resp.id;
		ok();
		updateUser();
	});

	okta.getUser("snofox@snofox.net", function(d) {
		checking("getUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		ok();
	});

	okta.getUsers(function(d) {
		checking("getUsers");
		d.should.have.property("success", true);
		d.should.have.property("resp").and.should.be.instanceof(Array);
		ok();
	});
}

function updateUser() {
	newProfile.mobilePhone = '123-456-7890';
	okta.updateUser(newUserId, newProfile, null, function(d) {
		checking("updateUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("profile").with.property("mobilePhone", "123-456-7890");
		ok();
	});

	okta.updateUserPartial(newUserId, {mobilePhone: "321-654-0987"}, null, function(d) {
		checking("updateUserPartial");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("profile").with.property("mobilePhone", "321-654-0987");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});
	
	okta.getAppLinks(newUserId, function(d) {
		checking("getAppLinks");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});

	okta.getMemberGroups(newUserId, function(d) {
		checking("getMemberGroups");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});

	okta.activateUser(newUserId, false, function(d) {
		checking("activateUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("activationUrl").startWith("https://");
		ok();
	});

	okta.unlockUser(newUserId, function(d) {
		checking("unlockUser");
		d.should.have.property("success", false);
		ok();
	});

	okta.resetPassword(newUserId, false, function(d) {
		checking("resetPassword");
		d.should.have.property("resp").with.property("resetPasswordUrl");
		ok();
	});
}

function deprovisionUser() {
	okta.deactivateUser(newUserId, function(d) {
		checking("deactivateUser");
		d.should.have.property("success", true);
		ok();
	});
}

main();
setTimeout(deprovisionUser, 5000);
