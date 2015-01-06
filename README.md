okta-node
=========

A small NodeJS framework for working with the [Okta](http://www.okta.com/) API

# *NOTE* We are on version 2 now, this update broke all previous versions. Sorry!

# Overview
This API is a small layer that handles talking to the Okta API. Primarily:
- Maps function calls to their correct Okta endpoints
- Formats the body and queries of arguments passed to the Okta endpoint
- Aids in creating or updating entities in the format the Okta endpoint expects

This document will refer to itself as "this API" and the Okta API as simply, "Okta".

# Usage
To get started, you MUST obtain an API key from your Okta's Support Team.
Or if you have access to the admin panel of your Okta. Follow [these](http://developer.okta.com/docs/getting_started/getting_a_token.html) instructions.

This API is for Okta API version 1.

```node
var OktaAPI = require('OktaAPI');
var okta = new OktaAPI("Your-Okta-API-Key", "your-domain");
```

If you're testing in the Okta Preview environment, add a bool to the end of the constructor
```node
var okta = new OktaAPI("Your-Okta-API-Key", "your-domain", true);
```

Note that 'your-domain' should only be __your Okta subdomain__ and should not include 'okta.com' as this will be appended automatically.

Note that all calls to the OktaAPI are returned in the following format:
```JSON
{
    "success": true,
    "paged": false,
    "resp": {
        "<json object from Okta API>"
        }
}
```

Note that simply because the "success" property is true, doesn't mean your request was accepted by Okta.
- You should also check the resp property for an errorCode property - which is the error returned by Okta.
- Some actions will return HTTP Status 204 - No Content. These will not have a resp property.

Paginated requests are encouraged where available; this API will automatically detect and give you the option to follow through all the data from a paginated request with the flag followLink, calling the callback with each page.
If followLink is set to true or ommitted, pagintated responses will automatically send all the paginated requests. The responses will be in the following format :
```JSON
{
    "success": true,
    "paged": true,
    "pageEnd": false,
    "resp": {
        "<json object from OktaAPI>"
    }
}
```
If followLink is set to false, the paginated response will have a field for the link that will request the next set of data:
```JSON
{
    "success": true,
    "paged": true,
    "pageEnd": false,
    "resp": {
        <json object from OktaAPI>
    },
    "next": "<link for next set of data>"
}
```


If something went wrong while attempting to make a request to Okta, this API will return an object in the following format:
```JSON
{
    "success": false,
    "error": "Reason why the call failed",
    "resp": "Response from Okta"
}
```
This object MAY NOT include the "resp" property. Existence of it means one of the following:
1. You are not authorized to access Okta. resp will contain the response from Okta, indicating why you cannot access it.
2. Okta returned an invalid response to this API. resp will contain the response Okta gave for further troubleshooting.

# Response structure
Responses from Okta are left in the same format as it is received. The information on how Okta responds to requests can be found [here](http://developer.okta.com/docs/getting_started/design_principles.html).

# Structure
The structure of this API is broken up into 5 parts each with it's own helper if applicable. Each part is in files in the lib/ directory and are named: 
- OktaAPIUsers.js
- OktaAPIGroups.js
- OktaAPISessions.js
- OktaAPIApps.js
- OktaAPIEvents.js

Here are the functions in each of the files:
```node
OktaAPIUsers.js:
    exampleOkta.users.list(search, followLink, callback) 
    exampleOkta.users.get(who, callback) 
    exampleOkta.users.add(profile, credentials, activate, callback)
    exampleOkta.users.update(id, profile, credentials, callback)
    exampleOkta.users.updatePartial(userId, partialProfile, partialCredentials, callback) 
    exampleOkta.users.getApps(id, callback) 
    exampleOkta.users.getGroups(id, callback) 
    exampleOkta.users.activate(id, sendEmail, callback)
    exampleOkta.users.deactivate(id, callback) 
    exampleOkta.users.unlock(id, callback)
    exampleOkta.users.resetPassword(id, sendEmail, callback)
    exampleOkta.users.expirePassword(id, tempPassword, callback)
    exampleOkta.users.resetFactors(id, callback)
    exampleOkta.users.forgotPasswordToken(id, sendEmail, callback)
    exampleOkta.users.forgotPasswordRecovery(id, passwordObj, recoveryQuestionObj, callback)
    exampleOkta.users.changePassword(id, oldPasswordObj, newPasswordObj, callback)
    exampleOkta.users.changeRecoveryQuestion(id, passwordObj, recoveryQuestionObj, callback)

OktaAPIGroups.js:
    exampleOkta.groups.add(groupProfile, callback)
    exampleOkta.groups.get(groupId, callback)
    exampleOkta.groups.list(search, followLink, callback)
    exampleOkta.groups.update(groupId, groupObj, callback)
    exampleOkta.groups.delete(groupId, callback)
    exampleOkta.groups.getUsers(groupId, queryObj, followLink, callback)
    exampleOkta.groups.addUser(groupId, userId, callback)
    exampleOkta.groups.removeUser(groupId, userId, callback)
    exampleOkta.groups.getApps(groupId, search, followLink, callback)
    
OktaAPISessions.js:
    exampleOkta.sessions.create(user, pass, additionalFields, callback)
    exampleOkta.sessions.validate(sessionId, callback)
    exampleOkta.sessions.extend(sessionId, callback) 
    exampleOkta.sessions.close(sessionId, callback)

OktaAPIApps.js:
    exampleOkta.apps.add(appModel, callback)
    exampleOkta.apps.get(id, callback) 
    exampleOkta.apps.list(queryObj, callback) 
    exampleOkta.apps.update(id, profile, callback) 
    exampleOkta.apps.delete(id, callback) 
    exampleOkta.apps.activate(id, callback) 
    exampleOkta.apps.deactivate(id, callback) 
    exampleOkta.apps.assignUser(appId, appUserModel, callback) 
    exampleOkta.apps.getAssignedUser(appId, uid, callback) 
    exampleOkta.apps.listUsersAssigned(id, callback)
    exampleOkta.apps.updateAppCredsForUser(aid, uid, appUserModel, callback) 
    exampleOkta.apps.updateAppProfileForUser(aid, uid, appUserModel, callback) 
    exampleOkta.apps.removeUser(aid, uid, callback) 
    exampleOkta.apps.assignGroup(aid, gid, appGroup, callback)
    exampleOkta.apps.getAssignedGroup(aid, gid, callback)
    exampleOkta.apps.listGroupsAssigned(aid, queryObj, callback)
    exampleOkta.apps.removeGroup(aid, gid, callback)

OktaAPIEvents.js:
    exampleOkta.events.list(queryObj, followLink, callback)

```
*NOTE* The parameters queryObj or search must be in the format: {q: <query>, limit: <int>, filter: <filter>, after: <cursor>}. Attributes may be missing, but it must be passed an object.

There are also helper functions in the OktaAPI<Apps/Users/etc.>Helpers.js files. The examples will demonstrate how to use them. 

# Examples
Examples are good!
There are also examples in the tests/ directory that demonstrate how to call the functions in these files. 

Provision and activate user:
```node
// Create a profile object that Okta can recognize
var newProfile = OktaAPI.Helpers.constructProfile("Timothy", "McGee", "tmcgee@ncis.gov");
// Create a credentials object
var newCreds = OktaAPI.Helpers.constructCredentials("superPass1", "What is my favorite book?" , "Deep Six");
// Send the request off to Okta
var newUser;
okta.addUser(newProfile, newCreds, false, function(data) {
    if(!data.success) {
        console.log("Something went wrong: " + data.error);
        return;
    } else {
        console.log("Successfully provisioned new user!");
        newUser = data.resp;
        doThings();
    }
});
function doThings() {
    doCoolThingsWith(newUser);
    doMoreCoolThingsWith(newUser);
    okta.activateUser(newUser.id, true, null);
}
```

# More Docs!
All public-facing methods are documented with a Doxygen-like syntax. You can run a tool like [YUIDoc](http://yui.github.io/yuidoc/) to generate your own set.

# Disclaimer & License
Please be aware that all material published under the [OktaIT](https://github.com/OktaIT/) project have been written by the [Okta](http://www.okta.com/) IT Department but are NOT OFFICAL software release of Okta Inc.  As such, the software is provided "as is" without warranty or customer support of any kind.

This project is licensed under the MIT license, for more details please see the LICENSE file.


