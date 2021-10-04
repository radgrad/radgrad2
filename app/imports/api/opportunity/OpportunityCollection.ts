import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Internships } from '../internship/InternshipCollection';
import { Reviews } from '../review/ReviewCollection';
import { Slugs } from '../slug/SlugCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { Interests } from '../interest/InterestCollection';
import { ROLE } from '../role/Role';
import { ProfileOpportunities } from '../user/profile-entries/ProfileOpportunityCollection';
import { Users } from '../user/UserCollection';
import { OpportunityTypes } from './OpportunityTypeCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { assertICE, iceSchema } from '../ice/IceProcessor';
import { CareerGoal, Course, Internship, OpportunityDefine, OpportunityUpdate, OpportunityUpdateData } from '../../typings/radgrad';

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
      // Optional data
      eventDate1: { type: Date, optional: true },
      eventDateLabel1: { type: String, optional: true },
      eventDate2: { type: Date, optional: true },
      eventDateLabel2: { type: String, optional: true },
      eventDate3: { type: Date, optional: true },
      eventDateLabel3: { type: String, optional: true },
      eventDate4: { type: Date, optional: true },
      eventDateLabel4: { type: String, optional: true },
      ice: { type: iceSchema, optional: true },
      picture: { type: String, optional: true, defaultValue: 'images/header-panel/header-opportunities.png' },
      retired: { type: Boolean, optional: true },
    }));
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
   *                      });
   * @param { Object } description Object with keys name, slug, description, opportunityType, sponsor, interests,
   * @param name the name of the opportunity.
   * @param slug must not be previously defined.
   * @param description the description of the opportunity. Can be markdown.
   * @param opportunityType must be defined slug.
   * @param interests must be a (possibly empty) array of interest slugs or IDs.
   * @param sponsor must be a User with role 'FACULTY', 'ADVISOR', or 'ADMIN'.
   * @param ice must be a valid ICE object.
   * @param eventDate1
   * @param eventDateLabel1
   * @param eventDate2
   * @param eventDateLabel2
   * @param eventDate3
   * @param eventDateLabel3
   * @param eventDate4
   * @param eventDateLabel4
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
    ice,
    eventDate1,
    eventDateLabel1,
    eventDate2,
    eventDateLabel2,
    eventDate3,
    eventDateLabel3,
    eventDate4,
    eventDateLabel4,
    picture,
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
    const opportunityID = this.collection.insert({
      name, slugID, description, opportunityTypeID, sponsorID,
      interestIDs, ice, eventDate1, eventDateLabel1, eventDate2, eventDateLabel2,
      eventDate3, eventDateLabel3, eventDate4, eventDateLabel4, retired, picture,
    });
    Slugs.updateEntityID(slugID, opportunityID);
    // console.log(opportunityID);
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
   * @param eventDate a Date (optional). // Deprecated
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
    eventDate1,
    eventDateLabel1,
    eventDate2,
    eventDateLabel2,
    eventDate3,
    eventDateLabel3,
    eventDate4,
    eventDateLabel4,
    clearEventDate1,
    clearEventDate2,
    clearEventDate3,
    clearEventDate4,
    ice,
    retired,
    picture,
  }: OpportunityUpdate) {
    // console.log('OpportunityCollection.update');
    const docID = this.getID(instance);
    // const unsetData: any = {};
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
    if (eventDate1) {
      updateData.eventDate1 = eventDate1;
    }
    if (_.isString(eventDateLabel1)) {
      updateData.eventDateLabel1 = eventDateLabel1;
    }
    if (eventDate2) {
      updateData.eventDate2 = eventDate2;
    }
    if (_.isString(eventDateLabel2)) {
      updateData.eventDateLabel2 = eventDateLabel2;
    }
    if (eventDate3) {
      updateData.eventDate3 = eventDate3;
    }
    if (_.isString(eventDateLabel3)) {
      updateData.eventDateLabel3 = eventDateLabel3;
    }
    if (eventDate4) {
      updateData.eventDate4 = eventDate4;
    }
    if (_.isString(eventDateLabel4)) {
      updateData.eventDateLabel4 = eventDateLabel4;
    }
    if (ice) {
      assertICE(ice);
      updateData.ice = ice;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
      const profileOpportunities = ProfileOpportunities.find({ opportunityID: docID }).fetch();
      profileOpportunities.forEach((po) => ProfileOpportunities.update(po._id, { retired }));
      const reviews = Reviews.find({ revieweeID: docID }).fetch();
      reviews.forEach((review) => Reviews.update(review._id, { retired }));
      const opportunity = this.findDoc(docID);
      const teasers = Teasers.find({ targetSlugID: opportunity.slugID }).fetch();
      teasers.forEach((teaser) => Teasers.update(teaser._id, { retired }));
    }
    if (picture) {
      updateData.picture = picture;
    }
    if (clearEventDate1) {
      updateData.eventDate1 = null;
      updateData.eventDateLabel1 = '';
    }
    if (clearEventDate2) {
      updateData.eventDate2 = null;
      updateData.eventDateLabel2 = '';
    }
    if (clearEventDate3) {
      updateData.eventDate3 = null;
      updateData.eventDateLabel3 = '';
    }
    if (clearEventDate4) {
      updateData.eventDate4 = null;
      updateData.eventDateLabel4 = '';
    }
    // console.log(updateData);
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Opportunity.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Opportunity, or if this Opportunity has any associated opportunity instances.
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
    const profileOpportunities = ProfileOpportunities.find({ opportunityID: docID }).fetch();
    profileOpportunities.forEach((po => ProfileOpportunities.removeIt(po._id)));
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
    return ((doc.interestIDs).includes(interestID));
  }

  /**
   * Returns a list of CareerGoals that have common interests.
   * @param {string} docIdOrSlug an opportunity ID or slug.
   * @return {CareerGoals[]} Courses that have common interests.
   */
  public findRelatedCareerGoals(docIdOrSlug: string): CareerGoal[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const goals = CareerGoals.findNonRetired();
    return goals.filter((goal) => goal.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns a list of Courses that have common interests.
   * @param {string} docIdOrSlug an opportunity ID or slug.
   * @return {Course[]} Courses that have common interests.
   */
  public findRelatedCourses(docIdOrSlug: string): Course[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const courses = Courses.findNonRetired();
    return courses.filter((course) => course.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  }

  /**
   * Returns a list of Internships that have common interests.
   * @param {string} docIdOrSlug an opportunity ID or slug.
   * @return {Internship[]} Internships that have common interests.
   */
  public findRelatedInternships(docIdOrSlug: string): Internship[] {
    const docID = this.getID(docIdOrSlug);
    const interestIDs = this.findDoc(docID).interestIDs;
    const internships = Internships.findNonRetired();
    return internships.filter((internship) => internship.interestIDs.filter(x => interestIDs.includes(x)).length > 0);
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
    const eventDate1 = doc.eventDate1;
    const eventDate2 = doc.eventDate2;
    const eventDate3 = doc.eventDate3;
    const eventDate4 = doc.eventDate4;
    const eventDateLabel1 = doc.eventDateLabel1;
    const eventDateLabel2 = doc.eventDateLabel2;
    const eventDateLabel3 = doc.eventDateLabel3;
    const eventDateLabel4 = doc.eventDateLabel4;
    const picture = doc.picture;
    const retired = doc.retired;
    return {
      name,
      slug,
      description,
      opportunityType,
      sponsor,
      ice,
      interests,
      eventDate1,
      eventDate2,
      eventDate3,
      eventDate4,
      eventDateLabel1,
      eventDateLabel2,
      eventDateLabel3,
      eventDateLabel4,
      picture,
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
