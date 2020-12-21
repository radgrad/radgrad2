import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { Users } from './UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { AdvisorOrFacultyProfileDefine, AdvisorOrFacultyProfileUpdate } from '../../typings/radgrad';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';

/**
 * Represents a Faculty Profile.
 * @extends api/user.BaseProfileCollection
 * @memberOf api/user
 */
class FacultyProfileCollection extends BaseProfileCollection {
  constructor() {
    super('FacultyProfile', new SimpleSchema({
      aboutMe: { type: String, optional: true },
    }));
  }

  /**
   * Defines the profile associated with a Faculty.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @param aboutMe { String } a brief description. (optional)
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the FacultyProfile.
   */
  public define({ username, firstName, lastName, picture = defaultProfilePicture, website, interests,
    careerGoals, aboutMe, retired = false }: AdvisorOrFacultyProfileDefine) {
    if (Meteor.isServer) {
      const role = ROLE.FACULTY;
      Slugs.define({ name: username, entityName: this.getType() });
      const profileID = this.collection.insert({
        username, firstName, lastName, role, picture, website, userID: this.getFakeUserId(), aboutMe, retired });
      const userID = Users.define({ username, role });
      this.collection.update(profileID, { $set: { userID } });
      const share = true;
      if (interests) {
        interests.forEach((interest) => FavoriteInterests.define({ interest, share, username }));
      }
      if (careerGoals) {
        careerGoals.forEach((careerGoal) => FavoriteCareerGoals.define({ careerGoal, share, username }));
      }
      return profileID;
    }
    return undefined;
  }

  /**
   * Updates the FacultyProfile.
   * You cannot change the username or role once defined.
   * @param docID the id of the FacultyProfile.
   */
  public update(docID: string, { firstName, lastName, picture, website, interests, careerGoals, retired, courseExplorerFilter, opportunityExplorerSortOrder, aboutMe }: AdvisorOrFacultyProfileUpdate) {
    this.assertDefined(docID);
    const updateData: AdvisorOrFacultyProfileUpdate = {};
    this.updateCommonFields(updateData, { firstName, lastName, picture, website, retired, courseExplorerFilter, opportunityExplorerSortOrder });
    if (aboutMe) {
      updateData.aboutMe = aboutMe;
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
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Faculty or
   * Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Faculty.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
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
      if (doc.role !== ROLE.FACULTY) {
        problems.push(`FacultyProfile instance does not have ROLE.FACULTY: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the FacultyProfile docID in a format acceptable to define().
   * @param docID The docID of a FacultyProfile
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): AdvisorOrFacultyProfileDefine {
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
    const aboutMe = doc.aboutMe;
    const retired = doc.retired;
    return { username, firstName, lastName, picture, website, interests, careerGoals, aboutMe, retired };
  }
}

/**
 * Provides the singleton instance.
 * @type {api/user.FacultyProfileCollection}
 * @memberOf api/user
 */
export const FacultyProfiles = new FacultyProfileCollection();
