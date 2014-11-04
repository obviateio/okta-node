
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