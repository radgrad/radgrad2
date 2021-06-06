import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import _ from 'lodash';
import { Slugs } from '../slug/SlugCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { AcademicTerm, AcademicTermDefine, AcademicTermUpdate } from '../../typings/radgrad';
import { RadGradProperties } from '../radgrad/RadGradProperties';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';

/**
 * Represents a specific academicTerm, such as "Spring, 2016", "Fall, 2017", or "Summer, 2015".
 * @extends api/base.BaseSlugCollection
 * @memberOf api/academic-term
 */
class AcademicTermCollection extends BaseSlugCollection {
  public SPRING: string;

  public SUMMER: string;

  public FALL: string;

  public WINTER: string;

  public readonly terms: string[];

  private readonly fallStart: number;

  private readonly springStart: number;

  private readonly summerStart: number;

  /**
   * Creates the AcademicTerm collection.
   */
  constructor() {
    super('AcademicTerm', new SimpleSchema({
      term: { type: String },
      year: { type: SimpleSchema.Integer, min: 1991, max: 2050, defaultValue: moment().year() },
      termNumber: { type: Number },
      slugID: { type: SimpleSchema.RegEx.Id },
      retired: { type: Boolean, optional: true },
    }));
    this.SPRING = 'Spring';
    this.SUMMER = 'Summer';
    this.FALL = 'Fall';
    this.WINTER = 'Winter';
    // console.log(settingsDoc, Meteor.settings);
    if (RadGradProperties.getQuarterSystem()) {
      this.terms = [this.FALL, this.WINTER, this.SPRING, this.SUMMER];
      this.fallStart = parseInt(moment('09-26-2015', 'MM-DD-YYYY').format('DDD'), 10);
      this.springStart = parseInt(moment('04-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
      this.summerStart = parseInt(moment('06-20-2015', 'MM-DD-YYYY').format('DDD'), 10);
    } else {
      this.terms = [this.FALL, this.SPRING, this.SUMMER];
      this.fallStart = parseInt(moment('08-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
      this.springStart = parseInt(moment('01-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
      this.summerStart = parseInt(moment('05-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
    }
    this.defineSchema = new SimpleSchema({
      term: { type: String, allowedValues: this.terms, defaultValue: this.FALL },
      year: {
        type: SimpleSchema.Integer,
        min: moment().year() - 5,
        max: moment().year() + 10,
        defaultValue: moment().year(),
      },
    });
    this.updateSchema = new SimpleSchema({
      retired: Boolean,
    });
  }

  /**
   * Returns an object representing the AcademicTerm docID in a format acceptable to define().
   * @param docID The docID of a Academic Term.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): AcademicTermDefine {
    const doc = this.findDoc(docID);
    const term = doc.term;
    const year = doc.year;
    const retired = doc.retired;
    return { term, year, retired };
  }

  /**
   * Retrieves the docID for the specified Academic Term, or defines it if not yet present.
   * Implicitly defines the corresponding slug: Spring, 2016 academicTerm is "Spring-2016".
   * @example
   * AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
   * @param { Object } Object with keys term, academicTerm.
   * Term must be one of AcademicTerms.FALL, AcademicTerms.SPRING, or AcademicTerms.SUMMER.
   * Year must be between 1990 and 2050.
   * @throws { Meteor.Error } If the term or year are not correctly specified.
   * @returns The docID for this academicTerm instance.
   */
  public define({ term, year, retired = false }: AcademicTermDefine) {
    // Check that term and year are valid.
    if (this.terms.indexOf(term) < 0) {
      throw new Meteor.Error(`Invalid term: ${term}`);
    }
    if ((year < 1990) || (year > 2050)) {
      throw new Meteor.Error(`Invalid year: ${year}`);
    }

    // Return immediately if academicTerm is already defined.
    const doc = this.collection.findOne({ term, year });
    if (doc) {
      return doc._id;
    }

    // Otherwise define a new academicTerm and add it to the collection if successful.

    // Compute termNumber, another number that puts academicTerms into chronological order.
    // Epoch is Fall-2010
    let termNumber = 0;
    const yearDiff = year - 2010;
    if (RadGradProperties.getQuarterSystem()) {
      if (term === this.WINTER) {
        termNumber = (4 * yearDiff) - 3;
      } else if (term === this.SPRING) {
        termNumber = (4 * yearDiff) - 2;
      } else if (term === this.SUMMER) {
        termNumber = (4 * yearDiff) - 1;
      } else {
        termNumber = 4 * yearDiff;
      }
    } else if (term === this.SPRING) {
      termNumber = (3 * yearDiff) - 2;
    } else if (term === this.SUMMER) {
      termNumber = (3 * yearDiff) - 1;
    } else {
      termNumber = 3 * yearDiff;
    }

    // Determine what the slug looks like.
    const slug = `${term}-${year}`;

    if (Slugs.isDefined(slug)) {
      throw new Meteor.Error(`Slug is already defined for undefined AcademicTerm: ${slug}`);
    }
    const slugID = Slugs.define({ name: slug, entityName: 'AcademicTerm' });
    const termID = this.collection.insert({ term, year, termNumber, slugID, retired });
    Slugs.updateEntityID(slugID, termID);
    return termID;
  }

  /**
   * Updates the retired flag.
   * @param docID the id of the academicTerm.
   * @param retired optional boolean.
   */
  public update(docID, { retired }: AcademicTermUpdate) {
    // console.log(`AcademicTerm.update(${docID}, ${retired})`);
    const updateData: AcademicTermUpdate = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
      this.collection.update(docID, { $set: updateData });
    }
  }

  /**
   * Ensures the passed object is a Academic Term instance.
   * @param term Should be a defined termID or academic term doc.
   * @throws {Meteor.Error} If academicTerm is not a Academic Term.
   */
  public assertAcademicTerm(term: string) {
    if (!term || !this.isDefined(term)) {
      throw new Meteor.Error(`${term} is not a valid Academic Term.`);
    }
  }

  public findIdBySlug(slug): { optional: boolean; type: any } | string | any {
    // console.log('findIdBySlug', slug);
    if (this.isDefined(slug)) {
      return super.findIdBySlug(slug);
    }
    const split = slug.split('-');
    const term = split[0];
    const year = parseInt(split[1], 10);
    return this.define({ term, year });
  }

  /**
   * Returns the termID associated with the current academicTerm based upon the current timestamp.
   * See AcademicTerms.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  public getCurrentTermID() {
    const year = moment().year();
    const day = moment().dayOfYear();
    let term = '';
    if (RadGradProperties.getQuarterSystem()) {
      if (day >= this.fallStart) {
        term = this.FALL;
      } else if (day >= this.summerStart) {
        term = this.SUMMER;
      } else if (day >= this.springStart) {
        term = this.SPRING;
      } else {
        term = this.WINTER;
      }
    } else if (day >= this.fallStart) {
      term = this.FALL;
    } else if (day >= this.summerStart) {
      term = this.SUMMER;
    } else {
      term = this.SPRING;
    }
    return this.define({ term, year });
  }

  public getAcademicTermFromToString(termToString: string) {
    const split = termToString.split(' ');
    if (split.length !== 2) {
      throw new Meteor.Error('Invalid AcademicTerm toString value');
    }
    const term = split[0];
    const year = parseInt(split[1], 10);
    return this.findDoc({ term, year });
  }

  /**
   * Returns true if the passed academicTerm occurs now or in the future.
   * @param term The academic term (slug or termID).
   * @returns True if academic term is in the future.
   */
  public isUpcomingTerm(term: string) {
    const termID = this.getID(term);
    return this.findDoc(termID).termNumber >= this.getCurrentAcademicTermDoc().termNumber;
  }

  /**
   * Returns the academicTerm doc associated with the current academicTerm based upon the current timestamp.
   * See AcademicTerms.FALL_START_DATE, SPRING_START_DATE, and SUMMER_START_DATE.
   */
  public getCurrentAcademicTermDoc() {
    const id = this.getCurrentTermID();
    return this.findDoc(id);
  }

  public getStartOfCurrentAcademicYearTerm(): AcademicTerm {
    const currentTerm = this.getCurrentAcademicTermDoc();
    const term = currentTerm.term;
    const year = currentTerm.year;
    if (term === this.SPRING || term === this.SUMMER) {
      return this.find({ year: year - 1, term: this.FALL }).fetch()[0];
    }
    return this.find({ year, term: this.FALL }).fetch()[0];
  }

  /**
   * Returns the current academic term number.
   * @return {number} the current academic term number.
   */
  public getCurrentAcademicTermNumber(): number {
    return this.getCurrentAcademicTermDoc().termNumber;
  }

  /**
   * Returns the academic terms for the next numYears. It returns the terms based upon academic year.
   * For example if the current term is Spring 2020 and numYears is 2. This method will return [Spring 2020, Summer 2020,
   * Fall 2020, Spring 2021, Summer 2021]
   * @param {number} numYears
   * @return {AcademicTerm[]}
   */
  public getNextYears(numYears: number): AcademicTerm[] {
    const numTermsPerYear = RadGradProperties.getQuarterSystem() ? 4 : 3;
    const currentTermDoc = this.getCurrentAcademicTermDoc();
    const currentTermNumber = currentTermDoc.termNumber;
    const startOfYear = this.getStartOfCurrentAcademicYearTerm();
    const diff = currentTermNumber - startOfYear.termNumber;
    const after = currentTermNumber;
    const before = currentTermNumber + numYears * numTermsPerYear - diff;
    return this.findNonRetired({ $and: [{ termNumber: { $gte: after } }, { termNumber: { $lt: before } }] }, { sort: { termNumber: 1 } });
  }

  public getAcademicYearLabel(termID: string): string {
    const termDoc = this.findDoc(termID);
    if (termDoc.term === this.SPRING || termDoc.term === this.SUMMER) {
      return `${termDoc.year - 1}-${termDoc.year}`;
    }
    return `${termDoc.year}-${termDoc.year + 1}`;
  }

  /**
   * Returns the academicTerm ID corresponding to the given date.
   * @param date The date as a string. Must be able to be parsed by moment();
   * @returns {String} The termID that the date falls in.
   */
  public getAcademicTerm(date: string | Date) {
    const d = moment(date);
    const year = d.year();
    const day = d.dayOfYear();
    let term = '';
    if (day >= this.fallStart) {
      term = this.FALL;
    } else if (day >= this.summerStart) {
      term = this.SUMMER;
    } else if (day >= this.springStart) {
      term = this.SPRING;
    } else {
      term = this.WINTER;
    }
    return this.define({ term, year });
  }

  /**
   * Returns the academicTerm document corresponding to the given date.
   * @param date The date.
   * @returns Object The academicTerm that the date falls in.
   */
  public getAcademicTermDoc(date: string) {
    const id = this.getAcademicTerm(date);
    return this.findDoc(id);
  }

  /**
   * Returns the academicTerm docID associated with the passed academicTerm slug or docID.
   * If the academicTerm does not exist, it is defined.
   * @param academicTerm The Slug or docID associated with a academicTerm
   * @returns The academicTerm ID.
   * @throws { Meteor.Error } If the passed academicTerm is not a valid academicTerm slug.
   */
  public getID(academicTerm: string) {
    // console.log('getID', academicTerm);
    if (this.isDefined(academicTerm)) {
      // console.log('isDefined');
      return super.getID(academicTerm);
    }
    // Otherwise academicTerm should be a slug.  Try to define it.
    const split = academicTerm.split('-');
    const term = split[0];
    const year = parseInt(split[1], 10);
    // console.log('define', term, year);
    return this.define({ term, year });
  }

  /**
   * Returns the passed academicTerm, formatted as a string.
   * @param termID The academicTerm.
   * @param nospace If true, then term and year are concatenated without a space in between.
   * @returns { String } The academicTerm as a string.
   */
  public toString(termID: string, nospace?: boolean) {
    this.assertAcademicTerm(termID);
    const academicTermDoc = this.findDoc(termID);
    return (nospace) ? `${academicTermDoc.term}${academicTermDoc.year}` : `${academicTermDoc.term} ${academicTermDoc.year}`;
  }

  /**
   * Returns a four character "shortname" for a academicTerm and year: Fa18, Sp19, Su20
   * @param termID The academicTerm
   * @returns {string} The shortname.
   */
  public getShortName(termID: string) {
    this.assertAcademicTerm(termID);
    const academicTermDoc = this.findDoc(termID);
    const yearString = `${academicTermDoc.year}`.substring(2, 4);
    const termString = (academicTermDoc.term === 'Fall') ? 'Fall' : academicTermDoc.term.substring(0, 3);
    return `${termString} ${yearString}`;
  }

  /**
   * Remove the Course.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Course, or if this course has any associated course instances.
   */
  public removeIt(instance: string) {
    const docID = this.getID(instance);
    // Check that this term is not referenced by any Opportunity Instance.
    OpportunityInstances.find().map((opportunityInstance) => {
      if (opportunityInstance.termID === docID) {
        throw new Meteor.Error(`AcademicTerm ${instance} referenced by a opportunity instance.`);
      }
      return true;
    });
    // Check that this term in not referenced by any Course Instance
    CourseInstances.find().map((courseInstance) => {
      if (courseInstance.termID === docID) {
        throw new Meteor.Error(`AcademicTerm ${instance} referenced by a course instance.`);
      }
      return true;
    });
    return super.removeIt(docID);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find({}, {}).forEach((doc) => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
    });
    return problems;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/academicTerm.AcademicTermCollection}
 * @memberOf api/academic-term
 */
export const AcademicTerms = new AcademicTermCollection();
