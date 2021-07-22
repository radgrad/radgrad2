import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { ProfileCourses } from './profile-entries/ProfileCourseCollection';
import { ProfileOpportunities } from './profile-entries/ProfileOpportunityCollection';
import { Users } from './UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { ROLE } from '../role/Role';
import { AdvisorOrFacultyProfileDefine, AdvisorOrFacultyProfileUpdate } from '../../typings/radgrad';
import { ProfileInterests } from './profile-entries/ProfileInterestCollection';
import { ProfileCareerGoals } from './profile-entries/ProfileCareerGoalCollection';
import { checkUsername } from './utilities/profile';

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
  public define({
    username,
    firstName,
    lastName,
    picture = defaultProfilePicture,
    website,
    interests,
    careerGoals,
    profileCourses,
    profileOpportunities,
    aboutMe,
    retired = false,
    sharePicture = true,
    shareWebsite = true,
    shareInterests = true,
    shareCareerGoals = true,
    shareCourses = true,
    shareOpportunities = true,
    lastVisited = {},
  }: AdvisorOrFacultyProfileDefine) {
    if (Meteor.isServer) {
      const role = ROLE.FACULTY;
      checkUsername(username);
      const profileID = this.collection.insert({
        username,
        firstName,
        lastName,
        role,
        picture,
        website,
        userID: this.getFakeUserId(),
        aboutMe,
        retired,
        lastVisited,
        sharePicture,
        shareWebsite,
        shareCareerGoals,
        shareCourses,
        shareInterests,
        shareOpportunities,
      });
      const userID = Users.define({ username, role });
      this.collection.update(profileID, { $set: { userID } });
      const share = true;
      if (interests) {
        interests.forEach((interest) => ProfileInterests.define({ interest, username }));
      }
      if (careerGoals) {
        careerGoals.forEach((careerGoal) => ProfileCareerGoals.define({ careerGoal, share, username }));
      }
      if (profileCourses) {
        profileCourses.forEach((course) => ProfileCourses.define({ course, username, retired }));
      }
      if (profileOpportunities) {
        profileOpportunities.forEach((opportunity) => ProfileOpportunities.define({ opportunity, username, retired }));
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
  public update(docID: string, {
    firstName,
    lastName,
    picture,
    website,
    interests,
    careerGoals,
    profileCourses,
    profileOpportunities,
    retired,
    courseExplorerFilter,
    opportunityExplorerSortOrder,
    shareCourses,
    shareOpportunities,
    shareWebsite,
    sharePicture,
    shareInterests,
    shareCareerGoals,
    acceptedTermsAndConditions,
    refusedTermsAndConditions,
    aboutMe,
  }: AdvisorOrFacultyProfileUpdate) {
    this.assertDefined(docID);
    const updateData: AdvisorOrFacultyProfileUpdate = {};
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
    if (aboutMe) {
      updateData.aboutMe = aboutMe;
    }
    this.collection.update(docID, { $set: updateData });
    const profile = this.findDoc(docID);
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
    if (_.isBoolean(shareCourses)) {
      updateData.shareCourses = shareCourses;
    }
    if (_.isBoolean(shareOpportunities)) {
      updateData.shareOpportunities = shareOpportunities;
    }
    if (_.isBoolean(retired)) {
      // Need to retire the opportunities that they are the sponsor of?
      const sponsoredOpportunities = Opportunities.find({ sponsorID: profile.userID }).fetch();
      sponsoredOpportunities.forEach((opp) => {
        const oppID = opp._id;
        const opportunityUpdate = {
          retired,
        };
        Opportunities.update(oppID, opportunityUpdate);
      });
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
    const favInterests = ProfileInterests.findNonRetired({ userID });
    const interests = favInterests.map((fav) => Interests.findSlugByID(fav.interestID));
    const favCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
    const careerGoals = favCareerGoals.map((fav) => CareerGoals.findSlugByID(fav.careerGoalID));
    const aboutMe = doc.aboutMe;
    const retired = doc.retired;
    const favCourses = ProfileCourses.findNonRetired({ userID });
    const profileCourses = favCourses.map((fav) => Courses.findSlugByID(fav.courseID));
    const favOpps = ProfileOpportunities.findNonRetired({ userID });
    const profileOpportunities = favOpps.map((fav) => Opportunities.findSlugByID(fav.opportunityID));
    const sharePicture = doc.sharePicture;
    const shareWebsite = doc.shareWebsite;
    const shareInterests = doc.shareInterests;
    const shareCareerGoals = doc.shareCareerGoals;
    const shareCourses = doc.shareCourses;
    const shareOpportunities = doc.shareOpportunities;
    return { username, firstName, lastName, picture, website, interests, careerGoals, profileCourses, profileOpportunities, aboutMe, retired, shareWebsite, shareInterests, shareCareerGoals, sharePicture, shareOpportunities, shareCourses };
  }
}

/**
 * Provides the singleton instance.
 * @type {api/user.FacultyProfileCollection}
 * @memberOf api/user
 */
export const FacultyProfiles = new FacultyProfileCollection();
