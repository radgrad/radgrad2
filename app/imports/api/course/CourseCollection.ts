import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Reviews } from '../review/ReviewCollection';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { ProfileCourses } from '../user/profile-entries/ProfileCourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { CareerGoal, CourseDefine, CourseUpdate, Opportunity } from '../../typings/radgrad';
import { isSingleChoice, complexChoiceToArray } from '../degree-plan/PlanChoiceUtilities';
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
      corequisites: { type: Array },
      'corequisites.$': String,
      prerequisites: { type: Array },
      'prerequisites.$': String,
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
      corequisites: { type: Array, optional: true },
      'corequisites.$': String,
      prerequisites: { type: Array, optional: true },
      'prerequisites.$': String,
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
      prerequisites: { type: Array, optional: true },
      'prerequisites.$': String,
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
   *                  prerequisites: ['ics_211'] });
   * @param { Object } description Object with keys name, shortName, slug, num, description, creditHrs,
   *                   interests, syllabus, and prerequisites.
   * @param name is the official course name.
   * @param shortName is an optional abbreviation. Defaults to name.
   * @param slug must not be previously defined.
   * @param num the course number.
   * @param creditHrs is optional and defaults to 3. If supplied, must be a num between 1 and 15.
   * @param interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @param syllabus is optional. If supplied, should be a URL.
   * @param corequisites is optional. If supplied, must be an array of Course slugs or courseIDs.
   * @param prerequisites is optional. If supplied, must be an array of previously defined Course slugs or courseIDs.
   * @param repeatable is optional, defaults to false.
   * @param retired is optional, defaults to false.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest or invalid creditHrs.
   * @returns The newly created docID.
   */
  public define({ name, shortName = name, slug, num, description, creditHrs = 3, interests = [], syllabus, picture, corequisites = [], prerequisites = [], retired = false, repeatable = false }: CourseDefine) {
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
    if (!Array.isArray(prerequisites)) {
      throw new Meteor.Error(`Prerequisites ${prerequisites} is not an array.`);
    }
    // make sure each corequisite has a valid format.
    corequisites.forEach((c) => validateCourseSlugFormat(c));
    // make sure each prerequisite has a valid format.
    prerequisites.forEach((p) => validateCourseSlugFormat(p));
    // Currently we don't dump the DB is a way that prevents forward referencing of prereqs, so we
    // can't check the validity of prereqs during a define, such as with:
    //   _.each(prerequisites, (prerequisite) => this.getID(prerequisite));
    // Instead, we check that prereqs are valid as part of checkIntegrity.
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
        corequisites,
        prerequisites,
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
   * @param prerequisites An array of course slugs. (optional)
   * @param repeatable optional boolean.
   * @param retired optional boolean.
   */
  public update(instance: string, { name, shortName, num, description, creditHrs, interests, picture, corequisites, prerequisites, syllabus, retired, repeatable }: CourseUpdate) {
    const docID = this.getID(instance);
    const updateData: {
      name?: string;
      description?: string;
      interestIDs?: string[];
      shortName?: string;
      num?: string;
      creditHrs?: number;
      syllabus?: string;
      corequisites?: string[];
      prerequisites?: string[];
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
    if (corequisites) {
      if (!Array.isArray(corequisites)) {
        throw new Meteor.Error(`Corequisites ${corequisites} is not an Array.`);
      }
      corequisites.forEach((coreq) => {
        if (!this.hasSlug(coreq)) {
          throw new Meteor.Error(`Corequisite ${coreq} is not a slug for a course.`);
        }
      });
      updateData.corequisites = corequisites;
    }
    if (prerequisites) {
      if (!Array.isArray(prerequisites)) {
        throw new Meteor.Error(`Prerequisites ${prerequisites} is not an Array.`);
      }
      prerequisites.forEach((prereq) => {
        if (!this.hasSlug(prereq)) {
          throw new Meteor.Error(`Prerequisite ${prereq} is not a slug for a course.`);
        }
      });
      updateData.prerequisites = prerequisites;
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
    return instanceIDs.map((instanceID) => this.findDoc(instanceID).name);
  }


  /**
   * Returns a list of CareerGoals that have common interests.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {CareerGoals[]} Courses that have the given interest.
   */
  public findRelatedCareerGoals(docIdOrSlug: string): CareerGoal[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const goals = CareerGoals.findNonRetired();
    return goals.filter((goal) => goal.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns a list of the Opportunities that have common interests.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {Opportunity[]} Opportunities that have the given interest.
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
      doc.corequisites.forEach((coreq) => {
        if (isSingleChoice(coreq)) {
          if (!this.hasSlug(coreq)) {
            problems.push(`Bad course corequisite slug: ${coreq}`);
          }
        } else {
          const slugs = complexChoiceToArray(coreq);
          slugs.forEach((slug) => {
            if (!this.hasSlug(slug)) {
              problems.push(`Bad course corequisite slug in or: ${slug}`);
            }
          });
        }
      });
      doc.prerequisites.forEach((prereq) => {
        if (isSingleChoice(prereq)) {
          if (!this.hasSlug(prereq)) {
            problems.push(`Bad course prerequisite slug: ${prereq}`);
          }
        } else {
          const slugs = complexChoiceToArray(prereq);
          slugs.forEach((slug) => {
            if (!this.hasSlug(slug)) {
              problems.push(`Bad course prerequisite slug in or: ${slug}`);
            }
          });
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
    const corequisites = doc.corequisites;
    const prerequisites = doc.prerequisites;
    const repeatable = doc.repeatable;
    const retired = doc.retired;
    return { name, shortName, slug, num, description, creditHrs, interests, syllabus, corequisites, prerequisites, repeatable, retired };
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
    return `${course.num} ${course.shortName}`;
  }

  public getPrerequisiteSlugs(docIdOrSlug: string): string[] {
    const courseID = this.getID(docIdOrSlug);
    const course =  this.findDoc(courseID);
    const prerequisiteSlugs = [];
    course.prerequisites.forEach((choice) => {
      const courseArr = complexChoiceToArray(choice);
      courseArr.forEach((slug) => prerequisiteSlugs.push(slug));
    });
    return prerequisiteSlugs;
  }

  public getCorequisiteSlugs(docIdOrSlug: string): string[] {
    const courseID = this.getID(docIdOrSlug);
    const course =  this.findDoc(courseID);
    const corequisiteSlugs = [];
    course.corequisites.forEach((choice) => {
      const courseArr = complexChoiceToArray(choice);
      courseArr.forEach((slug) => corequisiteSlugs.push(slug));
    });
    return corequisiteSlugs;
  }

  /**
   * Returns the course number of the course name
   * @param {string} name
   * @returns {string}
   */
  public findCourseNumberByName(name: string): string {
    const course = this.findDoc(name);
    return course.num;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/course
 */
export const Courses = new CourseCollection();
