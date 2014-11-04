/**
 * Created by jjohnson on 12/10/13.
 */
var OktaAPIUsersHelpers = require('./OktaAPIUsersHelpers.js');
var OktaAPIUsersGroups = require('./OktaAPIGroupsHelpers.js');

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
    return OktaAPIUsersHelpers.constructProfile(firstName, lastName, email, login, mobilePhone, customAttribs);
}
/**
 * Creates an object that reflects the structure of an Okta Password Object
 * @method constructPassword
 * @param password
 * @returns {{value: *}}
 */
function constructPassword(password) {
    return OktaAPIUsersHelpers.constructPassword(password);
}
/**
 * Constructs an object that reflects the structure of an Okta Recovery Question Object
 * @method constructRecoveryQuestion
 * @param question
 * @param answer
 * @returns {{question: *, answer: *}}
 */
function constructRecoveryQuestion(question, answer) {
    return OktaAPIUsersHelpers.constructRecoveryQuestion(question, answer);
}
/**
 * Constructs an object that reflects the structure of an Okta Credentials Object
 * If you don't want to set a pw or recovery question just pass in null or empty string
 * @method constructCredentials
 * @param password
 * @param question
 * @param answer
 * @returns {{}}
 */
function constructCredentials(password, question, answer) {
    return OktaAPIUsersHelpers.constructCredentials(password, question, answer);
}
/**
 * Constructs an object that reflects the structure of an Okta Group Object
 * @method constructGroup
 * @param name
 * @param description
 * @returns {{}}
 */
function constructGroup(name, description) {
    return OktaAPIUsersGroups.constructGroup(name, description);
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
 * @param links         discoverable resources related to the app   
 * @param embedded      embedded resources related to the app   
 * @returns {}          the appModel object
 */
function constructAppModel(id, name, label, created, lastUpdated, status, 
                            features, signOnMode, accessibility, visibility, 
                            credentials, settings, links, embedded) {
    var model = {};
    if(id) model.id = id;
    if(name) model.name = name;
    if(label) model.label = label;
    if(created) model.created = created;
    if(lastUpdated) model.lastUpdated = lastUpdated;
    if(status) model.status = status;
    if(features) model.features = features;
    if(signOnMode) model.signOnMode = signOnMode;
    if(accessibility) model.accessibility = accessibility;
    if(visibility) model.visibility = visibility;
    if(credentials) model.credentials = credentials;
    if(settings) model.settings = settings;
    if(links) model.links = links;
    if(embedded) model.embedded = embedded;

    return model;
}
/**
 * Constructs an object that reflects the structure of an App User Model
 * @method constructAppUserModel
 * @param id                unique key for User
 * @param externalId        id of user in target app
 * @param created           timestamp when app user was created
 * @param lastUpdated       timestamp when app user was last updated
 * @param scope             toggles the assignment between user or group scope
 * @param status            status of app user
 * @param statusChanged     timestamp when status was last changed
 * @param passwordChanged   timestamp when app password last changed
 * @param syncState         synchronization state for app user
 * @param lastSync          timestamp when last sync operation was executed
 * @param credentials       credentials for assigned app
 * @param profile           app-specific profile for the user
 * @param links             discoverable resources related to the app user
 * @returns {}              the AppUserModel object
 */
function constructAppUserModel(id, externalId, created, lastUpdated, scope, status, 
                            statusChanged, passwordChanged, syncState, lastSync, 
                            credentials, lastSync, links) {
    var model = {};
    if(id) model.id = id;
    if(externalId) model.externalId = externalId;
    if(created) model.created = created;
    if(lastUpdated) model.lastUpdated = lastUpdated;
    if(scope) model.scope = scope;
    if(status) model.status = status;
    if(statusChanged) model.statusChanged = statusChanged;
    if(passwordChanged) model.passwordChanged = passwordChanged;
    if(syncState) model.syncState = syncState;
    if(lastSync) model.lastSync = lastSync;
    if(credentials) model.credentials = credentials;
    if(lastSync) model.lastSync = lastSync;
    if(links) model.links = links;

    return model;
}
/**
 * Constructs an object that reflects the structure of an App Group Model
 * @method constructAppGroupModel
 * @param id                unique key of group
 * @param lastUpdated       timestamp when app group was last updated
 * @param priority          toggles the assignment between user or group scope
 * @param links             discoverable resources related to the app group
 * @returns {}              the AppGroupModel object
 */
function constructAppGroupModel(id, lastUpdated, priority, links) {
    var model = {};
    if(id) model.id = id;
    if(lastUpdated) model.lastUpdated = lastUpdated;
    if(priority) model.priority = priority;
    if(links) model.links = links;

    return model;
}





