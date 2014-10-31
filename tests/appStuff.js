/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operaations done on Apps. Should run all ops once.
*	should deprovision/delete everything that i creates
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

/*
*	a bunch of profiles, grabbed these from Okta docs
*/
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

    /*
    *   deletes a group 
    */
	okta.deleteGroup(gid1, function(d) {
        //checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });

    /*
    *   deletes a group 
    */
    okta.deleteGroup(gid2, function(d) {
        //checking("deleteGroup");
        d.should.have.property("success", true);
        ok();
    });
}


function checkDeleteOp()
{

    /*
    *   deletes an app 
    */
	okta.deleteApplication(appId, function(d) {
	    checking("deleteApplication");
	    d.should.have.property("success", true);

	    ok();
	});

}

function checkLifecycleOps()
{

    /*
    *   deactivates an App
    */
	//testing update app, assumes addApplication was run previously
	okta.deactivateApplication(appId, function(d) {
	    checking("deactivateApplication");
	    d.should.have.property("success", true);

	    ok();

	    /*
	    *   activates a group 
	    */
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


    /*
    *   adds a group 
    */
	okta.addGroup(newProfile, function(d) {
	    checking("addGroup");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid2 = d.resp.id;


		/*
		*   assigns an app to a group
		*/
	    //checking assignment here to check the app listing
		okta.assignApplicationToGroup(appId, gid2, function(d) {
		    checking("assignApplicationToGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid2);
		    ok();

		    /*
		    *   deletes a group 
		    */
			okta.getGroupAssignedToApplication(appId, gid2, function(d) {
			    checking("getGroupAssignedToApplication");
			    d.should.have.property("success", true);
			    d.should.have.property("resp").with.property("id", gid2);
			    ok();

			    /*
			    *   get groups assigned to an application, with filter
			    */
				okta.getGroupsAssignedToApplication(appId, {"limit" : 1}, function(d) {
				    checking("getGroupsAssignedToApplication");
				    d.should.have.property("success", true);
				    ok();

				    /*
				    *   remove group assigned to an application
				    */
				    //remove the first group
					okta.removeGroupFromApplication(appId, gid1, function(d) {
					    checking("removeGroupFromApplication");
					    d.should.have.property("success", true);
					    ok();

					    /*
					    *   remove group assigned to an application
					    */
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

    /*
    *   adds a user 
	*/
	okta.addUser(newProfile, newCreds, false, function(d) {
		checking("addUser");
		d.should.have.property("success", true);
		d.should.have.property("resp").with.property("id");
		newUserId = d.resp.id;
		ok();

	    /*
	    *   assigns a user to an Application, *NOTE* appUserProfile != response you get from adding a user 
		*/
		appUserProfile.id = newUserId;
		okta.assignUserToApplication(appId, appUserProfile, function(d) {
			checking("assignUserToApplication");
			d.should.have.property("success", true);
			d.should.have.property("resp").with.property("id", newUserId);
			ok();

		    /*
		    *   gets a user that was assigned to an application
			*/
			okta.getAssignedUserForApplication(appId, newUserId, function(d) {
				checking("getAssignedUserForApplication");
				d.should.have.property("success", true);
				d.should.have.property("resp").with.property("id", newUserId);
				ok();


			    /*
			    *   gets all users assigned to an app
				*/
				okta.getUsersAssignedToApplication(appId, function(d) {
					checking("getUsersAssignedToApplication");
					d.should.have.property("success", true);
					var resp = d.resp;
					resp.should.be.instanceof(Array);
					resp[0].should.have.property("id", newUserId);
					//d.should.have.property("resp").with.property("id", newUserId);
					ok();

				    /*
				    *   updates the credentials for an application
					*/
					okta.updateCredsForApplication(appId ,newUserId ,newAppCred , function(d) {
						checking("updateCredsForApplication");
						d.should.have.property("success", true);
						var resp = d.resp;
						d.should.have.property("resp").with.property("id", newUserId);
						d.should.have.property("resp").with.property("credentials").with.property("userName", newAppCred.credentials.userName);
						ok();

					    /*
					    *   updates the profile for an application
						*/
						okta.updateProfileForApplication(appId ,newUserId ,newAppCred , function(d) {
							checking("updateProfileForApplication");
							d.should.have.property("success", true);
							var resp = d.resp;
							d.should.have.property("resp").with.property("id", newUserId);
							d.should.have.property("resp").with.property("credentials").with.property("userName", newAppCred.credentials.userName);
							ok();

						    /*
						    *   removes a user from an application
							*/
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


    /*
    *   creates a group to test with
	*/
	//need this to assign apps to groups
	okta.addGroup(newProfile, function(d) {
	    checking("addGroup");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid1 = d.resp.id;

	    /*
	    *   assigns the group to an app
		*/
	    //checking assignment here to check the app listing
		okta.assignApplicationToGroup(appId, gid1, function(d) {
		    checking("assignApplicationToGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid1);
		    ok();

		    /*
		    *   gets all applications that matches the filter
			*/
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

    /*
    *   get profile for an application
	*/
	okta.getApplication(appId, function(d) {
	    checking("getApp");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	});

    /*
    *   get profile for an application
	*/
	//list apps, no args
	okta.getApplications(null, function(d) {
	    checking("listApp no args");
	    d.should.have.property("success", true);
	    d.should.have.property("resp");
		var resp = d.resp;
		resp.should.be.instanceof(Array);
	    ok();
	});


    /*
    *   updates the profile for an application
	*/
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

    /*
    *   adds an application
	*/
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







