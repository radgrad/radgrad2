import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { RadGradProperties } from '../radgrad/RadGradProperties';
import { ROLE } from '../role/Role';
import { AdminProfiles } from './AdminProfileCollection';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { StudentProfiles } from './StudentProfileCollection';
import { FacultyProfiles } from './FacultyProfileCollection';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';

/**
 * Represents a user, which is someone who has a Meteor account.
 *
 * Users are defined when the various Profile collections are initialized, so the User collection is the union
 * of Students, Faculty and Advisors, plus the single Admin account who also has a Meteor account.
 *
 * Note that this collection does not extend any of our Base collections, because it has a very limited API
 * which should be used by clients to access the various Profile collections.
 *
 * It is not saved out or restored when the DB is dumped. It is not listed in RadGrad.collections.
 *
 * Clients provide a "user" as a parameter, which is either the username (i.e. email) or userID.
 * @memberOf api/user
 */
class UserCollection {
  private readonly collectionName: string;

  constructor() {
    this.collectionName = 'UserCollection';
  }

  private generateAdminCredential() {
    if (Meteor.isTest || Meteor.isAppTest || Meteor.settings.public.development) {
      return 'foo';
    }
    // adapted from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let credential = '';
    const maxPasswordLength = 30;
    const minPasswordLength = 6;
    const passwordLength = Math.floor(Math.random() * (maxPasswordLength - (minPasswordLength + 1))) + minPasswordLength;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < passwordLength; i++) {
      credential += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return credential;
  }

  /**
   * Define a new user, which means creating an entry in Meteor.Accounts.
   * This is called in the various Profile define() methods.
   * @param username The username to be defined (must be an email address).
   * @param role The role.
   * @returns { String } The docID of the newly created user.
   * @throws { Meteor.Error } If the user exists.
   */
  public define({ username, role }: { username: string; role: string; }) {
    // console.log('Users.define', username, role);
    if (Meteor.isServer) {
      Roles.createRole(role, { unlessExists: true });
      // In test Meteor.settings is not set from settings.development.json so we use _.get to see if it is set.
      if (_.get(Meteor, 'settings.public.development', false)) {
        const credential = this.generateAdminCredential();
        const userID = Accounts.createUser({ username: username, email: username, password: credential });
        Roles.addUsersToRoles(userID, [role]);
        console.log(`Defining ${role} ${username} with password ${credential}`);
        return userID;
      }
      if ((role === ROLE.STUDENT) || (role === ROLE.FACULTY) || (role === ROLE.ADVISOR || (role === ROLE.ALUMNI))) {
        // Define this user with a CAS login.
        const userWithoutHost = username.split('@')[0];
        const result = { id: userWithoutHost };
        const options = { profile: { name: userWithoutHost } };
        const casReturn: { userId: string; } = Accounts.updateOrCreateUserFromExternalService('cas', result, options);
        const userID2 = casReturn.userId;
        Meteor.users.update(userID2, { $set: { username } });
        // console.log('defined user', Meteor.users.findOne({ _id: userID2 }));
        Roles.addUsersToRoles(userID2, [role]);
        return userID2;
      }
      if (role === ROLE.ADMIN) {
        const credential = this.generateAdminCredential();
        const userID = Accounts.createUser({ username: username, email: username, password: credential });
        Roles.addUsersToRoles(userID, ROLE.ADMIN);
        console.log(`Defining admin ${username} with password ${credential}`);
        return userID;
      }
      // Otherwise define this user with a Meteor login and randomly generated password.
      const password = this.generateRandomPassword();
      console.log(`Defining ${role} ${username} with password ${password}`);
      const userID = Accounts.createUser({ username, email: username, password });
      Roles.addUsersToRoles(userID, [role]);
      return userID;
    }
    return undefined;
  }

  /**
   * Generate a random password.
   * Adapted from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
   * @returns {string} The password.
   * @private
   */
  private generateRandomPassword() {
    let password = '';
    const maxLength = 10;
    const minLength = 6;
    const passwordLength = Math.floor(Math.random() * (maxLength - (minLength + 1))) + minLength;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < passwordLength; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return password;
  }

  /**
   * Asserts that the passed user has the specified role.
   * @param user The user (username or userID).
   * @param role The role or an array of roles.
   * @throws { Meteor.Error } If the user does not have the role, or if user or role is not valid.
   */
  public assertInRole(user, role) {
    // console.log('assertInRole(%o, %o)', user, role);
    const userID = this.getID(user);
    const profile = this.getProfile(userID);
    if (Array.isArray(role)) {
      if (!(role.includes(profile.role))) {
        throw new Meteor.Error(`${userID} (${this.getProfile(userID).username}) is not in role ${role}.`);
      }
    } else if (profile.role !== role) {
      throw new Meteor.Error(`${userID} (${this.getProfile(userID).username}) is not in role ${role}.`);
    }
  }

  /**
   * Returns true if user is a defined userID or username.
   * @param user The user.
   * @returns { boolean } True if user is defined, false otherwise.
   */
  public isDefined(user) {
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }));
    return userDoc;
  }

  /**
   * Returns the userID associated with user, or throws an error if not defined.
   * @param user The user (username or userID).
   * @returns { String } The userID
   * @throws { Meteor.Error } If user is not a defined username or userID.
   */
  public getID(user) {
    // console.log('Users.getID', user);
    const userWithoutHost = user.split('@')[0];
    const userDoc = (Meteor.users.findOne({ _id: user })) || (Meteor.users.findOne({ username: user }) || (Meteor.users.findOne({ username: userWithoutHost })));
    if (!userDoc) {
      console.error('Error: user is not defined: ', user);
    }
    return userDoc._id;
  }

  /**
   * Returns the userIDs associated with users, or throws an error if any cannot be found.
   * @param { String[] } users An array of valid users.
   * @returns { String[] } The docIDs associated with users.
   * @throws { Meteor.Error } If any instance is not a user.
   */
  public getIDs(users) {
    let ids;
    try {
      ids = (users) ? users.map((instance) => this.getID(instance)) : [];
    } catch (err) {
      throw new Meteor.Error(`Error in getIDs(): Failed to convert one of ${users} to an ID.`);
    }
    return ids;
  }

  /**
   * Returns the full name for the given user.
   * @param user the user (username or ID).
   * @returns {string} The user's full name.
   * @throws {Meteor.Error} If user is not a valid user.
   */
  public getFullName(user) {
    const profile = this.getProfile(user);
    return `${profile.firstName} ${profile.lastName}`;
  }

  public getUsernameFromFullName(fullName) {
    const profiles = StudentProfiles.find().fetch().concat(FacultyProfiles.find().fetch().concat(AdvisorProfiles.find().fetch()));
    const match = profiles.filter((p) => fullName === this.getFullName(p.userID));
    if (match.length > 0) {
      return match[0].username;
    }
    return '';
  }

  /**
   * Returns true if user is referenced by other "public" entities. Specifically:
   *   * The user is a faculty member as has sponsored an opportunity.
   * Used to determine if this user can be deleted.
   * Note this doesn't test for references to CourseInstances, etc. These are "private" and will be deleted
   * implicitly if this user is deleted.
   * @param user The username or userID.
   * @returns {boolean} True if this user is referenced "publicly" elsewhere.
   * @throws { Meteor.Error } If the username is not defined.
   */
  public isReferenced(user) {
    const userID = this.getID(user);
    const hasOpportunities = Opportunities.findNonRetired({ sponsorID: userID }).length > 0;
    return (hasOpportunities);
  }

  /**
   * Returns the profile document associated with user, or null if not found.
   * Assumes that the user is defined. If not, throws an error.
   * @param user The username or userID.
   * @returns { Object | Null } The profile document or null if not found.
   */
  public hasProfile(user) {
    const userID = this.getID(user);
    return StudentProfiles.hasProfile(userID) || FacultyProfiles.hasProfile(userID)
      || AdvisorProfiles.hasProfile(userID) || AdminProfiles.hasProfile(userID);
  }

  public getProfileCollection(user) {
    const userID = this.getID(user);
    if (StudentProfiles.hasProfile(userID)) {
      return StudentProfiles;
    }
    if (FacultyProfiles.hasProfile(userID)) {
      return FacultyProfiles;
    }
    if (AdvisorProfiles.hasProfile(userID)) {
      return AdvisorProfiles;
    }
    if (AdminProfiles.hasProfile(userID)) {
      return AdminProfiles;
    }
    throw new Meteor.Error('unknown user', `${user} (${userID}) has no profile in getProfileCollection`);
  }

  /**
   * Returns the profile associated with the passed username, or null if not found.
   * Does not check to see if the user is defined, which makes this method useful for Accounts.validateNewUser.
   * @param username A username.
   * @returns The profile document, or null if not found.
   */
  public findProfileFromUsername(username) {
    return StudentProfiles.findByUsername(username) || FacultyProfiles.findByUsername(username)
      || AdvisorProfiles.findByUsername(username);
  }

  public count() {
    return StudentProfiles.count() + FacultyProfiles.count() + AdvisorProfiles.count();
  }

  /**
   * Returns the admin username from the settings file, or 'radgrad@hawaii.edu' (for testing purposes).
   * @returns {string} The admin username.
   * @private
   */
  private adminUsername() {
    return RadGradProperties.getAdminEmail();
  }

  /**
   * Returns the admin userID.
   * @private
   */
  private getAdminID() {
    const username = this.adminUsername();
    let adminDoc = Meteor.users.findOne({ username });
    // The admin is user is not created by the startup code during unit testing.
    // This is kind of a hack to implicitly define the admin user during unit tests.
    if (!adminDoc && Meteor.isServer && Meteor.isTest) {
      const userID = Accounts.createUser({ username, email: username, password: 'foo' });
      Roles.createRole(ROLE.ADMIN, { unlessExists: true });
      Roles.addUsersToRoles(userID, ROLE.ADMIN);
      adminDoc = Meteor.users.findOne({ username });
    }
    return adminDoc._id;
  }

  /**
   * There is only one admin and there is no collection for them. (This might be a mistake).
   * Anyway, this function returns an object that serves as their profile.
   * @returns The admin profile.
   * @private
   */
  private getAdminProfile() {
    const adminUsername = this.adminUsername();
    const adminID = Meteor.users.findOne({ username: adminUsername })._id;
    return { username: adminUsername, firstName: 'RadGrad', lastName: 'Admin', role: ROLE.ADMIN, userID: adminID };
  }

  /**
   * Returns the profile document associated with user.
   * @param user The username or userID.
   * @returns { Object } The profile document.
   * @throws { Meteor.Error } If the document was not found.
   */
  public getProfile(user) {
    // First, let's check to see if user is actually a profile (or looks like one). If so, just return it.
    if (_.isObject(user) && _.has(user, 'firstName') && _.has(user, 'lastName') && _.has(user, 'role')) {
      return user;
    }
    const profile = this.hasProfile(user);
    if (!profile) {
      console.error(`No profile found for user ${user}`);
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return profile;
  }

  /**
   * DO NOT USE.
   * @throws { Meteor.Error } Should not be used. Should remove the profile for the user.
   */
  public removeIt(user) {
    const userID = this.getID(user);
    if (!this.isReferenced(userID)) {
      Meteor.users.remove(userID);
    } else {
      throw new Meteor.Error(`Attempt to remove ${user} while references to public entities remain.`);
    }
  }

  /**
   * Removes all users except for the admin user.
   * This is implemented by mapping through all elements because mini-mongo does not implement the remove operation.
   * So this approach can be used on both client and server side.
   * removeAll should only used for testing purposes, so it doesn't need to be efficient.
   */
  public removeAll() {
    const users = Meteor.users.find().fetch();
    users.forEach((i) => {
      if (!(this.adminUsername() === i.username)) {
        this.removeIt(i._id);
      }
    });
  }

  /**
   * Runs find on all the Profile collections, fetches the associated documents, and returns an array containing all
   * of the matches.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns { Array } An array of documents matching the selector and options.
   */
  public findProfiles(selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    let profiles = [];
    profiles = profiles.concat(StudentProfiles.findNonRetired(theSelector, options));
    profiles = profiles.concat(AdvisorProfiles.findNonRetired(theSelector, options));
    profiles = profiles.concat(FacultyProfiles.findNonRetired(theSelector, options));
    return profiles;
  }

  /**
   * Runs find on all the Profile collections, fetches the associated documents, and returns an array containing all
   * of the matches.
   * @see {@link http://docs.meteor.com/#/full/find|Meteor Docs on Mongo Find}
   * @param { Object } selector A MongoDB selector.
   * @param { Object } options MongoDB options.
   * @returns { Array } An array of documents matching the selector and options.
   */
  public findProfilesWithRole(role, selector, options) {
    const theSelector = (typeof selector === 'undefined') ? {} : selector;
    if (role === ROLE.STUDENT) { // TODO why isn't this a switch?
      theSelector.isAlumni = false;
      return StudentProfiles.findNonRetired(theSelector, options);
    }
    if (role === ROLE.ALUMNI) {
      theSelector.isAlumni = true;
      return StudentProfiles.findNonRetired(theSelector, options);
    }
    if (role === ROLE.ADVISOR) {
      return AdvisorProfiles.findNonRetired(theSelector, options);
    }
    if (role === ROLE.FACULTY) {
      return FacultyProfiles.findNonRetired(theSelector, options);
    }
    if (role === ROLE.ADMIN) {
      return [this.getAdminProfile()];
    }
    console.log(`Unknown role: ${role}`);
    throw new Meteor.Error(`Unknown role: ${role}`);
  }

  /**
   * Iterates through all Profile collections, and returns an array of profiles that satisfy filter.
   * @param filter A function that accepts a profile a document and returns truthy if that document should be included
   * in the returned array.
   * @returns {Array} An array of profile documents from across all the Profile collections satisfying filter.
   */
  public filterProfiles(filter) {
    const profiles = [];
    StudentProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    AdvisorProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    FacultyProfiles.find().forEach((profile) => {
      if (filter(profile)) {
        profiles.push(profile);
      }
    });
    return profiles;
  }

  /**
   * Returns true if at least one profile satisfies the passed predicate.
   * @param predicate A function which can be applied to any document in any profile collection and returns true
   * or false.
   * @returns {boolean} True if at least one document satisfies the predicate.
   */
  public someProfiles(predicate) {
    let exists = false;
    StudentProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    AdvisorProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    FacultyProfiles.find().forEach((profile) => {
      if (predicate(profile)) {
        exists = true;
      }
    });
    if (exists) {
      return true;
    }
    return false;
  }

  // TODO shouldn't we have getCareerGoalIDs, getCourseIDs, getInternshipIDs, getOpportunityIDs?
  /**
   * Returns the user's interests as IDs. It is a union of interestIDs and careerGoal interestIDs.
   * @param user The username or userID.
   * @returns {Array} An array of interestIDs.
   */
  public getInterestIDs(user) {
    const userID = this.getID(user);
    const interestIDs = [];
    const profileInterests = ProfileInterests.findNonRetired({ userID });
    profileInterests.forEach((fav) => {
      interestIDs.push(fav.interestID);
    });
    return interestIDs;
  }

  /**
   * Publish the username field for all users.
   */
  public publish() {
    if (Meteor.isServer) {
      Meteor.publish(this.collectionName, () => Meteor.users.find({}, {
        fields: {
          username: 1,
          roles: 1,
          status: 1,
        },
      }));
    }
  }

  /**
   * Default subscription method for entities.
   * It subscribes to the entire collection.
   */
  public subscribe() {
    if (Meteor.isClient) {
      // console.log(`${this.collectionName}.subscribe`);
      return Meteor.subscribe(this.collectionName);
    }
    return null;
  }

  /**
   * Return the publication name.
   * @returns { String } The publication name, as a string.
   */
  public getPublicationName() {
    return this.collectionName;
  }
}

/**
 * Provides the singleton instance of this class to other entities.
 * @type {api/user.UserCollection}
 * @memberOf api/user
 */
export const Users = new UserCollection();
