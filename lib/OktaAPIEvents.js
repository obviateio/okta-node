/*
 *  Created by kevin.he on 11/4/2014
 *
 *  Contains the Event functions that were originally in 
 *  OktaAPI, now is here for better organization
 *
 */


/*
 * Okta Events Endpoint
 * http://developer.okta.com/docs/api/rest/events.html
 */
var NetworkAbstraction = require('./NetworkAbstraction.js');

module.exports = OktaAPIEvents;

/**
 * Instantiate a new Okta API User helper with the given API token
 * @param apiToken
 * @param domain
 * @param preview
 * @constructor
 */
function OktaAPIEvents(apiToken, domain, preview)
{
    if(apiToken == undefined || domain == undefined) 
    {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    if(preview == undefined) this.preview = false;
    else this.preview = preview;
    this.request = new NetworkAbstraction(apiToken, domain, preview);
}

/*******************************************************************
***************** Events->Event Operations Start *******************
********************************************************************
*/

/**
 * @method list Fetch a list of events from your Okta organization system log
 * @param queryObj - used to search for events
 * @param followLink - boolean, set to true to tell network abstraction to follow all pagination links and return result all at once.
 * @param callback
 */
OktaAPIEvents.prototype.list = function(queryObj, followLink, callback) {
    this.request.get("events", queryObj, followLink, callback);
}


/*******************************************************************
***************** Events->Event Operations End *********************
********************************************************************
*/
