import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Slugs } from '../slug/SlugCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { Interests } from '../interest/InterestCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { assertICE, iceSchema } from '../ice/IceProcessor';
import { CareerGoal, Course, OpportunityDefine, OpportunityUpdate, OpportunityUpdateData } from '../../typings/radgrad';

export const defaultProfilePicture = '/images/radgrad_logo.png';

/**
 * Represents an Opportunity, such as "LiveWire Internship".
 * To represent an Opportunity taken by a specific student in a specific academicTerm, use OpportunityInstance.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/opportunity
 */
class OpportunityCollection extends BaseSlugCollection {

  /**
   * Creates the Opportunity collection.
   */
  constructor() {
    super('Opportunity', new SimpleSchema({
      name: { type: String },
      slugID: { type: String },
      description: { type: String },
      opportunityTypeID: { type: SimpleSchema.RegEx.Id },
      sponsorID: { type: SimpleSchema.RegEx.Id },
      interestIDs: [SimpleSchema.RegEx.Id],
      termIDs: [SimpleSchema.RegEx.Id],
      timestamp: { type: Date },
      // Optional data
      eventDate: { type: Date, optional: true },
      ice: { type: iceSchema, optional: true },
      picture: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      name: String,
      slug: String,
      description: String,
      opportunityType: String,
      sponsor: String,
      terms: Array,
      'terms.$': String,
      timestamp: { type: Date },
      eventDate: { type: Date, optional: true },
      ice: { type: iceSchema, optional: true },
      picture: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      name: { type: String, optional: true },
      description: { type: String, optional: true },
      opportunityType: { type: String, optional: true },
      sponsor: { type: String, optional: true },
      terms: { type: Array, optional: true },
      'terms.$': String,
      timestamp: { type: Date, optional: true },
      eventDate: { type: Date, optional: true },
      ice: { type: iceSchema, optional: true },
      picture: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a new Opportunity.
   * @example
   * Opportunities.define({ name: 'ATT Hackathon',
   *                        slug: 'att-hackathon',
   *                        description: 'Programming challenge at Sacred Hearts Academy, $10,000 prize',
   *                        opportunityType: 'event',
   *                        sponsor: 'philipjohnson',
   *                        ice: { i: 10, c: 0, e: 10},
   *                        interests: ['software-engineering'],
   *                        academicTerms: ['Fall-2016', 'Spring-2016', 'Summer-2106'],
   *                      });
   * @param { Object } description Object with keys name, slug, description, opportunityType, sponsor, interests,
   * @param name the name of the opportunity.
   * @param slug must not be previously defined.
   * @param description the description of the opportunity. Can be markdown.
   * @param opportunityType must be defined slug.
   * @param interests must be a (possibly empty) array of interest slugs or IDs.
   * @param academicTerms must be a (possibly empty) array of academicTerm slugs or IDs.
   * @param sponsor must be a User with role 'FACULTY', 'ADVISOR', or 'ADMIN'.
   * @param ice must be a valid ICE object.
   * @param eventDate optional date.
   * @param timestamp the Date timestamp that this Opportunity document was created at.
   * @param picture The URL to the opportunity picture. (optional, defaults to a default picture.)
   * @param retired optional, true if the opportunity is retired.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest, sponsor, opportunityType,
   * or startActive or endActive are not valid.
   * @returns The newly created docID.
   */
  public define({
    name,
    slug,
    description,
    opportunityType,
    sponsor,
    interests,
    academicTerms,
    ice,
    timestamp = moment().toDate(),
    eventDate = null,
    picture = defaultProfilePicture,
    retired = false,
  }: OpportunityDefine) {
    // Get instances, or throw error

    const opportunityTypeID = OpportunityTypes.getID(opportunityType);
    const sponsorID = Users.getID(sponsor);
    Users.assertInRole(sponsorID, [ROLE.FACULTY, ROLE.ADVISOR, ROLE.ADMIN]);
    assertICE(ice);
    const interestIDs = Interests.getIDs(interests);
    // check if slug is defined
    if (Slugs.isSlugForEntity(slug, this.getType())) {
      // console.log(`${slug} is already defined for ${this.getType()}`);
      return Slugs.getEntityID(slug, this.getType());
    }
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const termIDs = AcademicTerms.getIDs(academicTerms);
    let opportunityID;
    if (eventDate !== null) {
      // Define the new Opportunity and its Slug.
      opportunityID = this.collection.insert({
        name, slugID, description, opportunityTypeID, sponsorID,
        interestIDs, termIDs, ice, timestamp, eventDate, retired, picture,
      });
    } else {
      opportunityID = this.collection.insert({
        name, slugID, description, opportunityTypeID, sponsorID,
        interestIDs, termIDs, ice, timestamp, retired, picture,
      });
    }
    Slugs.updateEntityID(slugID, opportunityID);

    // Return the id to the newly created Opportunity.
    return opportunityID;
  }

  /**
   * Update an Opportunity.
   * @param instance The docID or slug associated with this opportunity.
   * @param name a string (optional).
   * @param description a string (optional).
   * @param opportunityType docID or slug (optional).
   * @param sponsor user in role admin, advisor, or faculty. (optional).
   * @param interests array of slugs or IDs, (optional).
   * @param academicTerms array of slugs or IDs, (optional).
   * @param eventDate a Date (optional).
   * @param ice An ICE object (optional).
   * @param retired boolean (optional).
   * @param picture a string (optional).
   */
  public update(instance: string, {
    name,
    description,
    opportunityType,
    sponsor,
    interests,
    academicTerms,
    eventDate,
    ice,
    timestamp,
    retired,
    picture,
  }: OpportunityUpdate) {
    const docID = this.getID(instance);
    const updateData: OpportunityUpdateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    if (opportunityType) {
      updateData.opportunityTypeID = OpportunityTypes.getID(opportunityType);
    }
    if (sponsor) {
      const sponsorID = Users.getID(sponsor);
      Users.assertInRole(sponsorID, [ROLE.FACULTY, ROLE.ADVISOR, ROLE.ADMIN]);
      updateData.sponsorID = sponsorID;
    }
    if (interests) {
      updateData.interestIDs = Interests.getIDs(interests);
    }
    if (academicTerms) {
      updateData.termIDs = AcademicTerms.getIDs(academicTerms);
    }
    // if (eventDate) {
    updateData.eventDate = eventDate;
    // }
    if (ice) {
      assertICE(ice);
      updateData.ice = ice;
    }
    if (timestamp) {
      updateData.timestamp = timestamp;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    if (picture) {
      updateData.picture = picture;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Course.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Course, or if this course has any associated course instances.
   */
  public removeIt(instance: string) {
    // console.log('OpportunityCollection.removeIt', instance);
    const docID = this.getID(instance);
    // Check that this opportunity is not referenced by any Opportunity Instance.
    const instances = OpportunityInstances.find({ opportunityID: docID }).fetch();
    if (instances.length > 0) {
      throw new Meteor.Error(`Opportunity ${instance} is referenced by an OpportunityInstances`);
    }
    // Check that this opportunity is not referenced by any Teaser.
    const oppDoc = this.findDoc(docID);
    const teasers = Teasers.find({ targetSlugID: oppDoc.slugID }).fetch();
    if (teasers.length > 0) {
      throw new Meteor.Error(`Opportunity ${instance} referenced by a teaser.`);
    }
    return super.removeIt(docID);
  }

  /**
   * Asserts that userId is logged in as an Admin, Faculty, or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not in the allowed roles.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
  }

  /**
   * Returns the OpportunityType associated with the Opportunity with the given instanceID.
   * @param instanceID The id of the Opportunity.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getOpportunityTypeDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return OpportunityTypes.findDoc(instance.opportunityTypeID);
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
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!OpportunityTypes.isDefined(doc.opportunityTypeID)) {
        problems.push(`Bad opportunityTypeID: ${doc.opportunityTypeID}`);
      }
      if (!Users.isDefined(doc.sponsorID)) {
        problems.push(`Bad sponsorID: ${doc.sponsorID}`);
      }
      doc.interestIDs.forEach((interestID) => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
      doc.termIDs.forEach((termID) => {
        if (!AcademicTerms.isDefined(termID)) {
          problems.push(`Bad termID: ${termID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns true if Opportunity has the specified interest.
   * @param opportunity The opportunity(docID or slug)
   * @param interest The Interest (docID or slug).
   * @returns {boolean} True if the opportunity has the associated Interest.
   * @throws { Meteor.Error } If opportunity is not a opportunity or interest is not a Interest.
   */
  public hasInterest(opportunity: string, interest: string) {
    const interestID = Interests.getID(interest);
    const doc = this.findDoc(opportunity);
    return _.includes(doc.interestIDs, interestID);
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
   * Returns a list of Courses that have common interests.
   * @param {string} docIdOrSlug an interest ID or slug.
   * @return {Course[]} Courses that have the given interest.
   */
  public findRelatedCourses(docIdOrSlug: string): Course[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const courses = Courses.findNonRetired();
    return courses.filter((course) => course.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns a list of Opportunity names corresponding to the passed list of Opportunity docIDs.
   * @param instanceIDs A list of Opportunity docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  public findNames(instanceIDs: string[]) {
    // console.log('Opportunity.findNames(%o)', instanceIDs);
    return instanceIDs.map((instanceID) => this.findDoc(instanceID).name);
  }

  /**
   * Returns an object representing the Opportunity docID in a format acceptable to define().
   * @param docID The docID of an Opportunity.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): OpportunityDefine {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const slug = Slugs.getNameFromID(doc.slugID);
    const opportunityType = OpportunityTypes.findSlugByID(doc.opportunityTypeID);
    const sponsor = Users.getProfile(doc.sponsorID).username;
    const description = doc.description;
    const ice = doc.ice;
    const interests = doc.interestIDs.map((interestID) => Interests.findSlugByID(interestID));
    const academicTerms = doc.termIDs.map((termID) => AcademicTerms.findSlugByID(termID));
    const eventDate = doc.eventDate;
    const timestamp = doc.timestamp;
    const retired = doc.retired;
    return {
      name,
      slug,
      description,
      opportunityType,
      sponsor,
      ice,
      interests,
      academicTerms,
      eventDate,
      timestamp,
      retired,
    };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/opportunity.OpportunityCollection}
 * @memberOf api/opportunity
 */
export const Opportunities = new OpportunityCollection();
