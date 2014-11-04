/*
 *  Created by kevin.he on 11/4/2014
 *
 *  Contains the User functions that were originally in 
 *  OktaAPI, now is here for better organization
 *
 */

/*
 * Okta User Documentation
 * http://developer.okta.com/docs/api/rest/users.html
 */
var NetworkAbstraction = require('./NetworkAbstraction.js');
var check = require('check-types');

module.exports = OktaAPIUsers;

/**
 * Instantiate a new Okta API User helper with the given API token
 * @param apiToken
 * @param domain
 * @param preview
 * @constructor
 */
function OktaAPIUsers(apiToken, domain, preview)
{
    if(apiToken == undefined || domain == undefined) 
    {
        throw new Error("OktaAPI requires an API token and a domain");
    }
    this.domain = domain;
    if(preview == undefined) this.preview = false;
    else this.preview = preview;
    this.request = new NetworkAbstraction(apiToken, domain, preview);
    this.helpers = require('./OktaAPIUsersHelpers.js');
}



/*******************************************************************
************************ Users->UserOps Start **********************
********************************************************************
*/

OktaAPIUsers.prototype.list = function(search, followLink, callback)
{
    this.request.get("users", search, followLink, callback);
}

OktaAPIUsers.prototype.get = function(who, callback)
{
    if(who == undefined) throw new Error("A search query is required when trying to get a user from Okta");
    this.request.get("users/" + who, null, callback);
}

OktaAPIUsers.prototype.add = function(profile, credentials, activate, callback)
{
    if(profile == undefined) throw new Error("Profile is required when adding a user to Okta");
    var body = {profile: profile};
    if(credentials) body.credentials = credentials;
    var qs = {activate: activate};
    this.request.post("users", body, qs, callback);
}

OktaAPIUsers.prototype.update = function(id, profile, credentials, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when updating a user in Okta");
    var body = {};
    if(credentials) body.credentials = credentials;
    if(profile) body.profile = profile;
    this.request.put("users/" + id, body, null, callback);
}

OktaAPIUsers.prototype.updatePartial = function(userId, partialProfile, partialCredentials, callback) 
{
    if(userId == undefined) throw new Error("A user ID is required");
    var that = this;
    this.get(userId, function(d) {
        if(!d.success || d.resp.errorCode) {
            callback({success: false, error: "Failed to retrieve user", resp: d.resp});
            return;
        }
        mergeProfiles(that, d.resp, partialProfile, partialCredentials, callback);
    });
}

/*******************************************************************
************************ Users->UserOps End ************************
********************************************************************
*/


/*******************************************************************
****************** Users->Related Resources Start ******************
********************************************************************
*/

OktaAPIUsers.prototype.getApps = function(id, callback) {
    if(id == undefined) throw new Error("A user ID is required when requesting app links from Okta");
    this.request.get("users/" + id + "/appLinks", null, callback);
}

OktaAPIUsers.prototype.getGroups = function(id, callback) {
    if(id == undefined) throw new Error("A user ID is required when requesting a user's groups");
    this.request.get("users/" + id + "/groups", null, callback);
}

/*******************************************************************
****************** Users->Related Resources End ********************
********************************************************************
*/

/*******************************************************************
**************** Users->Lifecycle Operations Start *****************
********************************************************************
*/

OktaAPIUsers.prototype.activate = function(id, sendEmail, callback) {
    if(id == undefined) throw new Error("A user ID is required when activating a user");
    if(sendEmail == undefined) throw new Error();
    var queryObj = {sendEmail: sendEmail};
    this.request.post("users/" + id + "/lifecycle/activate", null, queryObj, callback);
}

OktaAPIUsers.prototype.deactivate = function(id, callback) {
    if(id == undefined) throw new Error("A user ID is required when deactivating a user");
    this.request.post("users/" + id + "/lifecycle/deactivate", null, null, callback);
}

OktaAPIUsers.prototype.unlock = function(id, callback) {
    if(id == undefined) throw new Error("A user ID is required when unlocking a user");
    this.request.post("/users/" + id + "/lifecycle/unlock", null, null, callback);
}

OktaAPIUsers.prototype.resetPassword = function(id, sendEmail, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when resetting a users password");
    if(sendEmail == undefined) throw new Error();
    var queryObj = {sendEmail: sendEmail};
    this.request.post("users/" + id + "/lifecycle/reset_password", null, queryObj, callback);
}

OktaAPIUsers.prototype.expirePassword = function(id, tempPassword, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when expiring a users password");
    var queryObj;
    if(tempPassword == undefined) 
    {
        queryObj = null;
    }
    else
    {
        queryObj = {tempPassword : tempPassword};
    }
    this.request.post("users/" + id + "/lifecycle/expire_password", null, queryObj, callback);
}

OktaAPIUsers.prototype.resetFactors = function(id, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when resetting all of a user's MFA factors");
    this.request.post("users/" + id + "/lifecycle/reset_factors", null, null, callback);
}

/*******************************************************************
**************** Users->Lifecycle Operations End *******************
********************************************************************
*/

/*******************************************************************
*************** Users->Credential Operations Start *****************
********************************************************************
*/

OktaAPIUsers.prototype.forgotPasswordToken = function(id, sendEmail, callback)
{
    if(id == undefined) throw new Error("A user ID is required when triggering a forgotten password flow");
    if(sendEmail == undefined) throw new Error();
    var queryObj = {sendEmail: sendEmail};
    this.request.post("users/" + id + "/lifecycle/forgot_password", null, queryObj, callback);
}

OktaAPIUsers.prototype.forgotPasswordRecovery = function(id, passwordObj, recoveryQuestionObj, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when resetting a users password");
    if(passwordObj == undefined) throw new Error("A new password is required to reset a users password");
    if(recoveryQuestionObj == undefined) throw new Error("A security answer is required while resetting a users password");
    var body = {};
    body.password = passwordObj;
    body.recovery_question = recoveryQuestionObj;
    this.request.post("users/" + id + "/credentials/forgot_password", body, null, callback);
}

OktaAPIUsers.prototype.changePassword = function(id, oldPasswordObj, newPasswordObj, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when changing a users password");
    if(oldPasswordObj == undefined) throw new Error("A current password object is required when resetting a users password");
    if(newPasswordObj == undefined) throw new Error("A new password object is required when changing a users password");
    var body = {};
    body.oldPassword = oldPasswordObj;
    body.newPassword = newPasswordObj;
    this.request.post("users/" + id + "/credentials/change_password", body, null, callback);
}

OktaAPIUsers.prototype.changeRecoveryQuestion = function(id, passwordObj, recoveryQuestionObj, callback) 
{
    if(id == undefined) throw new Error("A user ID is required when changing a users recovery questions");
    if(passwordObj == undefined) throw new Error("A current password object is required when changing a users recovery question");
    if(recoveryQuestionObj == undefined) throw new Error("A recovery question object is required when changing a users recovery question");
    var body = {};
    body.password = passwordObj;
    body.recovery_question = recoveryQuestionObj;
    this.request.post("users/" + id + "/credentials/change_recovery_question", body, null, callback);
}
  
/*******************************************************************
*************** Users->Credential Operations End *******************
********************************************************************
*/


/*
 * Private methods
 */
function mergeProfiles(what, userObj, updateProf, updateCreds, callback) {
    var finalProfile, finalCreds;
    if(updateProf != undefined) {
        finalProfile = {};
        for(prop in userObj.profile) finalProfile[prop] = userObj.profile[prop];
        for(prop in updateProf) finalProfile[prop] = updateProf[prop];
    }
    if(updateCreds != undefined) {
        finalCreds = {};
        for(prop in userObj.credentials) finalCreds[prop] = userObj.profile[prop];
        for(prop in updateCreds) finalCreds[prop] = updateCreds[prop];
    }
    what.update(userObj.id, finalProfile, finalCreds, function(d) {
        if(!d.success || d.resp.errorCode) {
            callback({success: false, error: "Failed to update user info", resp: d.resp});
            return;
        }
        callback({success: true, resp: d.resp});
    })
}

