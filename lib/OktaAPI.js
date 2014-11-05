/**
 * Created by jjohnson on 12/9/13.
 * Updated by kevin.he on 10/29/2014, categories are correct as of this date
 *
 *  Originally contained all the functions for all the possible operations
 *  on the Okta API
 *
 *  Now just calls functions from other files to keep backwards capatability
 *  Functions were split up into those files to have better organization
 * 
 */
var NetworkAbstraction = require('./NetworkAbstraction.js');
var OktaAPIUsers = require('./OktaAPIUsers.js');
var OktaAPIGroups = require('./OktaAPIGroups.js');
var OktaAPISessions = require('./OktaAPISessions.js');
var OktaAPIApps = require('./OktaAPIApps.js');
var OktaAPIEvents = require('./OktaAPIEvents.js');

module.exports = OktaAPI;
OktaAPI.Helpers = require('./OktaHelpers.js');
/**
 * Instantiate a new Okta API session with the given API token
 * @param apiToken
 * @param domain
 * @param preview
 * @constructor
 */
function OktaAPI(apiToken, domain, preview) {
    if(apiToken == undefined || domain == undefined) {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    if(preview == undefined) this.preview = false;
    else this.preview = preview;
    this.request = new NetworkAbstraction(apiToken, domain, preview);
    this.users = new OktaAPIUsers(apiToken, domain, preview);
    this.groups = new OktaAPIGroups(apiToken, domain, preview);
    this.sessions = new OktaAPISessions(apiToken, domain, preview);
    this.apps = new OktaAPIApps(apiToken, domain, preview);
    this.events = new OktaAPIEvents(apiToken, domain, preview);
}