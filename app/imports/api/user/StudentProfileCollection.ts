import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
// @ts-ignore
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import { Reviews } from '../review/ReviewCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Users } from './UserCollection';
import { ROLE } from '../role/Role';
import { getProjectedICE, getEarnedICE } from '../ice/IceProcessor';
import { AcademicTerm, StudentProfileDefine, StudentProfileUpdate, StudentProfileUpdateData } from '../../typings/radgrad';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from './profile-entries/ProfileCourseCollection';
import { ProfileOpportunities } from './profile-entries/ProfileOpportunityCollection';
import { checkUsername } from './utilities/profile';

/**
 * Represents a Student Profile.
 * @extends api/user.BaseProfileCollection
 * @memberOf api/user
 */
class StudentProfileCollection extends BaseProfileCollection {
  constructor() {
    super(
      'StudentProfile',
      new SimpleSchema({
        level: { type: SimpleSchema.Integer, min: 1, max: 6 },
        declaredAcademicTermID: { type: SimpleSchema.RegEx.Id, optional: true }, // TODO do we need this anymore?
        isAlumni: Boolean,
        shareLevel: { type: Boolean, optional: true },
        shareICE: { type: Boolean, optional: true },
        lastRegistrarLoad: { type: String, optional: true },
        lastLeveledUp: { type: String, optional: true },
      }),
    );
    this.defineSchema = new SimpleSchema({
      username: String,
      firstName: String,
      lastName: String,
      picture: { type: String, optional: true },
      website: { type: String, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': String,
      careerGoals: { type: Array, optional: true },
      'careerGoals.$': String,
      retired: { type: Boolean, optional: true },
      level: { type: SimpleSchema.Integer, min: 1, max: 6 },
      declaredAcademicTerm: { type: String, optional: true },
      isAlumni: { type: Boolean, optional: true },
      profileCourses: { type: Array, optional: true },
      'profileCourses.$': String,
      profileOpportunities: { type: Array, optional: true },
      'profileOpportunities.$': String,
      sharePicture: { type: Boolean, optional: true },
      shareWebsite: { type: Boolean, optional: true },
      shareInterests: { type: Boolean, optional: true },
      shareCareerGoals: { type: Boolean, optional: true },
      shareOpportunities: { type: Boolean, optional: true },
      shareCourses: { type: Boolean, optional: true },
      shareLevel: { type: Boolean, optional: true },
      shareICE: { type: Boolean, optional: true },
      lastRegistrarLoad: { type: String, optional: true },
      lastLeveledUp: { type: String, optional: true },
      acceptedTermsAndConditions: { type: String, optional: true },
      refusedTermsAndConditions: { type: String, optional: true },
      lastVisited: { type: Object, optional: true, blackbox: true },
    });
    this.updateSchema = new SimpleSchema({
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      picture: { type: String, optional: true },
      website: { type: String, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': String,
      careerGoals: { type: Array, optional: true },
      'careerGoals.$': String,
      retired: { type: Boolean, optional: true },
      level: { type: SimpleSchema.Integer, min: 1, max: 6 },
      declaredAcademicTermID: { type: String, optional: true },
      isAlumni: { type: Boolean, optional: true },
      profileCourses: { type: Array, optional: true },
      'profileCourses.$': String,
      profileOpportunities: { type: Array, optional: true },
      'profileOpportunities.$': String,
      sharePicture: { type: Boolean, optional: true },
      shareWebsite: { type: Boolean, optional: true },
      shareInterests: { type: Boolean, optional: true },
      shareCareerGoals: { type: Boolean, optional: true },
      shareOpportunities: { type: Boolean, optional: true },
      shareCourses: { type: Boolean, optional: true },
      shareLevel: { type: Boolean, optional: true },
      shareICE: { type: Boolean, optional: true },
      lastRegistrarLoad: { type: String, optional: true },
      lastLeveledUp: { type: String, optional: true },
      acceptedTermsAndConditions: { type: String, optional: true },
      refusedTermsAndConditions: { type: String, optional: true },
      lastVisited: { type: Object, optional: true, blackbox: true },
    });
  }

  /**
   * Defines the profile associated with a Student.
   * The username does not need to be defined in Meteor Accounts yet, but it must be a unique Slug.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @param level An integer between 1 and 6 indicating the student's level.
   * @param retired boolean. (optional defaults to false)
   * @param declaredAcademicTerm An optional string indicating the student's declared academic term.
   * @param isAlumni An optional boolean indicating if this student has graduated. Defaults to false.
   * @param sharePicture An optional boolean indicating if this student is sharing their picture. Defaults to false.
   * @param shareWebsite An optional boolean indicating if this student is sharing their website. Defaults to false.
   * @param shareInterests An optional boolean indicating if this student is sharing their interests. Defaults to false.
   * @param shareCareerGoals An optional boolean indicating if this student is sharing their career goals. Defaults to false.
   * @param shareCourses An optional boolean indicating if this student is sharing their courses. Defaults to false.
   * @param shareOpportunities An optional boolean indicating if this student is sharing their opportunities. Defaults to false.
   * @param shareLevel An optional boolean indicating if this student is sharing their level. Defaults to false.
   * @param shareICE An optional boolean indicating if this student is sharing their ICE points. Defaults to false.
   * @param lastVisited An optional object with PAGEIDS for keys and strings in format "YYYY-MM-DD" for values. Defaults to an empty object.
   * @throws { Meteor.Error } If username has been previously defined, or if any interests, careerGoals, level,
   * or declaredAcademicTerm are invalid.
   * @return { String } The docID of the StudentProfile.
   */

  public define({
    username,
    firstName,
    lastName,
    picture = defaultProfilePicture,
    website,
    interests,
    careerGoals,
    level,
    declaredAcademicTerm,
    profileCourses = [],
    profileOpportunities = [],
    isAlumni = false,
    retired = false,
    sharePicture = false,
    shareWebsite = false,
    shareInterests = false,
    shareCareerGoals = false,
    shareCourses = false,
    shareOpportunities = false,
    shareLevel = false,
    shareICE = false,
    lastRegistrarLoad,
    lastVisited = {},
    lastLeveledUp,
    acceptedTermsAndConditions,
    refusedTermsAndConditions,
  }: StudentProfileDefine) {
    if (Meteor.isServer) {
      // Validate parameters.
      const declaredAcademicTermID = declaredAcademicTerm ? AcademicTerms.getID(declaredAcademicTerm) : undefined;
      this.assertValidLevel(level);
      if (!_.isBoolean(isAlumni)) {
        throw new Meteor.Error(`Invalid isAlumni: ${isAlumni}`);
      }
      checkUsername(username);
      const role = isAlumni ? ROLE.ALUMNI : ROLE.STUDENT;
      const profileID = this.collection.insert({
        username,
        firstName,
        lastName,
        role,
        picture,
        website,
        level,
        declaredAcademicTermID,
        isAlumni,
        userID: this.getFakeUserId(),
        retired,
        sharePicture,
        shareWebsite,
        shareInterests,
        shareCareerGoals,
        shareCourses,
        shareOpportunities,
        shareLevel,
        shareICE,
        lastRegistrarLoad,
        lastVisited,
        lastLeveledUp,
        acceptedTermsAndConditions,
        refusedTermsAndConditions,
      });
      const userID = Users.define({ username, role });
      this.collection.update(profileID, { $set: { userID } });
      if (interests) {
        interests.forEach((interest) => ProfileInterests.define({ interest, username }));
      }
      if (careerGoals) {
        careerGoals.forEach((careerGoal) => ProfileCareerGoals.define({
          careerGoal,
          username,
        }));
      }
      if (profileCourses) {
        profileCourses.forEach((course) => ProfileCourses.define({ course, username }));
      }
      if (profileOpportunities) {
        profileOpportunities.forEach((opportunity) =>
          ProfileOpportunities.define({
            opportunity,
            username,
          }),
        );
      }
      return profileID;
    }
    return undefined;
  }

  /**
   * Updates the StudentProfile.
   * You cannot change the username or role once defined. (You can implicitly change the role by setting isAlumni).
   * Users in ROLE.STUDENT cannot change their level or isAlumni setting.
   * @param docID
   * @param firstName
   * @param lastName
   * @param picture
   * @param website
   * @param interests array of interest slugs or IDs.
   * @param careerGoals
   * @param level
   * @param declaredAcademicTerm
   * @param isAlumni
   * @param retired
   * @param sharePicture
   * @param shareWebsite
   * @param shareInterests
   * @param shareCareerGoals
   * @param shareCourses
   * @param shareOpportunities
   * @param shareLevel
   * @param shareICE
   */
  public update(
    docID,
    {
      firstName,
      lastName,
      picture,
      website,
      interests,
      careerGoals,
      level,
      profileCourses,
      profileOpportunities,
      declaredAcademicTerm,
      isAlumni,
      retired,
      courseExplorerFilter,
      opportunityExplorerSortOrder,
      sharePicture,
      shareWebsite,
      shareCareerGoals,
      shareCourses,
      shareInterests,
      shareOpportunities,
      shareLevel,
      shareICE,
      lastRegistrarLoad,
      lastLeveledUp,
      acceptedTermsAndConditions,
      refusedTermsAndConditions,
    }: StudentProfileUpdate,
  ) {
    this.assertDefined(docID);
    const profile = this.findDoc(docID);
    const updateData: StudentProfileUpdateData = {};
    this.updateCommonFields(updateData, {
      firstName,
      lastName,
      picture,
      website,
      retired,
      courseExplorerFilter,
      opportunityExplorerSortOrder,
      shareWebsite,
      sharePicture,
      shareCareerGoals,
      shareCourses,
      shareInterests,
      shareOpportunities,
      acceptedTermsAndConditions,
      refusedTermsAndConditions,
    });
    if (declaredAcademicTerm) {
      updateData.declaredAcademicTermID = AcademicTerms.getID(declaredAcademicTerm);
    }
    // Only Admins and Advisors can update the isAlumni and level fields.
    // Or if no one is logged in when this is executed (i.e. for testing) then it's cool.
    if (Meteor.isTest || !Meteor.userId() || this.hasRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR])) {
      const userID = this.findDoc(docID).userID;
      if (_.isBoolean(isAlumni)) {
        updateData.isAlumni = isAlumni;
        if (isAlumni) {
          updateData.role = ROLE.ALUMNI;
          Roles.createRole(ROLE.ALUMNI, { unlessExists: true });
          Roles.addUsersToRoles(userID, [ROLE.ALUMNI]);
          Roles.removeUsersFromRoles(userID, [ROLE.STUDENT]);
        } else {
          updateData.role = ROLE.STUDENT;
          Roles.createRole(ROLE.STUDENT, { unlessExists: true });
          Roles.addUsersToRoles(userID, [ROLE.STUDENT]);
          Roles.removeUsersFromRoles(userID, [ROLE.ALUMNI]);
        }
      }
      if (level) {
        this.assertValidLevel(level);
        updateData.level = level;
      }
      if (_.isBoolean(retired)) {
        updateData.retired = retired;
      }
    }
    if (_.isBoolean(shareCourses)) {
      updateData.shareCourses = shareCourses;
    }
    if (_.isBoolean(shareOpportunities)) {
      updateData.shareOpportunities = shareOpportunities;
    }
    if (_.isBoolean(shareLevel)) {
      updateData.shareLevel = shareLevel;
    }
    if (_.isBoolean(shareICE)) {
      updateData.shareICE = shareICE;
    }
    if (lastRegistrarLoad) {
      updateData.lastRegistrarLoad = lastRegistrarLoad;
    }
    if (lastLeveledUp) {
      updateData.lastLeveledUp = lastLeveledUp;
    }
    if (acceptedTermsAndConditions) {
      updateData.acceptedTermsAndConditions = acceptedTermsAndConditions;
    }
    if (refusedTermsAndConditions) {
      updateData.refusedTermsAndConditions = refusedTermsAndConditions;
    }
    // console.log('StudentProfile.update %o', updateData);
    this.collection.update(docID, { $set: updateData });
    // console.log(this.findDoc(docID));
    const username = profile.username;
    if (interests) {
      ProfileInterests.removeUser(username);
      interests.forEach((interest) => ProfileInterests.define({ interest, username, retired }));
    }
    if (careerGoals) {
      ProfileCareerGoals.removeUser(username);
      careerGoals.forEach((careerGoal) => ProfileCareerGoals.define({ careerGoal, username, retired }));
    }
    if (profileCourses) {
      ProfileCourses.removeUser(username);
      profileCourses.forEach((course) => ProfileCourses.define({ course, username, retired }));
    }
    if (profileOpportunities) {
      ProfileOpportunities.removeUser(username);
      profileOpportunities.forEach((opportunity) => ProfileOpportunities.define({ opportunity, username, retired }));
    }
    if (_.isBoolean(retired)) {
      const userID = profile.userID;
      // retire the CourseInstances, OpportunityInstances, Reviews, and VerificationRequests
      const cis = CourseInstances.find({ userID }).fetch();
      cis.forEach((ci) => CourseInstances.update(ci._id, { retired }));
      const ois = OpportunityInstances.find({ userID }).fetch();
      ois.forEach((oi) => OpportunityInstances.update(oi._id, { retired }));
      const reviews = Reviews.find({ userID }).fetch();
      reviews.forEach((review) => Reviews.update(review._id, { retired }));
      const vrs = VerificationRequests.find({ userID }).fetch();
      vrs.forEach((vr) => VerificationRequests.update(vr._id, { retired }));
    }
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  public removeIt(profileID) {
    const docID = this.getID(profileID);
    if (this.isDefined(docID)) {
      return super.removeIt(docID);
    }
    return null;
  }

  /**
   * Asserts that level is an integer between 1 and 6.
   * @param level The level.
   */
  public assertValidLevel(level: number) {
    if (!_.isInteger(level) && !_.inRange(level, 1, 7)) {
      throw new Meteor.Error(`Level ${level} is not between 1 and 6.`);
    }
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
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
      if (doc.role !== ROLE.STUDENT && doc.role !== ROLE.ALUMNI) {
        problems.push(`StudentProfile instance does not have ROLE.STUDENT or ROLE.ALUMNI: ${doc.username}`);
      }
      if (!_.isInteger(doc.level) && !_.inRange(doc.level, 1, 7)) {
        problems.push(`Level ${doc.level} is not an integer between 1 and 6 in ${doc.username}`);
      }
      if (!_.isBoolean(doc.isAlumni)) {
        problems.push(`Invalid isAlumni: ${doc.isAlumni} in ${doc.username}`);
      }
      if (doc.declaredAcademicTermID && !AcademicTerms.isDefined(doc.declaredAcademicTermID)) {
        problems.push(`Bad termID: ${doc.declaredAcademicTermID} in ${doc.username}`);
      }
    });
    return problems;
  }

  /**
   * Returns an ICE object with the total earned course and opportunity ICE values.
   * @param user The student (username or userID).
   * @throws {Meteor.Error} If userID is not defined.
   */
  public getEarnedICE(user: string) {
    const studentID = Users.getID(user);
    const courseDocs = CourseInstances.findNonRetired({ studentID });
    const oppDocs = OpportunityInstances.findNonRetired({ studentID });
    return getEarnedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns an ICE object with the total projected course and opportunity ICE values.
   * @param user The student (username or userID).
   * @throws {Meteor.Error} If user is not defined.
   */
  public getProjectedICE(user: string) {
    const studentID = Users.getID(user);
    const courseDocs = CourseInstances.findNonRetired({ studentID });
    const oppDocs = OpportunityInstances.findNonRetired({ studentID });
    return getProjectedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns true if projected innovation, competency, and experience points are all 100 or above.
   * @param {string} user The username.
   * @returns {boolean} True if degree plan is complete.
   */
  public isDegreePlanComplete(user: string) {
    const projectedICE = this.getProjectedICE(user);
    return ((projectedICE.c >= 100) && (projectedICE.e >= 100) && (projectedICE.i >= 100));
  }

  /**
   * Returns an array of courseIDs that this user has taken (or plans to take) based on their courseInstances.
   * @param userID The userID.
   */
  public getCourseIDs(user: string) {
    const userID = Users.getID(user);
    const courseInstanceDocs = CourseInstances.findNonRetired({ userID });
    const courseIDs = courseInstanceDocs.map((doc) => doc.courseID);
    return courseIDs; // allow for multiple 491 or 499 classes.
    // return _.uniq(courseIDs);
  }

  public getLastAcademicTerm(user: string): AcademicTerm {
    // console.log('getLastAcademicTerm', user);
    const studentID = Users.getID(user);
    let lastAcademicTerm;
    const cis = CourseInstances.find({ studentID }).fetch();
    cis.forEach((ci) => {
      const term = AcademicTerms.findDoc(ci.termID);
      if (!lastAcademicTerm) {
        lastAcademicTerm = term;
      }
      if (term.termNumber > lastAcademicTerm.termNumber) {
        lastAcademicTerm = term;
      }
    });
    const ois = OpportunityInstances.find({ studentID }).fetch();
    ois.forEach((oi) => {
      const term = AcademicTerms.findDoc(oi.termID);
      if (!lastAcademicTerm) {
        lastAcademicTerm = term;
      }
      if (term.termNumber > lastAcademicTerm.termNumber) {
        lastAcademicTerm = term;
      }
    });
    return lastAcademicTerm;
  }

  /**
   * Updates user's level.
   * @param user The user (username or userID).
   * @param level The new level.
   */
  public setLevel(user: string, level: number) {
    const id = this.getID(user);
    this.collection.update({ _id: id }, { $set: { level } });
  }

  /**
   * Updates the lastLeveledUp field to the current date.
   * @param user The user (username or userID).
   */
  public setLastLeveledUp(user: string) {
    const id = this.getID(user);
    const lastLeveledUp = moment().format('YYYY-MM-DD');
    this.collection.update({ _id: id }, { $set: { lastLeveledUp } });
  }

  public publish() {
    if (Meteor.isServer) {
      // console.log('StudentProfileCollection.publish');
      const collection = this.collection;
      Meteor.publish(this.collectionName, function () {
        const userID = Meteor.userId();
        ReactiveAggregate(this, collection, [
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              role: 1,
              picture: {
                $cond: [
                  {
                    $or: [{ $ifNull: ['$sharePicture', false] }, { $eq: [userID, '$userID'] }, { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]), true] }],
                  },
                  '$picture',
                  '/images/default-profile-picture.png',
                ],
              },
              website: {
                $cond: [
                  {
                    $or: [{ $ifNull: ['$shareWebsite', false] }, { $eq: [userID, '$userID'] }, { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]), true] }],
                  },
                  '$website',
                  '',
                ],
              },
              userID: 1,
              retired: 1,
              level: {
                $cond: [
                  {
                    $or: [{ $ifNull: ['$shareLevel', false] }, { $eq: [userID, '$userID'] }, { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]), true] }],
                  },
                  '$level',
                  0,
                ],
              },
              declaredAcademicTermID: 1,
              isAlumni: 1,
              sharePicture: 1,
              shareWebsite: 1,
              shareInterests: 1,
              shareCareerGoals: 1,
              shareOpportunities: 1,
              shareCourses: 1,
              shareLevel: 1,
              shareICE: 1,
              optedIn: {
                $cond: [
                  {
                    $or: ['$sharePicture', '$shareWebsite', '$shareInterests', '$shareCareerGoals', '$shareOpportunities', '$shareCourses', '$shareLevel', '$shareICE'],
                  },
                  true,
                  false,
                ],
              },
              lastRegistrarLoad: 1,
              lastVisited: 1,
              lastLeveledUp: 1,
              acceptedTermsAndConditions: 1,
              refusedTermsAndConditions: 1,
            },
          },
        ]);
      });
    }
  }

  /**
   * Returns an object representing the StudentProfile docID in a format acceptable to define().
   * @param docID The docID of a StudentProfile
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): StudentProfileDefine {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const website = doc.website;
    const userID = Users.getID(username);
    const favInterests = ProfileInterests.findNonRetired({ userID });
    const interests = favInterests.map((fav) => Interests.findSlugByID(fav.interestID));
    const favCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
    const careerGoals = favCareerGoals.map((fav) => CareerGoals.findSlugByID(fav.careerGoalID));
    const level = doc.level;
    const favCourses = ProfileCourses.findNonRetired({ userID });
    const profileCourses = favCourses.map((fav) => Courses.findSlugByID(fav.courseID));
    const favOpps = ProfileOpportunities.findNonRetired({ userID });
    const profileOpportunities = favOpps.map((fav) => Opportunities.findSlugByID(fav.opportunityID));
    const declaredAcademicTerm = doc.declaredAcademicTermID && AcademicTerms.findSlugByID(doc.declaredAcademicTermID);
    const isAlumni = doc.isAlumni;
    const retired = doc.retired;
    const sharePicture = doc.sharePicture;
    const shareWebsite = doc.shareWebsite;
    const shareInterests = doc.shareInterests;
    const shareCareerGoals = doc.shareCareerGoals;
    const shareOpportunities = doc.shareOpportunities;
    const shareCourses = doc.shareCourses;
    const shareLevel = doc.shareLevel;
    const shareICE = doc.shareICE;
    const lastRegistrarLoad = doc.lastRegistrarLoad;
    const lastLeveledUp = doc.lastLeveledUp;
    const acceptedTermsAndConditions = doc.acceptedTermsAndConditions;
    return {
      username,
      firstName,
      lastName,
      picture,
      website,
      interests,
      careerGoals,
      level,
      profileCourses,
      profileOpportunities,
      declaredAcademicTerm,
      isAlumni,
      retired,
      sharePicture,
      shareWebsite,
      shareInterests,
      shareCareerGoals,
      shareOpportunities,
      shareCourses,
      shareLevel,
      shareICE,
      lastRegistrarLoad,
      lastLeveledUp,
      acceptedTermsAndConditions,
    };
  }
}

/**
 * Provides the singleton instance this collection to all other entities.
 * @type {api/user.StudentProfileCollection}
 * @memberOf api/user
 */
export const StudentProfiles = new StudentProfileCollection();
