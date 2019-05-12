import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Slugs } from '../slug/SlugCollection';
import { Interests } from '../interest/InterestCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { ICourseDefine, ICourseUpdate } from '../../typings/radgrad'; // eslint-disable-line
import { isSingleChoice } from '../degree-plan/PlanChoiceUtilities';

/**
 * Represents a specific course, such as "ICS 311".
 * To represent a specific course for a specific academicTerm, use CourseInstance.
 * @memberOf api/course
 * @extends api/base.BaseSlugCollection
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
      prerequisites: [String],
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      name: String,
      shortName: { type: String, optional: true },
      slug: String,
      description: String,
      creditHrs: { type: SimpleSchema.Integer, optional: true },
      interests: [String],
      syllabus: String,
      prerequisites: [String],
      retired: { type: Boolean, optional: true },
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
      retired: { type: Boolean, optional: true },
    });
    this.unInterestingSlug = 'other';
  }

  /**
   * Defines a new Course.
   * @example
   * Courses.define({ name: 'Introduction to the theory and practice of scripting',
   *                  shortName: 'Intro to Scripting',
   *                  slug: 'ics215',
   *                  num: 'ICS 215',
   *                  description: 'Introduction to scripting languages for the integration of applications.',
   *                  creditHrs: 4,
   *                  interests: ['perl', 'javascript', 'ruby'],
   *                  syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
   *                  prerequisites: ['ics211'] });
   * @param { Object } description Object with keys name, shortName, slug, num, description, creditHrs,
   *                   interests, syllabus, and prerequisites.
   * @param name is the official course name.
   * @param shortName is an optional abbreviation. Defaults to name.
   * @param slug must not be previously defined.
   * @param num the course number.
   * @param creditHrs is optional and defaults to 3. If supplied, must be a num between 1 and 15.
   * @param interests is a (possibly empty) array of defined interest slugs or interestIDs.
   * @param syllabus is optional. If supplied, should be a URL.
   * @param prerequisites is optional. If supplied, must be an array of previously defined Course slugs or courseIDs.
   * @param retired is optional, defaults to false.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest or invalid creditHrs.
   * @returns The newly created docID.
   */
  public define({ name, shortName = name, slug, num, description, creditHrs = 3, interests = [], syllabus, prerequisites = [], retired = false }: ICourseDefine) {
    // Get Interests, throw error if any of them are not found.
    const interestIDs = Interests.getIDs(interests);
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Make sure creditHrs is a num between 1 and 15.
    if (!(typeof creditHrs === 'number') || (creditHrs < 1) || (creditHrs > 15)) {
      throw new Meteor.Error(`CreditHrs ${creditHrs} is not a number between 1 and 15.`);
    }
    if (!Array.isArray(prerequisites)) {
      throw new Meteor.Error(`Prerequisites ${prerequisites} is not an array.`);
    }
    // Currently we don't dump the DB is a way that prevents forward referencing of prereqs, so we
    // can't check the validity of prereqs during a define, such as with:
    //   _.each(prerequisites, (prerequisite) => this.getID(prerequisite));
    // Instead, we check that prereqs are valid as part of checkIntegrity.
    const courseID =
      this.collection.insert({
        name, shortName, slugID, num, description, creditHrs, interestIDs, syllabus, prerequisites, retired,
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
   * @param retired optional boolean.
   */
  public update(instance: string, { name, shortName, num, description, creditHrs, interests, prerequisites, syllabus, retired }: ICourseUpdate) {
    const docID = this.getID(instance);
    const updateData: {
      name?: string;
      description?: string;
      interestIDs?: [string];
      shortName?: string;
      num?: string;
      creditHrs?: number;
      syllabus?: string;
      prerequisites?: string[];
      retired?: boolean;
    } = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (interests) {
      const interestIDs = Interests.getIDs(interests);
      updateData.interestIDs = interestIDs;
    }
    if (shortName) {
      updateData.shortName = shortName;
    }
    if (_.isNumber(num)) {
      updateData.num = num;
    }
    if (creditHrs) {
      updateData.creditHrs = creditHrs;
    }
    if (syllabus) {
      updateData.syllabus = syllabus;
    }
    if (prerequisites) {
      if (!Array.isArray(prerequisites)) {
        throw new Meteor.Error(`Prerequisites ${prerequisites} is not an Array.`);
      }
      _.forEach(prerequisites, (prereq) => {
        if (!this.hasSlug(prereq)) {
          throw new Meteor.Error(`Prerequisite ${prereq} is not a slug for a course.`);
        }
      });
      updateData.prerequisites = prerequisites;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Course.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Course, or if this course has any associated course instances.
   */
  public removeIt(instance: string) {
    const docID = this.getID(instance);
    // Check that this is not referenced by any Course Instance.
    CourseInstances.find().map((courseInstance) => {
      if (courseInstance.courseID === docID) {
        throw new Meteor.Error(`Course ${instance} is referenced by a course instance ${courseInstance}.`);
      }
      return true;
    });
    // OK to delete. First remove any Feeds that reference this course.
    Feeds.find({ courseID: docID }).map((feed) => Feeds.removeIt(feed._id));
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
    return _.includes(doc.interestIDs, interestID);
  }

  public getSlug(courseID: string) {
    this.assertDefined(courseID);
    const courseDoc = this.findDoc(courseID);
    return Slugs.findDoc(courseDoc.slugID).name;
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
      _.forEach(doc.interestIDs, (interestID) => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
      _.forEach(doc.prerequisites, (prereq) => {
        if (isSingleChoice(prereq)) {
          if (!this.hasSlug(prereq)) {
            problems.push(`Bad course prerequisite slug: ${prereq}`);
          }
        } else {
          const slugs = prereq.split(',');
          _.forEach(slugs, (slug) => {
            if (!this.hasSlug(slug)) {
              problems.push(`Bad course prerequisite slug: ${slug}`);
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
  public dumpOne(docID): ICourseDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const shortName = doc.shortName;
    const slug = Slugs.getNameFromID(doc.slugID);
    const num = doc.num;
    const description = doc.description;
    const creditHrs = doc.creditHrs;
    const interests = _.map(doc.interestIDs, (interestID) => Interests.findSlugByID(interestID));
    const syllabus = doc.syllabus;
    const prerequisites = doc.prerequisites;
    const retired = doc.retired;
    return {
      name, shortName, slug, num, description, creditHrs, interests, syllabus, prerequisites, retired,
    };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/course
 */
export const Courses = new CourseCollection();
