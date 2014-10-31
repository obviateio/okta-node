/*
*	Tests the nodejs wrapper. Also can serve as examples to use the wrapper.
*	Only tests operaations done on events. Should call all the functions at 
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


function main()
{
	/*
	*	get all events for your org, can return alot of info, with a pagination flag
	*/
	okta.getEvents({"limit" : 5, 'followLink' : false},  function(d) {
	    checking("getEvents");
	    d.should.have.property("success", true);
	    console.log(require('util').inspect(d));
	    ok();

	});

	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.getEvents({"limit" : 5, 'followLink' : true},  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });


	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.getEvents({"limit" : 5},  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });

	/*
	*	get all events for your org, can return alot of info
	*/
	// okta.getEvents(null,  function(d) {
	//     checking("getEvents");
	//     d.should.have.property("success", true);
	//     console.log(require('util').inspect(d));
	//     ok();

	// });

}



main();

