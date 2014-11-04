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
var check = require('check-types');

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
 * @method list
 * @param filter
 * @param limit
 * @param startDate
 * @param callback
 */
OktaAPIEvents.prototype.list = function(queryObj, followLink, callback) {
    this.request.get("events", queryObj, followLink, callback);
}


/*******************************************************************
***************** Events->Event Operations End *********************
********************************************************************
*/
