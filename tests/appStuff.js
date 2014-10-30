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
var appID = "0oa9iu0rJASLAWPIYBQD";
var newApp = 
{
  "name": "bookmark",
  "label": "Sample Bookmark App",
  "signOnMode": "BOOKMARK",
  "settings": {
    "app": {
      "requestIntegration": false,
      "url": "https://example.com/bookmark.htm" 
    }
  }
};

log("Starting Test Suite...", true);


function checkAppOps()
{
	var newProfile = OktaAPI.Helpers.constructGroup("Test-" + now, "Test group from " + now);
	var gid;


	okta.addGroup(newProfile, function(d) {
	    checking("addGroup");
	    d.should.have.property("success", true);
	    d.should.have.property("resp").with.property("id");
	    ok();
	    gid = d.resp.id;

	    //checking assignment here to check the app listing
		okta.assignApplicationToGroup(appID, gid, function(d) {
		    checking("assignApplicationToGroup");
		    d.should.have.property("success", true);
		    d.should.have.property("resp").with.property("id", gid);
		    ok();

			//list apps, some filters, more then 1 app, it sends back as multiple responses
			okta.getApplications({"filter" : "group.id eq \"" + gid + "\"", "limit" : 1}, function(d) {
			    checking("listApp some args");
			    d.should.have.property("success", true);
			    d.should.have.property("resp");
				var resp = d.resp;
				resp.should.be.instanceof(Array);
				resp[0].should.have.property("id", appID);
			    ok();
			});
		});
	});


	//works, can't figure out how to programatically add new apps
	// okta.addApplication(newApp, function(d) {
	//     checking("addApp");
	//     d.should.have.property("success", true);
	//     d.should.have.property("resp").with.property("id");
	//     ok();
	// });


	
	okta.getApplication(appID, function(d) {
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


}


function main()
{
	checkAppOps();
}

main();







