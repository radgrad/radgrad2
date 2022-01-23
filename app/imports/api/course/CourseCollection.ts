import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Internships } from '../internship/InternshipCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Reviews } from '../review/ReviewCollection';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { ProfileCourses } from '../user/profile-entries/ProfileCourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { CareerGoal, Course, CourseDefine, CourseUpdate, Internship, Opportunity } from '../../typings/radgrad';
import { validateCourseSlugFormat } from './CourseUtilities';

/**
 * Represents a specific course, such as "ICS 311".
 * To represent a specific course for a specific academicTerm, use CourseInstance.
 * @memberOf api/course
 * @extends api/base~BaseSlugCollection
 */
class CourseCollection extends BaseSlugCollection {
  public unInterestingSlug: string;

  /**
   * Creates the Course collection.
   */
  constructor() {
    super('Course', new SimpleSchema({
      name: { type: String },
      shortName: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      num: { type: String },
      description: { type: String },
      creditHrs: { type: Number },
      interestIDs: [SimpleSchema.RegEx.Id],
      // Optional data
      syllabus: { type: String, optional: true },
      repeatable: { type: Boolean, optional: true },
      retired: { type: Boolean, optional: true },
      picture: { type: String, optional: true, defaultValue: 'images/header-panel/header-courses.png' },
    }));
    this.defineSchema = new SimpleSchema({
      name: String,
      shortName: { type: String, optional: true },
      slug: String,
      description: String,
      creditHrs: { type: SimpleSchema.Integer, optional: true },
      interests: [String],
      syllabus: String,
      repeatable: { type: Boolean, optional: true },
      retired: { type: Boolean, optional: true },
      picture: { type: String, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      name: { type: String, optional: true },
      shortName: { type: String, optional: true },
      description: { type: String, optional: true },
      creditHrs: { type: SimpleSchema.Integer, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': String,
      syllabus: { type: String, optional: true },
      repeatable: { type: Boolean, optional: true },
      retired: { type: Boolean, optional: true },
      picture: { type: String, optional: true },
    });
    this.unInterestingSlug = 'other';
  }

  /**
   * Defines a new Course.
   * @example
   * Courses.define({ name: 'Introduction to the theory and practice of scripting',
   *                  shortName: 'Intro to Scripting',
   *                  slug: 'ics_215',
   *                  num: 'ICS 215',
   *                  description: 'Introduction to scripting languages for the integration of applications.',
   *                  creditHrs: 4,
   *                  interests: ['perl', 'javascript', 'ruby'],
   *                  syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
   *                  });
   * @param { Object } description Object with keys name, shortName, slug, num, description, creditHrs,
   *                   interests, syllabus.
   * @param name is the official course name.
   * @param shortName is an optional abbreviation. Defaults to name.
   * @param slug must not be previously defined.
   * @param num the course number.
   * @param creditHrs is optional and defaults to 3. If supplied, must be a num between 1 and 15.
   * @param interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @param syllabus is optional. If supplied, should be a URL.
   * @param repeatable is optional, defaults to false.
   * @param retired is optional, defaults to false.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest or invalid creditHrs.
   * @returns The newly created docID.
   */
  public define({ name, shortName = name, slug, num, description, creditHrs = 3, interests = [], syllabus, picture, retired = false, repeatable = false }: CourseDefine) {
    // Make sure the slug has the right format <dept>_<number>
    validateCourseSlugFormat(slug);
    // check if slug is defined
    if (Slugs.isSlugForEntity(slug, this.getType())) {
      // console.log(`${slug} is already defined for ${this.getType()}`);
      return Slugs.getEntityID(slug, this.getType());
    }
    // console.log(`Defining slug ${slug}`);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Make sure creditHrs is a num between 1 and 15.
    if (!(typeof creditHrs === 'number') || (creditHrs < 1) || (creditHrs > 15)) {
      throw new Meteor.Error(`CreditHrs ${creditHrs} is not a number between 1 and 15.`);
    }
    const courseID =
      this.collection.insert({
        name,
        shortName,
        slugID,
        num,
        description,
        creditHrs,
        interestIDs,
        syllabus,
        repeatable,
        retired,
        picture,
      });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, courseID);
    return courseID;
  }

  /**
   * Update a Course.
   * @param instance The docID (or slug) associated with this course.
   * @param name optional
   * @param shortName optional
   * @param num optional
   * @param description optional
   * @param creditHrs optional
   * @param interests An array of interestIDs or slugs (optional)
   * @param syllabus optional
   * @param repeatable optional boolean.
   * @param retired optional boolean.
   */
  public update(instance: string, { name, shortName, num, description, creditHrs, interests, picture, syllabus, retired, repeatable }: CourseUpdate) {
    const docID = this.getID(instance);
    const updateData: {
      name?: string;
      description?: string;
      interestIDs?: string[];
      shortName?: string;
      num?: string;
      creditHrs?: number;
      syllabus?: string;
      repeatable?: boolean;
      retired?: boolean;
      picture?: string;
    } = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (picture) {
      updateData.picture = picture;
    }
    if (interests) {
      const interestIDs = Interests.getIDs(interests);
      updateData.interestIDs = interestIDs;
    }
    if (shortName) {
      updateData.shortName = shortName;
    }
    if (num) {
      updateData.num = num;
    }
    if (creditHrs) {
      updateData.creditHrs = creditHrs;
    }
    if (syllabus) {
      updateData.syllabus = syllabus;
    }
    if (_.isBoolean(repeatable)) {
      updateData.repeatable = repeatable;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
      const profileCourses = ProfileCourses.find({ courseID: docID }).fetch();
      profileCourses.forEach((pc) => ProfileCourses.update(pc._id, { retired }));
      const reviews = Reviews.find({ revieweeID: docID }).fetch();
      reviews.forEach((review) => Reviews.update(review._id, { retired }));
      const course = this.findDoc(docID);
      const teasers = Teasers.find({ targetSlugID: course.slugID }).fetch();
      teasers.forEach((teaser) => Teasers.update(teaser._id, { retired }));
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Course.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Course, or if this course has any associated course instances.
   */
  public removeIt(instance: string) {
    // console.log('CourseCollection.removeIt', instance);
    const docID = this.getID(instance);
    // Check that this is not referenced by any Course Instance.
    CourseInstances.find().map((courseInstance) => {
      if (courseInstance.courseID === docID) {
        throw new Meteor.Error(`Course ${instance} is referenced by a course instance ${courseInstance}.`);
      }
      return true;
    });
    // Remove all the ProfileCourses associated with this course.
    const profileCourses = ProfileCourses.find({ courseID: docID }).fetch();
    profileCourses.forEach(pc => ProfileCourses.removeIt(pc._id));
    // Now remove the Course.
    return super.removeIt(docID);
  }

  /**
   * Returns true if Course has the specified interest.
   * @param course The user (docID or slug)
   * @param interest The Interest (docID or slug).
   * @returns {boolean} True if the course has the associated Interest.
   * @throws { Meteor.Error } If course is not a course or interest is not a Interest.
   */
  public hasInterest(course: string, interest: string) {
    const interestID = Interests.getID(interest);
    const doc = this.findDoc(course);
    return (((doc.interestIDs).includes(interestID)));
  }

  /**
   * Returns a list of Course names corresponding to the passed list of Course docIDs.
   * @param instanceIDs A list of Course docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  public findNames(instanceIDs: string[]) {
    // console.log('Courses.findNames(%o)', instanceIDs);
    return instanceIDs.map((instanceID) => this.getName(instanceID));
  }

  /**
   * Courses have names, but they also have a method 'getName' that returns the `${num}: ${shortName}`. This method
   * will return the doc that has that getName.
   * @param { String | Object } name Either the docID, or an object selector, or the 'name' field value.
   * @returns { Object } The document associated with name.
   * @throws { Meteor.Error } If the document cannot be found.
   */
  public findDoc(name: string | { [key: string]: unknown } | { name } | { _id: string; } | { username: string; }) {
    if (_.isNull(name) || _.isUndefined(name)) {
      throw new Meteor.Error(`${name} is not a defined ${this.type}`);
    }
    const doc = (
      this.collection.findOne(name) ||
      this.collection.findOne({ name }) ||
      this.collection.findOne({ _id: name }) ||
      this.collection.findOne({ username: name })) ||
      // last chance we were given the getName name.
      this.findDocByName(name as string);
    if (!doc) {
      if (typeof name !== 'string') {
        throw new Meteor.Error(`${JSON.stringify(name)} is not a defined ${this.type}`);
      } else {
        throw new Meteor.Error(`${name} is not a defined ${this.type}`);
      }
    }
    return doc;
  }


  /**
   * Returns a list of CareerGoals that have common interests.
   * @param {string} docIdOrSlug a course ID or slug.
   * @return {CareerGoals[]} CareerGoals that share the interests.
   */
  public findRelatedCareerGoals(docIdOrSlug: string): CareerGoal[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const goals = CareerGoals.findNonRetired();
    return goals.filter((goal) => goal.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns a list of Internships that have common interests.
   * @param {string} docIdOrSlug a course ID or slug.
   * @return {Internship[]} Internships that share the interests.
   */
  public findRelatedInternships(docIdOrSlug: string): Internship[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const internships = Internships.findNonRetired();
    return internships.filter((internship) => internship.interestIDs.filter(x => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns a list of the Opportunities that have common interests.
   * @param {string} docIdOrSlug a course ID or slug.
   * @return {Opportunity[]} Opportunities that share the interests.
   */
  public findRelatedOpportunities(docIdOrSlug: string): Opportunity[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const opportunities = Opportunities.findNonRetired();
    return opportunities.filter((opp) => opp.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID and interestIDs.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find({}, {}).forEach((doc) => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      doc.interestIDs.forEach((interestID) => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the Course docID in a format acceptable to define().
   * @param docID The docID of a Course.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID): CourseDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const shortName = doc.shortName;
    const slug = Slugs.getNameFromID(doc.slugID);
    const num = doc.num;
    const description = doc.description;
    const creditHrs = doc.creditHrs;
    const interests = doc.interestIDs.map((interestID) => Interests.findSlugByID(interestID));
    const syllabus = doc.syllabus;
    const repeatable = doc.repeatable;
    const retired = doc.retired;
    return { name, shortName, slug, num, description, creditHrs, interests, syllabus, repeatable, retired };
  }

  public toString(docID: string): string {
    const course = this.findDoc(docID);
    return `${course.num}: ${course.name}`;
  }

  /**
   * Returns the name of the ID or slug.
   * @param {string} docIdOrSlug an ID or slug.
   * @return {string} Course number and short name.
   */
  public getName(docIdOrSlug: string): string {
    const courseID = this.getID(docIdOrSlug);
    const course =  this.findDoc(courseID);
    return `${course.num}: ${course.shortName}`;
  }

  public findDocByName(name: string): Course {
    const num = this.findCourseNumberByName(name);
    return this.findDoc({ num });
  }

  /**
   * Returns the course number of the course name
   * @param {string} name
   * @returns {string}
   */
  public findCourseNumberByName(name: string): string {
    return name.substring(0, name.indexOf(':'));
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/course
 */
export const Courses = new CourseCollection();
