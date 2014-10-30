/**
 * Created by jjohnson on 12/10/13.
 */

exports.constructProfile = constructProfile;
exports.constructPassword = constructPassword;
exports.constructRecoveryQuestion = constructRecoveryQuestion;
exports.constructCredentials = constructCredentials;
exports.constructGroup = constructGroup;
exports.constructAppModel = constructAppModel;

/**
 * Creates an object that reflects the structure of an Okta User Object
 * @method constructProfile
 * @param firstName
 * @param lastName
 * @param email
 * @param login optional
 * @param mobilePhone optional
 * @param customAttribs a map of property -> propertyValue for custom attributes on a user
 * @returns {{}}
 */
function constructProfile(firstName, lastName, email, login, mobilePhone, customAttribs) {
    var profile = {};
    profile.login = (login ? login : email);
    profile.email = email;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.mobilePhone = mobilePhone;
    if(customAttribs != undefined) {
        for(prop in customAttribs) {
            profile[prop] = customAttribs[prop];
        }
    }
    return profile;
}
/**
 * Creates an object that reflects the structure of an Okta Password Object
 * @method constructPassword
 * @param password
 * @returns {{value: *}}
 */
function constructPassword(password) {
    var newPassword = {value: password};
    return newPassword;
}
/**
 * Constructs an object that reflects the structure of an Okta Recovery Question Object
 * @method constructRecoveryQuestion
 * @param question
 * @param answer
 * @returns {{question: *, answer: *}}
 */
function constructRecoveryQuestion(question, answer) {
    var newQuestion = {question: question, answer: answer};
    return newQuestion;
}
/**
 * Constructs an object that reflects the structure of an Okta Credentials Object
 * @method constructCredentials
 * @param password
 * @param question
 * @param answer
 * @returns {{}}
 */
function constructCredentials(password, question, answer) {
    var credentials = {};
    credentials.password = constructPassword(password);
    if(question || answer)
        credentials.recovery_question = constructRecoveryQuestion(question, answer);
    return credentials;
}
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
/**
 * Constructs an object that reflects the structure of an App Model
 * @method constructAppModel
 * @param id            unique key for app
 * @param name          unique key for app definition
 * @param label         unique user-defined display name for app
 * @param created       timestamp when app was created
 * @param lastUpdated   timestamp when app was last updated
 * @param status        status of app
 * @param features      enabled app features
 * @param signOnMode    authentication mode of app
 * @param accessibility access settings for app
 * @param visibility    visibility settings for app
 * @param credentials   credentials for the specified signOnMode
 * @param settings      settings for app    
 * @param _links        discoverable resources related to the app   
 * @param _embedded     embedded resources related to the app   
 * @returns {}          the appModel object
 */
function constructAppModel(id, name, label, created, lastUpdated, status, 
                            features, signOnMode, accessibility, visibility, 
                            credentials, settings, _links, _embedded) {
    var model = {};
    model.id = id;
    model.name = name;
    model.label = label;
    model.created = created;
    model.lastUpdated = lastUpdated;
    model.status = status;
    model.features = features;
    model.signOnMode = signOnMode;
    model.accessibility = accessibility;
    model.visibility = visibility;
    model.credentials = credentials;
    model.settings = settings;
    model._links = _links;
    model._embedded = _embedded;

    return model;
}




