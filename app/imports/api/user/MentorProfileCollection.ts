import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { Users } from './UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { IMentorProfileDefine, IMentorProfileUpdate } from '../../typings/radgrad';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';

/**
 * Represents a Mentor Profile.
 * @extends api/user.BaseProfileCollection
 * @memberOf api/user
 */
class MentorProfileCollection extends BaseProfileCollection {
  constructor() {
    super('MentorProfile', new SimpleSchema({
      company: String,
      career: String,
      location: String,
      linkedin: { type: String, optional: true },
      motivation: String,
    }));
  }

  /**
   * Defines the profile associated with a Mentor.
   * The username does not need to be defined in Meteor Accounts yet, but it must be a unique Slug.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @param company The company the mentor works for.
   * @param career The mentor's career (or title).
   * @param location The mentor's location.
   * @param linkedin The mentor's LinkedIn user ID. (optional)
   * @param motivation The reason why the user mentors.
   * @param retired Is this mentor retired? (optional)
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the MentorProfile.
   */
  public define({ username, firstName, lastName, picture = defaultProfilePicture, website, interests,
           careerGoals, company, career, location, linkedin, motivation, retired = false }: IMentorProfileDefine) {
    if (Meteor.isServer) {
      const role = ROLE.MENTOR;
      Slugs.define({ name: username, entityName: this.getType() });
      const profileID = this.collection.insert({
        username, firstName, lastName, role, picture, website, company, career, location, linkedin,
        motivation, userID: this.getFakeUserId(), retired });
      const userID = Users.define({ username, role });
      this.collection.update(profileID, { $set: { userID } });
      if (interests) {
        interests.forEach((interest) => FavoriteInterests.define({ interest, username }));
      }
      if (careerGoals) {
        careerGoals.forEach((careerGoal) => FavoriteCareerGoals.define({ careerGoal, username }));
      }
      return profileID;
    }
    return undefined;
  }

  /**
   * Updates the MentorProfile.
   * You cannot change the username or role once defined.
   * @param docID the id of the MentorProfile.
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} picture
   * @param {string} website
   * @param {string[]} interests
   * @param {string[]} careerGoals
   * @param company the company (optional).
   * @param career the career (optional).
   * @param location the location (optional).
   * @param linkedin LinkedIn user ID (optional).
   * @param motivation the motivation (optional).
   */
  public update(docID: string, { firstName, lastName, picture, website, interests, careerGoals, retired, company, career, location, linkedin,
    motivation, courseExplorerFilter, opportunityExplorerSortOrder }: IMentorProfileUpdate) {
    this.assertDefined(docID);
    const updateData: IMentorProfileUpdate = {};
    this.updateCommonFields(updateData, { firstName, lastName, picture, website, retired, courseExplorerFilter, opportunityExplorerSortOrder });
    if (_.isString(company)) {
      updateData.company = company;
    }
    if (_.isString(career)) {
      updateData.career = career;
    }
    if (_.isString(location)) {
      updateData.location = location;
    }
    if (_.isString(linkedin)) {
      updateData.linkedin = linkedin;
    }
    if (_.isString(motivation)) {
      updateData.motivation = motivation;
    }
    this.collection.update(docID, { $set: updateData });
    const profile = this.findDoc(docID);
    const username = profile.username;
    if (interests) {
      FavoriteInterests.removeUser(username);
      interests.forEach((interest) => FavoriteInterests.define({ interest, username }));
    }
    if (careerGoals) {
      FavoriteCareerGoals.removeUser(username);
      careerGoals.forEach((careerGoal) => FavoriteCareerGoals.define({ careerGoal, username }));
    }
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Mentor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.MENTOR]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    let problems = [];
    this.find().forEach((doc) => {
      problems = problems.concat(this.checkIntegrityCommonFields(doc));
      if (doc.role !== ROLE.MENTOR) {
        problems.push(`MentorProfile instance does not have ROLE.MENTOR: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the MentorProfile docID in a format acceptable to define().
   * @param docID The docID of a MentorProfile
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IMentorProfileDefine {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const website = doc.website;
    const userID = Users.getID(username);
    const favInterests = FavoriteInterests.findNonRetired({ userID });
    const interests = _.map(favInterests, (fav) => Interests.findSlugByID(fav.interestID));
    const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
    const careerGoals = _.map(favCareerGoals, (fav) => CareerGoals.findSlugByID(fav.careerGoalID));
    const company = doc.company;
    const career = doc.career;
    const location = doc.location;
    const linkedin = doc.linkedin;
    const motivation = doc.motivation;
    const retired = doc.retired;
    return { username, firstName, lastName, picture, website, interests, careerGoals, company, career, location,
      linkedin, motivation, retired };
  }
}

/**
 * Provides the singleton instance.
 * @type {api/user.MentorProfileCollection}
 * @memberOf api/user
 */
export const MentorProfiles = new MentorProfileCollection();
