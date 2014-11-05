/*
 *  Created by kevin.he on 11/4/2014
 *
 *  Contains the helper functions that were originally in 
 *  OktaHelper, now is here for better organization
 *
 */
 
exports.constructGroup = constructGroup;


/**
 * Constructs an object that reflects the structure of an Okta Group Object
 * @method constructGroup
 * @param name
 * @param description
 * @returns {{}}
 */
function constructGroup(name, description) {
    var profile = {};
    profile.name = name;
    profile.description = description;
    return profile;
}