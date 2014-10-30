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
var lastUpdated = "2013-09-09T16:25:14.000Z";
var created = "2013-09-09T16:25:14.000Z";
//var newApp = OktaAPI.Helpers.constructAppModel("testId", "testName", "testLabel", );

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


okta.addApplication(newApp, function(d) {
    checking("addApp");
    d.should.have.property("success", true);
    d.should.have.property("resp").with.property("id");
    ok();
});



