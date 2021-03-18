import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import {
  buildSimpleName,
  complexChoiceToArray,
  isSimpleChoice,
  isSingleChoice,
  isXXChoice,
  getSimpleChoiceNumber,
} from './PlanChoiceUtilities';
import { PlanChoiceDefine, PlanChoiceUpdate } from '../../typings/radgrad';
import { IPlanChoiceType, PlanChoiceType } from './PlanChoiceType';
import { Courses } from '../course/CourseCollection';

/**
 * Represents a choice in an academic plan.
 * @extends api/base.BaseCollection
 * @memberOf api/degree-plan
 */
export class PlanChoiceCollection extends BaseCollection {

  /**
   * Creates a plan choice.
   */
  constructor() {
    super('PlanChoice', new SimpleSchema({
      choice: String, // this is the choice such as ics111 or ics_313,ics_361
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      choice: String, // this is the choice such as ics111 or ics_313,ics_361
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      choice: { type: String, optional: true }, // this is the choice such as ics111 or ics_313,ics_361
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a PlanChoice.
   * @example
   * PlanChoices.define({ 'ics_312,ics_331-1' });
   * Defines the choice of ICS 312 or ICS 331.
   * @param choice
   * @param {boolean} retired, (optional) defaults to false.
   * @returns {*}
   */
  public define({ choice, retired = false }: PlanChoiceDefine) {
    const doc = this.collection.findOne({ choice });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ choice, retired });
  }

  /**
   * Updates this PlanChoice.
   * @param docID The docID associated with this plan choice.
   * @param choice the updated choice.
   */
  public update(docID: string, { choice, retired }: PlanChoiceUpdate) {
    this.assertDefined(docID);
    const updateData: PlanChoiceUpdate = {};
    if (choice) {
      updateData.choice = choice;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Creates a human readable string representation of the choice.
   * @param planChoice
   * @returns {string}
   */
  public toString(planChoice: string) {
    let ret = '';
    let slug;
    const countIndex = planChoice.indexOf('-');
    if (countIndex === -1) {
      slug = planChoice;
    } else {
      slug = planChoice.substring(0, countIndex);
    }
    while (slug.length > 0) {
      let temp;
      let index;
      if (slug.startsWith('(')) {
        index = slug.indexOf(')');
        temp = slug.substring(1, index);
        ret = `${ret}(${buildSimpleName(temp)}) or `;
        if (index < slug.length - 2) {
          slug = slug.substring(index + 2); // skip over the ,
        } else {
          slug = '';
        }
      } else
      if (slug.indexOf(',') !== -1) {
        index = slug.indexOf(',');
        temp = slug.substring(0, index);
        slug = slug.substring(index + 1);
        ret = `${ret}${buildSimpleName(temp)} or `;
      } else {
        temp = slug;
        slug = '';
        ret = `${ret}${buildSimpleName(temp)} or `;
      }
    }
    return ret.substring(0, ret.length - 4);
  }

  public getPlanChoiceType(choice: string): IPlanChoiceType {
    if (isXXChoice(choice)) {
      return PlanChoiceType.XPLUS;
    }
    if (isSingleChoice(choice)) {
      return PlanChoiceType.SINGLE;
    }
    if (isSimpleChoice(choice)) {
      return PlanChoiceType.SIMPLE;
    }
    return PlanChoiceType.COMPLEX;
  }

  public isGraduateChoice(planChoice: string): boolean {
    const simpleChoices = complexChoiceToArray(planChoice);
    let retVal = false;
    simpleChoices.forEach((choice) => {
      const planNumberStr = getSimpleChoiceNumber(choice);
      const planNumber = parseInt(planNumberStr, 10);
      if (planNumber > 500) {
        retVal = true;
      }
    });
    return retVal;
  }

  public satisfiesPlanChoice(planChoice: string, courseSlug: string): boolean {
    if (this.getPlanChoiceType(planChoice) === PlanChoiceType.XPLUS) {
      const planNumberStr = getSimpleChoiceNumber(planChoice);
      const planNumber = parseInt(planNumberStr.substring(0, planNumberStr.length - 1), 10);
      const courseNumber = parseInt(getSimpleChoiceNumber(courseSlug), 10);
      return courseNumber >= planNumber;
    }
    const simpleChoices = complexChoiceToArray(planChoice);
    let returnVal = false;
    simpleChoices.forEach((choice) => {
      if (this.getPlanChoiceType(choice) === PlanChoiceType.XPLUS) {
        const planNumberStr = getSimpleChoiceNumber(choice);
        const planNumber = parseInt(planNumberStr.substring(0, planNumberStr.length - 1), 10);
        const courseNumber = parseInt(getSimpleChoiceNumber(courseSlug), 10);
        if (courseNumber >= planNumber) {
          returnVal = true;
        }
      } else if (choice.includes(courseSlug)) {
        returnVal = true;
      }
    });
    return returnVal;
  }

  /**
   * Returns an empty array (no integrity checking done on this collection).
   * This method will ensure that there is a single choice for each of the non retired courses.
   * @returns {Array} An empty array.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (this.getPlanChoiceType(doc.choice) !== PlanChoiceType.XPLUS) {
        const courseSlugs = complexChoiceToArray(doc.choice);
        courseSlugs.forEach((slug) => {
          if (!Courses.isDefined(slug)) {
            problems.push(`Plan choice ${doc.choice} has undefined course slug ${slug}.`);
          }
        });
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the PlanChoice docID in a format acceptable to define().
   * @param docID The docID of a PlanChoice.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): PlanChoiceDefine {
    const doc = this.findDoc(docID);
    const choice = doc.choice;
    const retired = doc.retired;
    return { choice, retired };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const PlanChoices = new PlanChoiceCollection();
