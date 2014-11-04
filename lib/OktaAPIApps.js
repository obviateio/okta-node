/*
 *  Created by kevin.he on 11/4/2014
 *
 *  Contains the Application functions that were originally in 
 *  OktaAPI, now is here for better organization
 *
 */

/*
 * Okta Applications Documentation
 * http://developer.okta.com/docs/api/rest/apps.html
 */


var NetworkAbstraction = require('./NetworkAbstraction.js');
var check = require('check-types');

module.exports = OktaAPIApps;

/**
 * Instantiate a new Okta API Applications helper with the given API token
 * @param apiToken
 * @param domain
 * @param preview
 * @constructor
 */
function OktaAPIApps(apiToken, domain, preview)
{
    if(apiToken == undefined || domain == undefined) 
    {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    if(preview == undefined) this.preview = false;
    else this.preview = preview;
    this.request = new NetworkAbstraction(apiToken, domain, preview);
    this.helpers = require('./OktaAPIAppsHelpers.js');
}


/*******************************************************************
*************** Apps->Application Operations Start *****************
********************************************************************
*/

 /**
  * @method add
  * @param appModel an app model per Okta docs
  * @param callback
  */
OktaAPIApps.prototype.add = function(appModel, callback) 
{
    if(appModel == undefined) throw new Error("An application model is required when adding an application");
    this.request.post("apps", appModel, null, callback);
}


/**
 * @method get
 * @param id an application ID to get
 * @param callback
 */
OktaAPIApps.prototype.get = function(id, callback) 
{
    if(id == undefined) throw new Error("An application ID is required when getting an application");
    this.request.get("apps/" + id, null, callback);
}

OktaAPIApps.prototype.list = function(queryObj, callback) 
{
    this.request.get("apps", queryObj, callback);
}

OktaAPIApps.prototype.update = function(id, profile, callback) 
{
    if(id == undefined) throw new Error("An application ID is required when updating an application");
    if(profile == undefined) throw new Error("An application profile is required when updating an application");
    this.request.put("apps/" + id, profile, null, callback);
}

OktaAPIApps.prototype.delete = function(id, callback) 
{
    if(id == undefined) throw new Error("An application ID is required when deleting an application");
    this.request.delete("apps/" + id, null, callback);
}

/*******************************************************************
**************** Apps->Application Operations End ******************
********************************************************************
*/

/*******************************************************************
*********** Apps->Application Lifecycle Operations Start ***********
********************************************************************
*/

OktaAPIApps.prototype.activate = function(id, callback) 
{
    if(id == undefined) throw new Error("An application ID is required when activating an application");
    this.request.post("apps/" + id + "/lifecycle/activate", null, null, callback);
}

OktaAPIApps.prototype.deactivate = function(id, callback) 
{
    if(id == undefined) throw new Error("An application ID is required when deactivating an application");
    this.request.post("apps/" + id + "/lifecycle/deactivate", null, null, callback);
}

/*******************************************************************
************ Apps->Application Lifecycle Operations End ************
********************************************************************
*/

/*******************************************************************
************ Apps->Application User Operations Start ***************
********************************************************************
*/

OktaAPIApps.prototype.assignUser = function(appId, appUserModel, callback) 
{
    if(appId == undefined) throw new Error("An application Id is required when assigning a user to an application");
    if(appUserModel == undefined) throw new Error("An Application User is required when assigning a user to an application");
    this.request.post("apps/" + appId + "/users", appUserModel, null, callback);
}

OktaAPIApps.prototype.getAssignedUser = function(appId, uid, callback) 
{
    if(appId == undefined) throw new Error("An application Id is required when getting an assigned user for an application");
    if(uid == undefined) throw new Error("A user ID is required when getting an assigned user for an application");
    this.request.get("apps/" + appId + "/users/" + uid, null, callback);
}

OktaAPIApps.prototype.listUsersAssigned = function(id, callback) 
{
    if(id == undefined) throw new Error("An application ID is required when getting a list of users assigned to an application");
    this.request.get("apps/" + id + "/users", null, callback);
}

OktaAPIApps.prototype.updateAppCredsForUser = function(aid, uid, appUserModel, callback) 
{
    // TODO: abstract the appUserModel
    if(aid == undefined) throw new Error("An application ID is required when updating creds for an application");
    if(uid == undefined) throw new Error("A user ID is required when updating creds for an application");
    //throw new Error("Not yet implemented"); // this is intentional. Uncomment if you wish to use this call w/o abstracted user models
    this.request.post("apps/" + aid + "/users/" + uid, appUserModel, null, callback);
}

OktaAPIApps.prototype.updateAppProfileForUser = function(aid, uid, appUserModel, callback) 
{
    // TODO: abstract the appUserModel
    if(aid == undefined) throw new Error("An application ID is required when updating the profile for an application");
    if(uid == undefined) throw new Error("A user ID is required when updating the profile for an application");
    //throw new Error("Not yet implemented"); // this is intentional. Uncomment if you wish to use this call w/o abstracted user models
    this.request.post("apps/" + aid + "/users/" + uid, appUserModel, null, callback);
}

OktaAPIApps.prototype.removeUser = function(aid, uid, callback) 
{
    if(aid == undefined) throw new Error("An application ID is required when removing a user from an app");
    if(uid == undefined) throw new Error("A user ID is required when removing a user from an app");
    this.request.delete("apps/ " + aid + "/users/" + uid, null, callback);
}

/*******************************************************************
************* Apps->Application User Operations End ****************
********************************************************************
*/

/*******************************************************************
*********** Apps->Application Group Operations Start ***************
********************************************************************
*/

OktaAPIApps.prototype.assignGroup = function(aid, gid, appGroup, callback) {
    // TODO: there is an optional "appgroup" param. Figure out what it does and how to use it.
    if(aid == undefined) throw new Error("An application ID is required when assigning an application to a group");
    if(gid == undefined) throw new Error("A group ID is required when assigning an application to a group");
    //backwards compatability support
    if(check.fn(appGroup))
    {
    	callback = appGroup;
    	appGroup = {};
    }
    this.request.put("apps/" + aid + "/groups/" + gid, appGroup, null, callback);
}

OktaAPIApps.prototype.getAssignedGroup = function(aid, gid, callback) {
    if(aid == undefined) throw new Error("Application ID is required when getting a group assigned to an application");
    if(gid == undefined) throw new Error("A group ID is required when getting a group assigned to an application");
    this.request.get("apps/" + aid + "/groups/" + gid, null, callback);
}

OktaAPIApps.prototype.listGroups = function(aid, queryObj, callback) {
    if(aid == undefined) throw new Error("An application ID is required when getting the groups assigned to an application");
    this.request.get("apps/" + aid + "/groups", queryObj, callback);
}

OktaAPIApps.prototype.removeGroup = function(aid, gid, callback) 
{
    if(aid == undefined) throw new Error("An application ID is required when unassigning an application to a group");
    if(gid == undefined) throw new Error("A group ID is required when unassigning an application to a group");
    this.request.delete("apps/" + aid + "/groups/" + gid, null, null, callback);
}

/*******************************************************************
************ Apps->Application Group Operations End ****************
********************************************************************
*/


