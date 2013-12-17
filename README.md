okta-node
=========

A small NodeJS framework for working with the [Okta](http://www.okta.com/) API

# Overview
This API is a small layer that handles talking to the Okta API. Primarily:
- Maps function calls to their correct Okta endpoints
- Formats the body and queries of arguments passed to the Okta endpoint
- Aids in creating or updating entities in the format the Okta endpoint expects

This document will refer to itself as "this API" and the Okta API as simply, "Okta".

# Usage
To get started, you MUST obtain an API key from Okta's Support Team.
You will also need to familiarize yourself with how Okta responds to programmatic requests. You can do so [here](https://github.com/okta/api/tree/master/docs/endpoints).
This API is for Okta API version 1.

```node
var OktaAPI = require('OktaAPI');
var okta = new OktaAPI("Your-Okta-API-Key", "your-domain");
```

If you're testing in the Okta Preview environment, add a bool to the end of the constructor
```node
var okta = new OktaAPI("Your-Okta-API-Key", "your-domain", true);
```

Note that all calls to the OktaAPI are returned in the following format:
```JSON
{
    success: true,
    paged: false,
    resp: {
        <json object from Okta API>
        }
}
```

Note that simply because the "success" property is true, doesn't mean your request was accepted by Okta.
- You should also check the resp property for an errorCode property - which is the error returned by Okta.
- Some actions will return HTTP Status 204 - No Content. These will not have a resp property.

Paginated requests are encouraged where available; this API will automatically detect and advance through all the data from a paginated request, calling the callback with each page.
Pagintated responses will be returned in the following format:
```JSON
{
    success: true,
    paged: true,
    pageEnd: false,
    resp: {
        <json object from OktaAPI>
    }
}
```

If something went wrong while attempting to make a request to Okta, this API will return an object in the following format:
```JSON
{
    success: false,
    error: "Reason why the call failed",
    resp: "Response from Okta"
}
```
This object MAY NOT include the "resp" property. Existence of it means one of the following:
1. You are not authorized to access Okta. resp will contain the response from Okta, indicating why you cannot access it.
2. Okta returned an invalid response to this API. resp will contain the response Okta gave for further troubleshooting.

# Response structure
Responses from Okta are left in the same format as it is received. The information on how Okta responds to requests can be found [here](https://github.com/okta/api/tree/master/docs/endpoints).

# Examples
Examples are good!

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
    }
});
doCoolThingsWith(newUser);
doMoreCoolThingsWith(newUser);
okta.activateUser(newUser.id, true, null);
```

# More Docs!
All public-facing methods are documented with a Doxygen-like syntax. You can run a tool like [YUIDoc](http://yui.github.io/yuidoc/) to generate your own set.

# Disclaimer & License
Please be aware that all material published under the [OktaIT](https://github.com/OktaIT/) project have been written by the [Okta](http://www.okta.com/) IT Department but are not NOT OFFICAL software release of Okta Inc.  As such, the software is provided "as is" without warranty or customer support of any kind.

This project is licensed under the MIT license, for more details please see the LICENSE file.


