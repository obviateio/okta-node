/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operaations done on Apps.
*	Tests are chained, no way out of it that I can think of right now
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
var appId, newUserId, gid1, gid2;
var newProfile = OktaAPI.Helpers.constructProfile("Timothy", "McGee", "tmcgee+" + now + "@test.com");
var newCreds = OktaAPI.Helpers.constructCredentials("superPass1", "What is my favorite book?", "Deep Six");

var appProfile = 
{
  "name": "template_saml_2_0",
  "label": "Example SAML App" + now,
  "signOnMode": "SAML_2_0",
  "settings": {
    "app": {
      "audienceRestriction": "https://example.com/tenant/123",
      "forceAuthn": false,
      "postBackURL": "https://example.com/sso/saml",
      "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      "requestCompressed": "COMPRESSED",
      "recipient": "https://example.com/sso/saml",
      "signAssertion": "SIGNED",
      "destination": "https://example.com/sso/saml",
      "signResponse": "SIGNED",
      "nameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      "groupName": null,
      "groupFilter": null,
      "defaultRelayState": null,
      "configuredIssuer": null,
      "attributeStatements": null
    }
  }
};

var appUserProfile = 
{
  "id": "",
  "scope": "USER",
  "credentials": {
    "userName": "tmcgee+" + now + "@test.com",
    "password": {
      "value": "superPass1"
    }
  }
};

var appUserProfileUpdate = 
{
  "profile": {
    "salesforceGroups": [
      "Partner"
    ],
    "role": "Developer",
    "profile": "Gold Partner User"
  }
};

var newAppCred = 
{
  "credentials": {
    "userName": "user@example.com",
    "password": {
      "value": "updatedP@55word"
    }
  }
};

log("Starting Test Suite...", true);


function cleanUpGroups()
{
	okta.deleteGroup(gid1, function(d) {
        //checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });
    okta.deleteGroup(gid2, function(d) {
        //checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });
}

function checkDeleteOp()
{
	okta.deleteApplication(appId, function(d) {
	    checking("deleteApplication");
	    d.should.have.property("success", true);

	    ok();
	});

}

function checkLifecycleOps()
{
	//testing update app, assumes addApplication was run previously
	okta.deactivateApplication(appId, function(d) {
	    checking("deactivateApplication");
	    d.should.have.property("success", true);

	    ok();


		okta.activateApplication(appId, function(d) {
		    checking("activateApplication");
		    d.should.have.property("success", true);

		    ok();

		    //deactivating again to delete
			okta.deactivateApplication(appId, function(d) {
			    checkDeleteOp();
			});
		});
	});



}


function checkAppGroupOps()
{
	var newProfile = OktaAPI.Helpers.constructGroup("Test2-" + now, "Test2 group from " + now);

	okta.addGroup(newProfile, function(d) {
	    checking("addGroup");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid2 = d.resp.id;


	    //checking assignment here to check the app listing
		okta.assignApplicationToGroup(appId, gid2, function(d) {
		    checking("assignApplicationToGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid2);
		    ok();

			okta.getGroupAssignedToApplication(appId, gid2, function(d) {
			    checking("getGroupAssignedToApplication");
			    d.should.have.property("success", true);
			    d.should.have.property("resp").with.property("id", gid2);
			    ok();

				okta.getGroupsAssignedToApplication(appId, {"limit" : 1}, function(d) {
				    checking("getGroupsAssignedToApplication");
				    d.should.have.property("success", true);
				    ok();

				    //remove the first group
					okta.removeGroupFromApplication(appId, gid1, function(d) {
					    checking("removeGroupFromApplication");
					    d.should.have.property("success", true);
					    ok();

					    //remove second group
						okta.removeGroupFromApplication(appId, gid2, function(d) {
						    checking("removeGroupFromApplication");
						    d.should.have.property("success", true);
						    ok();

							checkLifecycleOps();
						});
					});
				});
			});

		});
	});

}

//i had to chain them all together b/c they rely on eachother
function checkAppUserOps()
{
	okta.addUser(newProfile, newCreds, false, function(d) {
		checking("addUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		newUserId = d.resp.id;
		ok();

		appUserProfile.id = newUserId;
		okta.assignUserToApplication(appId, appUserProfile, function(d) {
			checking("assignUserToApplication");
			d.should.have.property("success", true);
			d.should.have.property("resp").with.property("id", newUserId);
			ok();


			okta.getAssignedUserForApplication(appId, newUserId, function(d) {
				checking("getAssignedUserForApplication");
				d.should.have.property("success", true);
				d.should.have.property("resp").with.property("id", newUserId);
				ok();


				okta.getUsersAssignedToApplication(appId, function(d) {
					checking("getUsersAssignedToApplication");
					d.should.have.property("success", true);
					var resp = d.resp;
					resp.should.be.instanceof(Array);
					resp[0].should.have.property("id", newUserId);
					//d.should.have.property("resp").with.property("id", newUserId);
					ok();


					okta.updateCredsForApplication(appId ,newUserId ,newAppCred , function(d) {
						checking("updateCredsForApplication");
						d.should.have.property("success", true);
						var resp = d.resp;
						d.should.have.property("resp").with.property("id", newUserId);
						d.should.have.property("resp").with.property("credentials").with.property("userName", newAppCred.credentials.userName);
						ok();


						okta.updateProfileForApplication(appId ,newUserId ,newAppCred , function(d) {
							checking("updateProfileForApplication");
							d.should.have.property("success", true);
							var resp = d.resp;
							d.should.have.property("resp").with.property("id", newUserId);
							d.should.have.property("resp").with.property("credentials").with.property("userName", newAppCred.credentials.userName);
							ok();


							okta.removeUserFromApplication(appId ,newUserId , function(d) {
								checking("removeUserFromApplication");
								d.should.have.property("success", true);
								ok();

								checkAppGroupOps();
							});
						});
					});
				});
			});

		});
	});
}


function checkAppOps()
{
	var newProfile = OktaAPI.Helpers.constructGroup("Test-" + now, "Test group from " + now);


	//need this to assign apps to groups
	okta.addGroup(newProfile, function(d) {
	    checking("addGroup");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid1 = d.resp.id;

	    //checking assignment here to check the app listing
		okta.assignApplicationToGroup(appId, gid1, function(d) {
		    checking("assignApplicationToGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid1);
		    ok();

			//list apps, some filters, more then 1 app, it sends back as multiple responses
			okta.getApplications({"filter" : "group.id eq \"" + gid1 + "\"", "limit" : 1}, function(d) {
			    checking("listApp some args");
			    d.should.have.property("success", true);
			    d.should.have.property("resp");
				var resp = d.resp;
				resp.should.be.instanceof(Array);
				resp[0].should.have.property("id", appId);


			    ok();

			    checkAppUserOps();

			});
		});
	});


	
	okta.getApplication(appId, function(d) {
	    checking("getApp");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	});

	//list apps, no args
	okta.getApplications(null, function(d) {
	    checking("listApp no args");
	    d.should.have.property("success", true);
	    d.should.have.property("resp");
		var resp = d.resp;
		resp.should.be.instanceof(Array);
	    ok();
	});


	//testing update app, assumes addApplication was run previously
	okta.updateApplication(appId, appProfile, function(d) {
	    checking("updateApplication");
	    d.should.have.property("success", true);
	    var resp = d.resp;
	    for(var attr in appProfile)
	    {
	    	resp.should.have.property(attr, appProfile[attr]);
	    }
	    ok();
	});


}



function checkAddOp()
{
	okta.addApplication(appProfile, function(d) {
	    checking("addApp");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
		appId = d.resp.id;
	    ok();

		checkAppOps();
	});

}

function main()
{
	checkAddOp();
}



main();







