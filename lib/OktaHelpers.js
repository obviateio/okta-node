/**
 * Created by jjohnson on 12/10/13.
 */

exports.constructProfile = constructProfile;
exports.constructPassword = constructPassword;
exports.constructRecoveryQuestion = constructRecoveryQuestion;
exports.constructCredentials = constructCredentials;
exports.constructGroup = constructGroup;

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
    var password = {value: password};
    return password;
}
/**
 * Constructs an object that reflects the structure of an Okta Recovery Question Object
 * @method constructRecoveryQuestion
 * @param question
 * @param answer
 * @returns {{question: *, answer: *}}
 */
function constructRecoveryQuestion(question, answer) {
    var question = {question: question, answer: answer};
    return question;
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