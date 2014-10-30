//if the tests don't pass the first time,.... just run it a few more times,
//callbacks come back out of order

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
var newProfile = OktaAPI.Helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@test.com");
var newCreds = OktaAPI.Helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");

var noPwProfile = OktaAPI.Helpers.constructProfile("incomp", "nopw", "incompnopw+" + now + "@test.com");
var noPwCreds = OktaAPI.Helpers.constructCredentials(null, "testetestest", "Deep Six");

var noQuesProfile = OktaAPI.Helpers.constructProfile("incomp", "noques", "incompnoques+" + now + "@test.com");
var noQuesCred = OktaAPI.Helpers.constructCredentials("superPass1", null, null );

var noCredProfile = OktaAPI.Helpers.constructProfile("incomp", "nocreds", "incompnocreds+" + now + "@test.com");
//var creds3 = OktaAPI.Helpers.constructCredentials("test", null, null );

var newUserId, newGroup, myId, myEmail = "kevin.he.oak@gmail.com";

log("Starting Test Suite...", true);


//gets called after checkGetUsers, needs newUserId to be set
function checkCredentialOps()
{
	/*
	*	Change Password
	*/
	//lifecycle version
	// okta.forgotPassword(newUserId, false, function(d) {
	// 	checking("forgotPassword lifecycle option");
	// 	d.should.have.property("resp").with.property("resetPasswordUrl");
	// 	ok();
	// });

	/*
	*	Change recovery
	*/
	okta.attemptChangeRecoveryQuestion(newUserId,{ "value": "superPass1" } , {"question" : "What happens when I update my question?", "answer": "My recovery credentials are updated" } , function(d) {
		checking("attemptChangeRecoveryQuestion");
		d.should.have.property("resp").with.property("password");
		ok();

		//change pw, credentials version
		okta.attemptResetPassword(newUserId,{ "value": "superPass239" } ,{ "answer": "My recovery credentials are updated" } , function(d) {
			checking("forgotPassword credentials option");
			d.should.have.property("resp").with.property("password");
			ok();

			/*
			*	Change Password, can't seem to chain this after passwd reset
			*/
			okta.attemptChangePassword(newUserId,{ "value": "superPass239" } ,{ "value": "superPass921380" } , function(d) {
				checking("changePassword");
				d.should.have.property("resp").with.property("password");
				ok();
			});
		});
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
	
	okta.updateUserPartial(newUserId, null, noQuesCred, function(d) {
		checking("updateUserPartial, no Questions Cred");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("credentials").with.property("password");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});

	okta.updateUserPartial(newUserId, null, noPwCreds, function(d) {
		checking("updateUserPartial, no pw Cred");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("credentials").with.property("recovery_question").with.property("question" , "testetestest");
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
		checkCredentialOps();
	});

	//checked, don't want to spam myself
	// okta.activateUser(myId, true, function(d) {
	// 	checking("activateUser");
	// 	d.should.have.property("success", true);
	// 	ok();
	// });

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

	okta.expirePassword(newUserId, true, function(d) {
		checking("expirePassword give temp password");
		d.should.have.property("resp").with.property("tempPassword");
		ok();
	});

	okta.expirePassword(newUserId, null, function(d) {
		checking("expirePassword no params");
		d.should.have.property("resp");
		ok();
	});

	okta.resetFactors(newUserId, function(d) {
		checking("resetFactors");
		d.should.have.property("resp");
		ok();
	});
}



function checkAddUser()
{
	okta.addUser(newProfile, newCreds, false, function(d) {
		checking("addUser");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		newUserId = d.resp.id;
		ok();
		updateUser();

	});

	okta.addUser(noPwProfile, noPwCreds, false, function(d) {
		checking("addUser no pw");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		//newUserId = d.resp.id;
		ok();
		//updateUser();
	});

	okta.addUser(noQuesProfile, noQuesCred, false, function(d) {
		checking("addUser no recovery question");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		//newUserId = d.resp.id;
		ok();
		//updateUser();
	});

	okta.addUser(noCredProfile, null, false, function(d) {
		checking("addUser no creds");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		//newUserId = d.resp.id;
		ok();
		//updateUser();
	});

}

function checkGetUser()
{
	okta.getUser("test@example.com", function(d) {
		checking("getUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		ok();
	});

	okta.getUser(myEmail, function(d) {
		checking("getUser me");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		myId = d.resp.id;
		ok();
	});

}

function checkGetUsers()
{
	okta.getUsers(undefined, function(d) {
		checking("getUsers");
		d.should.have.property("success", true);

		//d.should.have.property("resp")/.and != d.resp anymore
		//it's like an object full of arrays, contains some metadata it looks like
		d.should.have.property("resp");
		var resp = d.resp;
		resp.should.be.instanceof(Array);
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


function main() {

	checkGetUser();
	checkAddUser();
	checkGetUsers();
}


main();
setTimeout(deprovisionUser, 10000);
