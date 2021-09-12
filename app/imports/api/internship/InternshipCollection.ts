import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { Internship, InternshipDefine, InternshipUpdate, InternshipUpdateData } from '../../typings/radgrad';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { Interests } from '../interest/InterestCollection';
import { Slugs } from '../slug/SlugCollection';
import { createGUID } from './import/process-canonical';

const locationSchema = new SimpleSchema({
  city: { type: String, optional: true },
  country: { type: String, optional: true },
  state: { type: String, optional: true },
  zip: { type: String, optional: true },
});

/**
 * Creates the Internship collection
 */
class InternshipCollection extends BaseCollection {
  private interestSlugsToInternships;
  private initializedInterestToInternships: boolean;

  constructor() {
    super('Internship', new SimpleSchema({
      urls: { type: Array },
      'urls.$': String,
      position: String,
      description: String,
      lastUploaded: { type: Date, optional: true },
      missedUploads: Number,
      interestIDs: { type: Array },
      'interestIDs.$': String,
      company: { type: String, optional: true },
      location: { type: Array, optional: true },
      'location.$': { type: locationSchema },
      contact: { type: String, optional: true },
      posted: { type: String, optional: true },
      due: { type: String, optional: true },
      guid: String,
    }));
    this.defineSchema = new SimpleSchema({
      urls: { type: Array },
      'urls.$': String,
      position: String,
      description: String,
      interests: { type: Array },
      'interests.$': String,
      company: { type: String, optional: true },
      location: { type: Array, optional: true },
      'location.$': { type: locationSchema },
      contact: { type: String, optional: true },
      posted: { type: String, optional: true },
      due: { type: String, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      urls: { type: Array },
      'urls.$': String,
      position: String,
      description: String,
      interests: { type: Array },
      'interests.$': String,
      company: { type: String, optional: true },
      location: { type: Array, optional: true },
      'location.$': { type: locationSchema },
      contact: { type: String, optional: true },
      posted: { type: String, optional: true },
      due: { type: String, optional: true },
      guid: String,
    });
    this.interestSlugsToInternships = {};
    this.initializedInterestToInternships = false;
    this.rebuildInterestSlugsToInternships();
    console.log(this.interestSlugsToInternships);
  }

  /**
   * Defines a new Internship.
   * @example
   * Internship.define({ urls: ['https://jobs.acm.org/jobs/data-analyst-internship-it-intern'],
   *                     position: 'Data Analyst Internship',
   *                     description: 'Internship for upcoming Data Analysts',
   *                     lastUploaded: 2021-06-09T20:18:23.067Z
   *                     missedUploads: 3,
   *                     interests: ['machine-learning', 'python', 'software-engineering'],
   *                     careerGoals: ['data-scientist', 'software-developer'],
   *                     company: 'Hutington Ingalls Industries, Inc.',
   *                     location: [{
   *                       'city': 'Honolulu',
   *                       'state': 'Hawaii',
   *                       'zip': '96823'
   *                     }],
   *                     contact: 'johndoe@foo.com',
   *                     posted: '2021-06-07T19:24:32.529Z',
   *                     due: '2021-06-28' });
   *
   * @param urls is the list of URLs to the pages in the sites with a full description of this internship.
   * @param position is the internship title.
   * @param description is the description of internship.
   * @param lastUploaded is the timestamp of when internship was found through scraping. If added manually, field is either absent or set to a falsy value.
   * @param missedUploads is an indicator of listing status. A value of 0-3 is "active", 4-7 is "expired", and 8+ is "retired."
   * @param interests is a list of Interest slugs matching this internship.
   * @param company is the internship company.
   * @param location is the object containing location information.
   * @param contact is the name, email, url, etc. of contact person.
   * @param posted is when internship was posted. Should be in YYYY-MM-DD format.
   * @param due is optional.
   */
  public define({ urls, position, description, lastUploaded, missedUploads, interests, company, location, contact, posted, due }: InternshipDefine) {
    this.initializeInterestSlugsToInternships();
    const interestIDs = Interests.getIDs(interests);
    const interestSlugs = interestIDs.map(id => {
      const interest = Interests.findDoc(id);
      return Slugs.getNameFromID(interest.slugID);
    });
    const guid = createGUID(company, position, description.length);
    interestSlugs.forEach((slug) => {
      if (this.interestSlugsToInternships[slug]) {
        this.interestSlugsToInternships[slug].push(guid);
        this.interestSlugsToInternships[slug] = _.uniq(this.interestSlugsToInternships[slug]);
      } else {
        this.interestSlugsToInternships[slug] = [];
        this.interestSlugsToInternships[slug].push(guid);
      }
      // console.log('define', slug, this.interestSlugsToInternships[slug]);
    });
    const doc = this.findOne({ guid });
    if (doc) {
      return doc._id;
    }
    //
    return this.collection.insert({
      urls,
      position,
      description,
      lastUploaded,
      missedUploads,
      interestIDs,
      company,
      location,
      contact,
      posted,
      due,
      guid,
    });
  }

  /**
   * Update an Internship
   * @param docID the ID of the internship document.
   * @param urls optional
   * @param position optional
   * @param description optional
   * @param interests optional
   * @param company optional
   * @param location object with city, state, zip code (optional)
   * @param contact optional
   * @param posted optional
   * @param due optional
   */
  public update(docID: string, { urls, position, description, interests, company, location, contact, posted, due, missedUploads }: InternshipUpdate) {
    this.assertDefined(docID);
    const updateData: InternshipUpdateData = {};
    if (urls) {
      if (!Array.isArray(urls)) {
        throw new Meteor.Error(`Urls ${urls} is not an Array. `);
      }
      updateData.urls = urls;
    }
    if (position) {
      updateData.position = position;
    }
    if (description) {
      updateData.description = description;
    }
    if (interests) {
      if (!Array.isArray(interests)) {
        throw new Meteor.Error(`Interests ${interests} is not an Array`);
      }
      updateData.interestIDs = Interests.getIDs(interests);
    }
    if (company) {
      updateData.company = company;
    }
    if (location) {
      if (!Object(location)) {
        throw new Meteor.Error(`Location ${location} is not an object`);
      }
    }
    if (contact) {
      updateData.contact = contact;
    }
    if (posted) {
      updateData.posted = posted;
    }
    if (due) {
      updateData.due = due;
    }
    if (missedUploads) {
      updateData.missedUploads = missedUploads;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Internship.
   * @param guid the unique ID of the internship to be removed
   */
  public removeIt(guid: string) {
    this.assertDefined(guid);
    return super.removeIt(guid);
  }

  public findBestMatch(interestIDs: string[]): Internship[] {
    const allInternships = this.findNonRetired();
    const preferred = new PreferredChoice(allInternships, interestIDs);
    if (preferred.hasPreferences()) {
      const best = preferred.getBestChoices();
      // console.log(best.length);
      return best;
    }
    return [];
  }

  public getInterestToInternships() {
    this.initializeInterestSlugsToInternships();
    return this.interestSlugsToInternships;
  }

  /**
   * Returns all the internships that have the given interestID.
   * @param {string} interestID the interest id.
   * @return {Internship[]} the matching internships.
   */
  public getInternshipsWithInterest(interestID: string): Internship[] {
    const interest = Interests.findDoc(interestID);
    const slug = Slugs.getNameFromID(interest.slugID);
    const guids = this.interestSlugsToInternships[slug];
    if (guids) {
      // console.log(slug, guids, this.interestSlugsToInternships);
      return guids.map(guid => this.findDoc({ guid }));
    }
    this.interestSlugsToInternships[slug] = [];
    return this.interestSlugsToInternships[slug];
  }

  private initializeInterestSlugsToInternships() {
    // console.log('initializeInterestSlugsToInternships', this.initializedInterestToInternships);
    if (!this.initializedInterestToInternships) {
      const interests = Interests.findNonRetired();
      const interestSlugs = interests.map(i => Slugs.getNameFromID(i.slugID));
      // eslint-disable-next-line no-return-assign
      interestSlugs.forEach(slug => this.interestSlugsToInternships[slug] = []);
      // console.log(this.interestSlugsToInternships);
      this.initializedInterestToInternships = true;
    }
  }

  private rebuildInterestSlugsToInternships() {
    console.log('rebuildInterestSlugsToInternships');
    this.initializeInterestSlugsToInternships();
    const internships = this.findNonRetired();
    internships.forEach(internship => {
      const slugs = internship.interestIDs.map(interestID => Interests.findSlugByID(interestID));
      slugs.forEach(slug => this.interestSlugsToInternships[slug].push(internship.guid));
    });
    const interests = Interests.findNonRetired();
    interests.forEach(interest => {
      const slug = Slugs.getNameFromID(interest.slugID);
      this.interestSlugsToInternships[slug] = _.uniq(this.interestSlugsToInternships[slug]);
    });
  }
  /**
   * Returns an object representing the Internship docID in a format acceptable to define().
   * @param docID the docID of an Internship.
   * @returns { object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): InternshipDefine {
    const doc = this.findDoc(docID);
    const urls = doc.urls;
    const position = doc.position;
    const description = doc.description;
    const lastUploaded = doc.lastUploaded;
    const missedUploads = doc.missedUploads;
    const interests = doc.interestIDs.map((id) => Interests.findSlugByID(id));
    const company = doc.company;
    const location = doc.location;
    const contact = doc.contact;
    const posted = doc.posted;
    const due = doc.due;
    return { urls, position, description, lastUploaded, missedUploads, interests, company, location, contact, posted, due };
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * No Integrity Checking performed right now.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    return problems;
  }
}

export const Internships = new InternshipCollection();
