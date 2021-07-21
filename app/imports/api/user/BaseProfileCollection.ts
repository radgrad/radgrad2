import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from './UserCollection';
import { ROLE } from '../role/Role';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { BaseProfile } from '../../typings/radgrad';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from './profile-entries/ProfileCourseCollection';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from './profile-entries/ProfileOpportunityCollection';

export const defaultProfilePicture = '/images/default-profile-picture.png';

// Technical debt add shareInternships? and other to this collection since advisors and faculty can now have Profile*
/**
 * Set up the object to be used to map role names to their corresponding collections.
 * @memberOf api/user
 */
const rolesToCollectionNames = {};
rolesToCollectionNames[ROLE.ADVISOR] = 'AdvisorProfileCollection';
rolesToCollectionNames[ROLE.FACULTY] = 'FacultyProfileCollection';
rolesToCollectionNames[ROLE.STUDENT] = 'StudentProfileCollection';
rolesToCollectionNames[ROLE.ADMIN] = 'AdminProfileCollection';

/**
 * BaseProfileCollection is an abstract superclass of all profile collections.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/user
 */
class BaseProfileCollection extends BaseSlugCollection {
  constructor(type, schema) {
    super(
      type,
      schema.extend(
        new SimpleSchema({
          username: String,
          firstName: String,
          lastName: String,
          role: String,
          picture: { type: String, optional: true },
          website: { type: String, optional: true },
          userID: SimpleSchema.RegEx.Id,
          retired: { type: Boolean, optional: true },
          sharePicture: { type: Boolean, optional: true },
          shareWebsite: { type: Boolean, optional: true },
          shareCareerGoals: { type: Boolean, optional: true },
          shareCourses: { type: Boolean, optional: true },
          shareInterests: { type: Boolean, optional: true },
          shareOpportunities: { type: Boolean, optional: true },
          courseExplorerFilter: { type: String, optional: true }, // TODO is this still used?
          opportunityExplorerSortOrder: { type: String, optional: true }, // TODO is this still used?
          lastVisited: { type: Object, optional: true, blackbox: true },
          acceptedTermsAndConditions: { type: String, optional: true },
          refusedTermsAndConditions: { type: String, optional: true },
        }),
      ),
    );
  }

  /**
   * The subclass methods need a way to create a profile with a valid, though fake, userId.
   * @returns {string}
   */
  public getFakeUserId() {
    return 'ABCDEFGHJKLMNPQRS';
  }

  /**
   * Returns the name of the collection associated with the given profile.
   * @param profile A Profile object.
   * @returns  { String } The name of a profile collection.
   */
  public getCollectionNameForProfile(profile: BaseProfile) {
    return rolesToCollectionNames[profile.role];
  }

  /**
   * Returns the Profile's docID associated with instance, or throws an error if it cannot be found.
   * If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.
   * If instance is the value for the username field in this collection, then return that document's ID.
   * If instance is the userID for the profile, then return the Profile's ID.
   * If instance is an object with an _id field, then that value is checked to see if it's in the collection.
   * @param { String } instance Either a valid docID, valid userID or a valid slug string.
   * @returns { String } The docID associated with instance.
   * @throws { Meteor.Error } If instance is not a docID or a slug.
   */
  public getID(instance) {
    let id;
    // If we've been passed a document, check to see if it has an _id field and use that if available.
    if (_.isObject(instance) && _.has(instance, '_id')) {
      // @ts-ignore
      instance = instance._id; // eslint-disable-line no-param-reassign, dot-notation
    }
    // If instance is the value of the username field for some document in the collection, then return its ID.
    const usernameBasedDoc = this.collection.findOne({ username: instance });
    if (usernameBasedDoc) {
      return usernameBasedDoc._id;
    }
    // If instance is the value of the userID field for some document in the collection, then return its ID.
    const userIDBasedDoc = this.collection.findOne({ userID: instance });
    if (userIDBasedDoc) {
      return userIDBasedDoc._id;
    }
    // Otherwise see if we can find instance as a docID or as a slug.
    try {
      id = this.collection.findOne({ _id: instance }) ? instance : this.findIdBySlug(instance);
    } catch (err) {
      throw new Meteor.Error(`Error in ${this.collectionName} getID(): Failed to convert ${instance} to an ID.`);
    }
    return id;
  }

  /**
   * Returns the profile associated with the specified user.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document.
   * @throws { Meteor.Error } If user is not a valid user, or profile is not found.
   */
  public getProfile(user) {
    const userID = Users.getID(user);
    const doc = this.collection.findOne({ userID });
    if (!doc) {
      throw new Meteor.Error(`No profile found for user ${user}`);
    }
    return doc;
  }

  /**
   * Returns the profile document associated with username, or null if none was found.
   * @param username A username, such as 'johnson@hawaii.edu'.
   * @returns The profile document, or null.
   */
  public findByUsername(username) {
    return this.collection.findOne({ username });
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  public hasProfile(user) {
    const userID = Users.getID(user);
    return this.collection.findOne({ userID });
  }

  /**
   * Returns true if the user has set their picture.
   * @param user The user (either their username (email) or their userID).
   * @return {boolean}
   */
  public hasSetPicture(user) {
    const userID = Users.getID(user);
    const doc = this.collection.findOne({ userID });
    // console.log(doc);
    if (!doc) {
      return false;
    }
    return !(_.isNil(doc.picture) || doc.picture === defaultProfilePicture);
  }

  /**
   * Updates an entry in lastVisited for this profile with a new (or updated) timestamp for the given page.
   * @param user user The user (either their username (email) or their userID).
   * @param page The page. Should be one of PAGEIDS.
   */
  public updateLastVisitedEntry(user, pageID) {
    const userID = Users.getID(user);
    const doc = this.collection.findOne({ userID });
    if (!doc) {
      throw new Meteor.Error(`Error in updateLastVisited: Unknown ${user} for page ${pageID}`);
    }
    // ensure we have an object to update.
    const lastVisitedObject = doc.lastVisited || {};
    const oldTimestamp = lastVisitedObject[pageID];
    const newTimestamp = moment().format('YYYY-MM-DD');
    // Guarantee that we only call update when the timestamp has actually changed to avoid reactive re-rendering.
    if (oldTimestamp !== newTimestamp) {
      lastVisitedObject[pageID] = newTimestamp;
      const keyField = `lastVisited.${pageID}`;
      const setObject = {};
      setObject[keyField] = newTimestamp;
      this.collection.update({ userID }, { $set: setObject });
    }
  }

  /**
   * Returns the userID associated with the given profile.
   * @param profileID The ID of the profile.
   * @returns The associated userID.
   */
  public getUserID(profileID) {
    return this.collection.findOne(profileID).userID;
  }

  /**
   * Internal method for use by subclasses.
   * @param doc The profile document.
   * @returns {Array} An array of problems
   */
  protected checkIntegrityCommonFields(doc) {
    const problems = [];
    if (!Users.isDefined(doc.userID)) {
      problems.push(`Bad userID: ${doc.userID}`);
    }
    return problems;
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  public removeIt(profileID) {
    // console.log('BaseProfileCollection.removeIt', profileID);
    const profile = this.collection.findOne({ _id: profileID });
    const userID = profile.userID;
    if (!Users.isReferenced(userID)) {
      // Automatically remove references to user from other collections that are "private" to this user.
      [CourseInstances, OpportunityInstances, AcademicYearInstances, VerificationRequests, ProfileCareerGoals, ProfileCourses, ProfileInterests, ProfileOpportunities, Reviews].forEach((collection) => collection.removeUser(userID));
      Meteor.users.remove({ _id: userID });
      Slugs.getCollection().remove({ name: profile.username });
      return super.removeIt(profileID);
    }
    throw new Meteor.Error(`User ${profile.username} is a sponsor of un-retired Opportunities.`);
  }

  /**
   * Override the BaseCollection.publish. We only publish profiles if the user is logged in.
   */
  public publish(): void {
    if (Meteor.isServer) {
      Meteor.publish(this.collectionName, () => {
        if (!Meteor.user()) {
          return [];
        }
        return this.collection.find();
      });
    }
  }

  /**
   * Internal method for use by subclasses.
   * Destructively modifies updateData with the values of the passed fields.
   * Call this function for side-effect only.
   */
  protected updateCommonFields(
    updateData,
    {
      firstName,
      lastName,
      picture,
      website,
      retired,
      courseExplorerFilter,
      opportunityExplorerSortOrder,
      shareWebsite,
      sharePicture,
      shareInterests,
      shareCareerGoals,
      shareCourses,
      shareOpportunities,
      acceptedTermsAndConditions,
      refusedTermsAndConditions,
    },
  ) {
    // console.log('updateCommonFields', firstName, lastName, picture, website, retired, courseExplorerFilter, opportunityExplorerSortOrder, shareWebsite, sharePicture, shareInterests, shareCareerGoals, shareCourses, shareOpportunities, acceptedTermsAndConditions, refusedTermsAndConditions);
    if (firstName) {
      updateData.firstName = firstName; // eslint-disable-line no-param-reassign
    }
    if (lastName) {
      updateData.lastName = lastName; // eslint-disable-line no-param-reassign
    }
    if (_.isString(picture)) {
      updateData.picture = picture; // eslint-disable-line no-param-reassign
    }
    if (_.isString(website)) {
      updateData.website = website; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired; // eslint-disable-line no-param-reassign
    }
    if (_.isString(courseExplorerFilter)) {
      updateData.courseExplorerFilter = courseExplorerFilter; // eslint-disable-line no-param-reassign
    }
    if (_.isString(opportunityExplorerSortOrder)) {
      updateData.opportunityExplorerSortOrder = opportunityExplorerSortOrder; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(shareCareerGoals)) {
      updateData.shareCareerGoals = shareCareerGoals; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(shareCourses)) {
      updateData.shareCourses = shareCourses; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(shareInterests)) {
      updateData.shareInterests = shareInterests; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(shareOpportunities)) {
      updateData.shareOpportunities = shareOpportunities; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(sharePicture)) {
      updateData.sharePicture = sharePicture; // eslint-disable-line no-param-reassign
    }
    if (_.isBoolean(shareWebsite)) {
      updateData.shareWebsite = shareWebsite; // eslint-disable-line no-param-reassign
    }
    if (_.isString(acceptedTermsAndConditions)) {
      updateData.acceptedTermsAndConditions = acceptedTermsAndConditions; // eslint-disable-line no-param-reassign
    }
    if (_.isString(refusedTermsAndConditions)) {
      updateData.refusedTermsAndConditions = refusedTermsAndConditions; // eslint-disable-line no-param-reassign
    }
    // console.log('_updateCommonFields', updateData);
  }
}

/**
 * The BaseProfileCollection used by all Profile classes.
 * @memberOf api/user
 */
export default BaseProfileCollection;
