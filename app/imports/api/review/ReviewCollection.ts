import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import { Slugs } from '../slug/SlugCollection';
import { AcademicTerms } from '../semester/AcademicTermCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Users } from '../user/UserCollection';
import { Courses } from '../course/CourseCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { IReviewDefine, IReviewUpdate, IReviewUpdateData } from '../../typings/radgrad';

/**
 * Represents a course or opportunity review by a student.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/review
 */
class ReviewCollection extends BaseSlugCollection {
  public COURSE: string;
  public OPPORTUNITY: string;

  /**
   * Creates the Review collection.
   */
  constructor() {
    super('Review', new SimpleSchema({
      slugID: { type: SimpleSchema.RegEx.Id },
      studentID: { type: SimpleSchema.RegEx.Id },
      reviewType: { type: String },
      revieweeID: { type: SimpleSchema.RegEx.Id },
      semesterID: { type: SimpleSchema.RegEx.Id },
      rating: { type: Number },
      comments: { type: String },
      moderated: { type: Boolean },
      visible: { type: Boolean },
      moderatorComments: { type: String, optional: true },
    }));
    this.COURSE = 'course';
    this.OPPORTUNITY = 'opportunity';
  }

  /**
   * Defines a new Review.
   * @example
   * Review.define({ slug: 'review-course-ics111-abi',
   *                 student: 'abi@hawaii.edu',
   *                 reviewType: 'course',
   *                 reviewee: 'ics_111',
   *                 semester: 'Fall-2016',
   *                 rating: 3,
   *                 comments: 'This class is great!',
   *                 moderated: false,
   *                 visible: true,
   *                 moderatedComments: 'sample comments here'});
   * @param { Object } description Object with keys slug, student, reviewee,
   * reviewType,semester, rating, comments, moderated, public, and moderatorComments.
   * Slug is optional. If supplied, must not be previously defined.
   * Student must be a user with role 'STUDENT.'
   * ReviewType must be either 'course' or 'opportunity'.
   * Reviewee must be a defined course or opportunity slug, depending upon reviewType.
   * Semester must be a defined slug.
   * Moderated is optional and defaults to false.
   * Visible is optional and defaults to true.
   * ModeratorComments is optional.
   * @throws {Meteor.Error} If the definition includes a defined slug, undefined student,
   * undefined reviewee, undefined semester, or invalid rating.
   * @returns The newly created docID.
   */
  public define({ slug, student, reviewType, reviewee, semester, rating = 3, comments, moderated = false, visible = true, moderatorComments }: IReviewDefine) {
    // Validate student, get studentID.
    const studentID = Users.getID(student);
    Users.assertInRole(studentID, [ROLE.STUDENT, ROLE.ALUMNI]);
    // Validate reviewType, get revieweeID and assign slug if not provided.
    this.assertValidReviewType(reviewType);
    let revieweeID;
    if (reviewType === this.COURSE) {
      revieweeID = Courses.getID(reviewee);
      if (!slug) {
        // tslint:disable: no-parameter-reassignment
        slug = `review-course-${Courses.getSlug(revieweeID)}-${Users.getProfile(studentID).username}`;
      }
    } else
      if (reviewType === this.OPPORTUNITY) {
        revieweeID = Opportunities.getID(reviewee);
        if (!slug) {
          slug = `review-opportunity-${Opportunities.getSlug(revieweeID)}-${Users.getProfile(studentID).username}`;
        }
      }
    // Validate semester, get semesterID.
    const semesterID = AcademicTerms.getID(semester);
    // Validate rating.
    this.assertValidRating(rating);
    // Guarantee that moderated and public are booleans.
    moderated = !!moderated;
    visible = !!visible;
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the new Review and its Slug.
    const reviewID = this.collection.insert({
      slugID, studentID, reviewType, revieweeID, semesterID, rating, comments, moderated, visible, moderatorComments,
    });
    Slugs.updateEntityID(slugID, reviewID);
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
    if (!_.includes([this.OPPORTUNITY, this.COURSE], reviewType)) {
      throw new Meteor.Error(`Invalid reviewType: ${reviewType}`);
    }
  }

  /**
   * Update the review. Only semester, rating, comments, moderated, visible, and moderatorComments can be updated.
   * @param docID The review docID (required).
   */
  public update(docID, { semester, rating, comments, moderated, visible, moderatorComments }: IReviewUpdate) {
    this.assertDefined(docID);
    const updateData: IReviewUpdateData = {};
    if (semester) {
      updateData.semesterID = AcademicTerms.getID(semester);
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
   * Returns the slug for the given opportunity ID.
   * @param opportunityID the opportunity ID.
   */
  public getSlug(reviewID: string) {
    this.assertDefined(reviewID);
    const reviewDoc = this.findDoc(reviewID);
    return Slugs.findDoc(reviewDoc.slugID).name;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, opportunityTypeID, sponsorID, interestIDs, semesterIDs
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!Opportunities.isDefined(doc.revieweeID) && !Courses.isDefined(doc.revieweeID)) {
        problems.push(`Bad reviewee: ${doc.revieweeID}`);
      }
      if (!AcademicTerms.isDefined(doc.semesterID)) {
        problems.push(`Bad studentID: ${doc.semesterID}`);
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
  public dumpOne(docID: string): IReviewDefine {
    const doc = this.findDoc(docID);
    const slug = Slugs.getNameFromID(doc.slugID);
    const student = Users.getProfile(doc.studentID).username;
    const reviewType = doc.reviewType;
    let reviewee;
    if (reviewType === this.COURSE) {
      reviewee = Courses.findSlugByID(doc.revieweeID);
    } else
      if (reviewType === this.OPPORTUNITY) {
        reviewee = Opportunities.findSlugByID(doc.revieweeID);
      }
    const semester = AcademicTerms.findSlugByID(doc.semesterID);
    const rating = doc.rating;
    const comments = doc.comments;
    const moderated = doc.moderated;
    const visible = doc.visible;
    const moderatorComments = doc.moderatorComments;

    return { slug, student, reviewType, reviewee, semester, rating, comments, moderated, visible, moderatorComments };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/review.ReviewCollection}
 * @memberOf api/review
 */
export const Reviews = new ReviewCollection();
