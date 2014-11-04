/*
 *  Created by kevin.he on 11/4/2014
 *
 *  Contains the helper functions that were originally in 
 *  OktaHelper, now is here for better organization
 *
 */
 
exports.constructAppModel = constructAppModel;
exports.constructAppUserModel = constructAppUserModel;
exports.constructAppGroupModel = constructAppGroupModel;



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

