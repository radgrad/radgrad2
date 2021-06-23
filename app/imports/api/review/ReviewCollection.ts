import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Users } from '../user/UserCollection';
import { Courses } from '../course/CourseCollection';
import { ReviewDefine, ReviewUpdate, ReviewUpdateData } from '../../typings/radgrad';
import BaseCollection from '../base/BaseCollection';

/**
 * Represents a course or opportunity review by a student.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/review
 */
class ReviewCollection extends BaseCollection {
  public COURSE: string;

  public OPPORTUNITY: string;

  /**
   * Creates the Review collection.
   */
  constructor() {
    super('Review', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      reviewType: { type: String },
      revieweeID: { type: SimpleSchema.RegEx.Id },
      termID: { type: SimpleSchema.RegEx.Id },
      rating: { type: SimpleSchema.Integer },
      comments: { type: String },
      moderated: { type: Boolean },
      visible: { type: Boolean },
      moderatorComments: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    }));
    this.COURSE = 'course';
    this.OPPORTUNITY = 'opportunity';
    this.defineSchema = new SimpleSchema({
      student: String,
      reviewType: String,
      reviewee: String,
      academicTerm: String,
      rating: { type: SimpleSchema.Integer, optional: true },
      comments: String,
      moderated: { type: Boolean, optional: true },
      visible: { type: Boolean, optional: true },
      moderatorComments: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      academicTerm: { type: String, optional: true },
      rating: { type: SimpleSchema.Integer, optional: true },
      comments: { type: String, optional: true },
      moderated: { type: Boolean, optional: true },
      visible: { type: Boolean, optional: true },
      moderatorComments: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a new Review.
   * @example
   * Review.define({ student: 'abi@hawaii.edu',
   *                 reviewType: 'course',
   *                 reviewee: 'ics_111',
   *                 academicTerm: 'Fall-2016',
   *                 rating: 3,
   *                 comments: 'This class is great!',
   *                 moderated: false,
   *                 visible: true,
   *                 moderatedComments: 'sample comments here',
   *                 retired: false});
   * @param { Object } description Object with keys slug, student, reviewee,
   * reviewType,academicTerm, rating, comments, moderated, public, and moderatorComments.
   * Student must be a user with role 'STUDENT.'
   * ReviewType must be either 'course' or 'opportunity'.
   * Reviewee must be a defined course or opportunity slug, depending upon reviewType.
   * academicTerm must be a defined slug.
   * Moderated is optional and defaults to false.
   * Visible is optional and defaults to true.
   * ModeratorComments is optional.
   * @throws {Meteor.Error} If the definition includes a defined slug, undefined student,
   * undefined reviewee, undefined academicTerm, or invalid rating.
   * @returns The newly created docID.
   */
  public define({ student, reviewType, reviewee, academicTerm, rating = 3, comments, moderated = false, visible = true, moderatorComments, retired = false }: ReviewDefine) {
    // Validate student, get studentID.
    const studentID = Users.getID(student);
    Users.assertInRole(studentID, [ROLE.STUDENT, ROLE.ALUMNI]);
    // Validate reviewType, get revieweeID and assign slug if not provided.
    this.assertValidReviewType(reviewType);
    let revieweeID;
    if (reviewType === this.COURSE) {
      revieweeID = Courses.getID(reviewee);
    } else if (reviewType === this.OPPORTUNITY) {
      revieweeID = Opportunities.getID(reviewee);
    }
    // Validate academicTerm, get termID.
    const termID = AcademicTerms.getID(academicTerm);
    // Validate rating.
    this.assertValidRating(rating);
    // Guarantee that moderated and public are booleans.
    moderated = !!moderated; // eslint-disable-line no-param-reassign
    visible = !!visible; // eslint-disable-line no-param-reassign
    // Check to see if the review exists.
    const doc = this.collection.findOne({ studentID, reviewType, revieweeID, termID });
    if (doc) {
      throw new Meteor.Error(`Cannot create two reviews for ${reviewee} in the same term.`);
    }
    // Define the new Review.
    const reviewID = this.collection.insert({
      studentID,
      reviewType,
      revieweeID,
      termID,
      rating,
      comments,
      moderated,
      visible,
      moderatorComments,
      retired,
    });
    // Return the id to the newly created Review.
    return reviewID;
  }

  /**
   * Throws an error if rating is not an integer between 1 and 5.
   * @param rating the rating.
   */
  public assertValidRating(rating: number) {
    if (!_.isInteger(rating) || !_.inRange(rating, 1, 6)) {
      throw new Meteor.Error(`Invalid rating: ${rating}`);
    }
  }

  /**
   * Throws an error if reviewType is not 'opportunity' or 'collection'.
   * @param reviewType The review type.
   */
  public assertValidReviewType(reviewType: string) {
    if (!([this.OPPORTUNITY, this.COURSE].includes(reviewType))) {
      throw new Meteor.Error(`Invalid reviewType: ${reviewType}`);
    }
  }

  /**
   * Update the review. Only academicTerm, rating, comments, moderated, visible, and moderatorComments can be updated.
   * @param docID The review docID (required).
   */
  public update(docID, { academicTerm, rating, comments, moderated, visible, moderatorComments, retired }: ReviewUpdate) {
    this.assertDefined(docID);
    const updateData: ReviewUpdateData = {};
    if (academicTerm) {
      updateData.termID = AcademicTerms.getID(academicTerm);
    }
    if (_.isNumber(rating)) {
      this.assertValidRating(rating);
      updateData.rating = rating;
    }
    if (comments) {
      updateData.comments = comments;
    }
    if (_.isBoolean(moderated)) {
      updateData.moderated = moderated;
    }
    if (_.isBoolean(visible)) {
      updateData.visible = !!visible;
    }
    if (moderatorComments) {
      updateData.moderatorComments = moderatorComments;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the review.
   * @param docID The docID of the review.
   */
  public removeIt(docID: string) {
    this.assertDefined(docID);
    return super.removeIt(docID);
  }

  /**
   * Removes all CourseInstance documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(user: string) {
    const studentID = Users.getID(user);
    this.collection.remove({ studentID });
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
   * Checks slugID, opportunityTypeID, sponsorID, interestIDs, termIDs
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!Opportunities.isDefined(doc.revieweeID) && !Courses.isDefined(doc.revieweeID)) {
        problems.push(`Bad reviewee: ${doc.revieweeID}`);
      }
      if (!AcademicTerms.isDefined(doc.termID)) {
        problems.push(`Bad studentID: ${doc.termID}`);
      }
    });
    return problems;
  }

  /**
   * Updates the Review's modified, visible, and moderatorComments variables.
   * @param reviewID The review ID.
   * @param moderated The new moderated value.
   * @param visible The new visible value.
   * @param moderatorComments The new moderatorComments value.
   */
  public updateModerated(reviewID: string, moderated: boolean, visible: boolean, moderatorComments: string) {
    this.assertDefined(reviewID);
    this.collection.update({ _id: reviewID },
      { $set: { moderated, visible, moderatorComments } });
  }

  /**
   * Returns an object representing the Review docID in a format acceptable to define().
   * @param docID The docID of an Review.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): ReviewDefine {
    const doc = this.findDoc(docID);
    const student = Users.getProfile(doc.studentID).username;
    const reviewType = doc.reviewType;
    let reviewee;
    if (reviewType === this.COURSE) {
      reviewee = Courses.findSlugByID(doc.revieweeID);
    } else if (reviewType === this.OPPORTUNITY) {
      reviewee = Opportunities.findSlugByID(doc.revieweeID);
    }
    const academicTerm = AcademicTerms.findSlugByID(doc.termID);
    const rating = doc.rating;
    const comments = doc.comments;
    const moderated = doc.moderated;
    const visible = doc.visible;
    const moderatorComments = doc.moderatorComments;
    const retired = doc.retired;
    return {
      student,
      reviewType,
      reviewee,
      academicTerm,
      rating,
      comments,
      moderated,
      visible,
      moderatorComments,
      retired,
    };
  }

  /**
   * Dumps all the Reviews for the given usernameOrID.
   * @param {string} usernameOrID
   * @return {ReviewDefine[]}
   */
  public dumpUser(usernameOrID: string): ReviewDefine[] {
    const profile = Users.getProfile(usernameOrID);
    const studentID = profile.userID;
    const retVal = [];
    const instances = this.find({ studentID }).fetch();
    instances.forEach((instance) => {
      retVal.push(this.dumpOne(instance._id));
    });
    return retVal;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/review.ReviewCollection}
 * @memberOf api/review
 */
export const Reviews = new ReviewCollection();
