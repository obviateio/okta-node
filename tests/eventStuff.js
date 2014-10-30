


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


function main()
{
	okta.getEvents({"startDate" : "2014-10-30T00:00:00.000Z", "limit" : 5}, function(d) {
	    checking("getEvents");
	    d.should.have.property("success", true);
	    console.log(d.resp);
	    ok();

	});
}



main();

