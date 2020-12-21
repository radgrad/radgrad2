import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { Users } from './UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { ProfileDefine, ProfileUpdate } from '../../typings/radgrad';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';

/**
 * Represents a Admin Profile.
 * @extends api/user.BaseProfileCollection
 * @memberOf api/user
 */
class AdminProfileCollection extends BaseProfileCollection {
  constructor() {
    super('AdminProfile', new SimpleSchema({}));
  }

  /**
   * Defines the profile associated with an Admin and the associated Meteor account.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the AdminProfile.
   */
  public define({ username, firstName, lastName, picture = defaultProfilePicture, website, interests,
    careerGoals, retired = false }: ProfileDefine) {
    if (Meteor.isServer) {
      const user = Meteor.users.findOne({ username });
      // console.log(`AdminProfile.define ${user}`);
      if (!user) {
        const role = ROLE.ADMIN;
        Slugs.define({ name: username, entityName: this.getType() });
        const profileID = this.collection.insert({
          username, firstName, lastName, role, picture, website, userID: this.getFakeUserId(), retired,
        });
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
      return this.collection.findOne({ username })._id;
    }
    return undefined;
  }

  /**
   * Updates the AdminProfile.
   * You cannot change the username or role once defined.
   * @param docID the id of the AdminProfile.
   */
  public update(docID, { firstName, lastName, picture, website, interests, careerGoals, retired, courseExplorerFilter, opportunityExplorerSortOrder }: ProfileUpdate) {
    this.assertDefined(docID);
    const updateData = {};
    this.updateCommonFields(updateData, { firstName, lastName, picture, website, retired, courseExplorerFilter, opportunityExplorerSortOrder });
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
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Admin.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Admin.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN]);
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
      if (doc.role !== ROLE.ADMIN) {
        problems.push(`AdminProfile instance does not have ROLE.ADMIN: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the AdminProfile docID in a format acceptable to define().
   * @param docID The docID of a AdminProfile
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): ProfileDefine {
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
    const retired = doc.retired;
    return { username, firstName, lastName, picture, website, interests, careerGoals, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/user.AdminProfileCollection}
 * @memberOf api/user
 */
export const AdminProfiles = new AdminProfileCollection();
