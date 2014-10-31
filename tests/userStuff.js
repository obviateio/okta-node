/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operaations done on Users. Should call all the functions at 
*	least once.
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
var newProfile = OktaAPI.Helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@test.com");
var newCreds = OktaAPI.Helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");

var noPwProfile = OktaAPI.Helpers.constructProfile("incomp", "nopw", "incompnopw+" + now + "@test.com");
var noPwCreds = OktaAPI.Helpers.constructCredentials("", "testetestest", "Deep Six");

var noQuesProfile = OktaAPI.Helpers.constructProfile("incomp", "noques", "incompnoques+" + now + "@test.com");
var noQuesCred = OktaAPI.Helpers.constructCredentials("superPass1", "", "" );

var noCredProfile = OktaAPI.Helpers.constructProfile("incomp", "nocreds", "incompnocreds+" + now + "@test.com");
//var creds3 = OktaAPI.Helpers.constructCredentials("test", null, null );

var newUserId, newGroup, myId, myEmail = "test@test.com";

log("Starting Test Suite...", true);



function deprovisionUser() {
	/*
	*	deativate a user
	*/
	okta.deactivateUser(newUserId, function(d) {
		checking("deactivateUser");
		d.should.have.property("success", true);
		ok();
	});
}



function checkPasswordOp()
{

	/*
	*	deativate a user
	*/
	okta.resetPassword(newUserId, false, function(d) {
		checking("resetPassword");
		d.should.have.property("resp").with.property("resetPasswordUrl");
			ok();

		/*
		*	expires a password, sets it a temp password
		*/
		okta.expirePassword(newUserId, true, function(d) {
			checking("expirePassword give temp password");
			d.should.have.property("resp").with.property("tempPassword");
			ok();

			/*
			*	expire password, user has to change pw on next login
			*/
			okta.expirePassword(newUserId, null, function(d) {
				checking("expirePassword no params");
				d.should.have.property("resp");
				ok();

				deprovisionUser();
			});
		});

	});
}


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
			*	Change Password
			*/
			okta.attemptChangePassword(newUserId,{ "value": "superPass239" } ,{ "value": "superPass921380" } , function(d) {
				checking("changePassword");
				d.should.have.property("resp").with.property("password");
				ok();

				checkPasswordOp();
			});
		});
	});
}

function checkLifecycleOps()
{

	/*
	*	Activates a user
	*/
	okta.activateUser(newUserId, false, function(d) {
		checking("activateUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("activationUrl").startWith("https://");
		ok();
		checkCredentialOps();
	});

	/*
	*	Activates a user with an email link
	*/
	//checked, don't want to spam myself
	// okta.activateUser(myId, true, function(d) {
	// 	checking("activateUser");
	// 	d.should.have.property("success", true);
	// 	ok();
	// });
	
	/*
	*	Unlocks a user
	*/
	okta.unlockUser(newUserId, function(d) {
		checking("unlockUser");
		d.should.have.property("success", false);
		ok();
	});

	/*
	*	resets the fators for a user
	*/
	okta.resetFactors(newUserId, function(d) {
		checking("resetFactors");
		d.should.have.property("resp");
		ok();
	});
}

function checkRelatedResources()
{

	/*
	*	Gets links to all apps assigned to a user
	*/
	okta.getAppLinks(newUserId, function(d) {
		checking("getAppLinks");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});

	/*
	*	Gets groups that user is a member of
	*/
	okta.getMemberGroups(newUserId, function(d) {
		checking("getMemberGroups");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});
}


/*
*	These operations don't effect the lifecycle of a user much, so they can return whenever,
*	as long as it's before the deprovision.
*/
function updateUser() {

	newProfile.mobilePhone = '123-456-7890';
	/*
	*	Update user with whole profile
	*/
	okta.updateUser(newUserId, newProfile, null, function(d) {
		checking("updateUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("profile").with.property("mobilePhone", "123-456-7890");
		ok();
	});

	/*
	*	Update user with whole profile
	*/
	okta.updateUserPartial(newUserId, {mobilePhone: "321-654-0987"}, null, function(d) {
		checking("updateUserPartial");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("profile").with.property("mobilePhone", "321-654-0987");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});
	
	/*
	*	Update user with partial credentials, no recovery question
	*/
	okta.updateUserPartial(newUserId, null, noQuesCred, function(d) {
		checking("updateUserPartial, no Questions Cred");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("credentials").with.property("password");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});

	/*
	*	Update user with partial credentials, no passwords
	*/
	okta.updateUserPartial(newUserId, null, noPwCreds, function(d) {
		checking("updateUserPartial, no pw Cred");
		d.should.have.property("success", true);
		var resp = d.resp;
		resp.should.have.property("credentials").with.property("recovery_question").with.property("question" , "testetestest");
		resp.should.have.property("profile").with.property("firstName", "Timothy");
		ok();
	});



	checkRelatedResources();
	checkLifecycleOps();
}



function checkAddUser()
{
	/*
	*	Add user normal
	*/
	okta.addUser(newProfile, newCreds, false, function(d) {
		checking("addUser");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		newUserId = d.resp.id;
		ok();
		updateUser();

	});

	/*
	*	Add user , with no pw
	*/
	okta.addUser(noPwProfile, noPwCreds, false, function(d) {
		checking("addUser no pw");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		ok();
	});

	/*
	*	Add user , with no recovery question
	*/
	okta.addUser(noQuesProfile, noQuesCred, false, function(d) {
		checking("addUser no recovery question");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		ok();
	});

	/*
	*	Add user , with no credentials at all
	*/
	okta.addUser(noCredProfile, null, false, function(d) {
		checking("addUser no creds");
		d.should.have.property("success", true)
		d.should.have.property("resp").with.property("id");
		ok();
	});

}

function checkGetUser()
{
	/*
	*	gets a user with their id, login or shortname
	*/
	okta.getUser("test@example.com", function(d) {
		checking("getUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		ok();
	});

	// okta.getUser(myEmail, function(d) {
	// 	checking("getUser me");
	// 	d.should.have.property("success", true);
	// 	d.should.have.property("resp").with.property("id");
	// 	myId = d.resp.id;
	// 	ok();
	// });

}

function checkGetUsers()
{
	/*
	*	gets user with filters
	*/
	okta.getUsers({'q': "tmcgee+" + now + "@test.com", 'limit' : 1 }, function(d) {
		checking("getUsers");
		d.should.have.property("success", true);

		//d.should.have.property("resp")/.and != d.resp 
		//it's like an object full of arrays, contains some metadata it looks like
		d.should.have.property("resp");
		var resp = d.resp;
		resp.should.be.instanceof(Array);
		ok();
	});

}


function main() {

	checkGetUser();
	checkAddUser();
	checkGetUsers();
}


main();


