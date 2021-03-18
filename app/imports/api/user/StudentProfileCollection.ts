import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
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
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { getProjectedICE, getEarnedICE } from '../ice/IceProcessor';
import { StudentProfileDefine, StudentProfileUpdate, StudentProfileUpdateData } from '../../typings/radgrad';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from './profile-entries/ProfileCourseCollection';
import { ProfileOpportunities } from './profile-entries/ProfileOpportunityCollection';

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
        declaredAcademicTermID: { type: SimpleSchema.RegEx.Id, optional: true },
        isAlumni: Boolean,
        shareOpportunities: { type: Boolean, optional: true },
        shareCourses: { type: Boolean, optional: true },
        shareLevel: { type: Boolean, optional: true },
        lastRegistrarLoad: { type: String, optional: true },
        lastVisitedCareerGoals: { type: String, optional: true },
        lastVisitedCourses: { type: String, optional: true },
        lastVisitedInterests: { type: String, optional: true },
        lastVisitedOpportunities: { type: String, optional: true },
        lastVisitedPrivacy: { type: String, optional: true },
        lastLeveledUp: { type: String, optional: true },
        acceptedTermsAndConditions: { type: String, optional: true },
        refusedTermsAndConditions: { type: String, optional: true },
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
      shareUsername: { type: Boolean, optional: true },
      sharePicture: { type: Boolean, optional: true },
      shareWebsite: { type: Boolean, optional: true },
      shareInterests: { type: Boolean, optional: true },
      shareCareerGoals: { type: Boolean, optional: true },
      shareOpportunities: { type: Boolean, optional: true },
      shareCourses: { type: Boolean, optional: true },
      shareLevel: { type: Boolean, optional: true },
      lastRegistrarLoad: { type: String, optional: true },
      lastVisitedCareerGoals: { type: String, optional: true },
      lastVisitedCourses: { type: String, optional: true },
      lastVisitedInterests: { type: String, optional: true },
      lastVisitedOpportunities: { type: String, optional: true },
      lastVisitedPrivacy: { type: String, optional: true },
      lastLeveledUp: { type: String, optional: true },
      acceptedTermsAndConditions: { type: String, optional: true },
      refusedTermsAndConditions: { type: String, optional: true },
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
      shareUsername: { type: Boolean, optional: true },
      sharePicture: { type: Boolean, optional: true },
      shareWebsite: { type: Boolean, optional: true },
      shareInterests: { type: Boolean, optional: true },
      shareCareerGoals: { type: Boolean, optional: true },
      shareOpportunities: { type: Boolean, optional: true },
      shareCourses: { type: Boolean, optional: true },
      shareLevel: { type: Boolean, optional: true },
      lastRegistrarLoad: { type: String, optional: true },
      lastVisitedCareerGoals: { type: String, optional: true },
      lastVisitedCourses: { type: String, optional: true },
      lastVisitedInterests: { type: String, optional: true },
      lastVisitedOpportunities: { type: String, optional: true },
      lastVisitedPrivacy: { type: String, optional: true },
      lastLeveledUp: { type: String, optional: true },
      acceptedTermsAndConditions: { type: String, optional: true },
      refusedTermsAndConditions: { type: String, optional: true },
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
   * @param shareUsername An optional boolean indicating if this student is sharing their username. Defaults to false.
   * @param sharePicture An optional boolean indicating if this student is sharing their picture. Defaults to false.
   * @param shareWebsite An optional boolean indicating if this student is sharing their website. Defaults to false.
   * @param shareInterests An optional boolean indicating if this student is sharing their interests. Defaults to false.
   * @param shareCareerGoals An optional boolean indicating if this student is sharing their career goals. Defaults to false.
   * @param shareCourses An optional boolean indicating if this student is sharing their courses. Defaults to false.
   * @param shareOpportunities An optional boolean indicating if this student is sharing their opportunities. Defaults to false.
   * @param shareLevel An optional boolean indicating if this student is sharing their level. Defaults to false.
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
    shareUsername = false,
    sharePicture = false,
    shareWebsite = false,
    shareInterests = false,
    shareCareerGoals = false,
    shareCourses = false,
    shareOpportunities = false,
    shareLevel = false,
    lastRegistrarLoad,
    lastVisitedCareerGoals,
    lastVisitedCourses,
    lastVisitedInterests,
    lastVisitedOpportunities,
    lastVisitedPrivacy,
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

      // Create the slug, which ensures that username is unique.
      Slugs.define({ name: username, entityName: this.getType() });
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
        shareUsername,
        sharePicture,
        shareWebsite,
        shareInterests,
        shareCareerGoals,
        shareCourses,
        shareOpportunities,
        shareLevel,
        lastRegistrarLoad,
        lastVisitedCareerGoals,
        lastVisitedCourses,
        lastVisitedInterests,
        lastVisitedOpportunities,
        lastVisitedPrivacy,
        lastLeveledUp,
        acceptedTermsAndConditions,
        refusedTermsAndConditions,
      });
      const userID = Users.define({ username, role });
      this.collection.update(profileID, { $set: { userID } });
      if (interests) {
        interests.forEach((interest) => ProfileInterests.define({ interest, share: shareInterests, username }));
      }
      if (careerGoals) {
        careerGoals.forEach((careerGoal) => ProfileCareerGoals.define({
          careerGoal,
          share: shareCareerGoals,
          username,
        }));
      }
      if (profileCourses) {
        profileCourses.forEach((course) => ProfileCourses.define({ course, student: username }));
      }
      if (profileOpportunities) {
        profileOpportunities.forEach((opportunity) =>
          ProfileOpportunities.define({
            opportunity,
            student: username,
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
   * @param interests
   * @param careerGoals
   * @param level
   * @param declaredAcademicTerm
   * @param isAlumni
   * @param retired
   * @param shareUsername
   * @param sharePicture
   * @param shareWebsite
   * @param shareInterests
   * @param shareCareerGoals
   * @param shareCourses
   * @param shareOpportunities
   * @param shareLevel
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
      shareUsername,
      sharePicture,
      shareWebsite,
      shareInterests,
      shareCareerGoals,
      shareCourses,
      shareOpportunities,
      shareLevel,
      lastRegistrarLoad,
      lastVisitedCareerGoals,
      lastVisitedCourses,
      lastVisitedInterests,
      lastVisitedOpportunities,
      lastVisitedPrivacy,
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
    if (_.isBoolean(shareUsername)) {
      updateData.shareUsername = shareUsername;
    }
    if (_.isBoolean(sharePicture)) {
      updateData.sharePicture = sharePicture;
    }
    if (_.isBoolean(shareWebsite)) {
      updateData.shareWebsite = shareWebsite;
    }
    if (_.isBoolean(shareInterests)) {
      updateData.shareInterests = shareInterests;
    }
    if (_.isBoolean(shareCareerGoals)) {
      updateData.shareCareerGoals = shareCareerGoals;
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
    if (lastRegistrarLoad) {
      updateData.lastRegistrarLoad = lastRegistrarLoad;
    }
    if (lastVisitedCareerGoals) {
      updateData.lastVisitedCareerGoals = lastVisitedCareerGoals;
    }
    if (lastVisitedCourses) {
      updateData.lastVisitedCourses = lastVisitedCourses;
    }
    if (lastVisitedInterests) {
      updateData.lastVisitedInterests = lastVisitedInterests;
    }
    if (lastVisitedOpportunities) {
      updateData.lastVisitedOpportunities = lastVisitedOpportunities;
    }
    if (lastVisitedPrivacy) {
      updateData.lastVisitedPrivacy = lastVisitedPrivacy;
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
      profileCourses.forEach((course) => ProfileCourses.define({ course, student: username, retired }));
    }
    if (profileOpportunities) {
      ProfileOpportunities.removeUser(username);
      profileOpportunities.forEach((opportunity) => ProfileOpportunities.define({ opportunity, student: username, retired }));
    }
    if (_.isBoolean(retired)) {
      const studentID = profile.userID;
      // retire the CourseInstances, OpportunityInstances, Reviews, and VerificationRequests
      const cis = CourseInstances.find({ studentID }).fetch();
      cis.forEach((ci) => CourseInstances.update(ci._id, { retired }));
      const ois = OpportunityInstances.find({ studentID }).fetch();
      ois.forEach((oi) => OpportunityInstances.update(oi._id, { retired }));
      const reviews = Reviews.find({ studentID }).fetch();
      reviews.forEach((review) => Reviews.update(review._id, { retired }));
      const vrs = VerificationRequests.find({ studentID }).fetch();
      vrs.forEach((vr) => VerificationRequests.update(vr._id, { retired }));
    }
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  public removeIt(profileID) {
    if (this.isDefined(profileID)) {
      return super.removeIt(profileID);
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
   * Returns an array of courseIDs that this user has taken (or plans to take) based on their courseInstances.
   * @param studentID The studentID.
   */
  public getCourseIDs(user: string) {
    const studentID = Users.getID(user);
    const courseInstanceDocs = CourseInstances.findNonRetired({ studentID });
    const courseIDs = courseInstanceDocs.map((doc) => doc.courseID);
    return courseIDs; // allow for multiple 491 or 499 classes.
    // return _.uniq(courseIDs);
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

  public publish() {
    if (Meteor.isServer) {
      // console.log('StudentProfileCollection.publish');
      const collection = this.collection;
      Meteor.publish(this.collectionName, function () {
        const userID = Meteor.userId();
        ReactiveAggregate(this, collection, [
          {
            $project: {
              username: {
                $cond: [
                  {
                    $or: [{ $ifNull: ['$shareUsername', false] }, { $eq: [userID, '$userID'] }, { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]), true] }],
                  },
                  '$username',
                  '',
                ],
              },
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
              shareUsername: 1,
              sharePicture: 1,
              shareWebsite: 1,
              shareInterests: 1,
              shareCareerGoals: 1,
              shareOpportunities: 1,
              shareCourses: 1,
              shareLevel: 1,
              optedIn: {
                $cond: [
                  {
                    $or: ['$shareUsername', '$sharePicture', '$shareWebsite', '$shareInterests', '$shareCareerGoals', '$shareOpportunities', '$shareCourses', '$shareLevel'],
                  },
                  true,
                  false,
                ],
              },
              lastRegistrarLoad: 1,
              lastVisitedCareerGoals: 1,
              lastVisitedCourses: 1,
              lastVisitedInterests: 1,
              lastVisitedOpportunities: 1,
              lastVisitedPrivacy: 1,
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
    const favCourses = ProfileCourses.findNonRetired({ studentID: userID });
    const profileCourses = favCourses.map((fav) => Courses.findSlugByID(fav.courseID));
    const favOpps = ProfileOpportunities.findNonRetired({ studentID: userID });
    const profileOpportunities = favOpps.map((fav) => Opportunities.findSlugByID(fav.opportunityID));
    const declaredAcademicTerm = doc.declaredAcademicTermID && AcademicTerms.findSlugByID(doc.declaredAcademicTermID);
    const isAlumni = doc.isAlumni;
    const retired = doc.retired;
    const shareUsername = doc.shareUsername;
    const sharePicture = doc.sharePicture;
    const shareWebsite = doc.shareWebsite;
    const shareInterests = doc.shareInterests;
    const shareCareerGoals = doc.shareCareerGoals;
    const shareOpportunities = doc.shareOpportunities;
    const shareCourses = doc.shareCourses;
    const shareLevel = doc.shareLevel;
    const lastRegistrarLoad = doc.lastRegistrarLoad;
    const lastVisitedCareerGoals = doc.lastVisitedCareerGoals;
    const lastVisitedCourses = doc.lastVisitedCourses;
    const lastVisitedInterests = doc.lastVisitedInterests;
    const lastVisitedOpportunities = doc.lastVisitedOpportunities;
    const lastVisitedPrivacy = doc.lastVisitedPrivacy;
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
      shareUsername,
      sharePicture,
      shareWebsite,
      shareInterests,
      shareCareerGoals,
      shareOpportunities,
      shareCourses,
      shareLevel,
      lastRegistrarLoad,
      lastVisitedCareerGoals,
      lastVisitedCourses,
      lastVisitedInterests,
      lastVisitedOpportunities,
      lastVisitedPrivacy,
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
