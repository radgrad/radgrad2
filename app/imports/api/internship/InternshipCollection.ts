import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Internship, InternshipDefine, InternshipUpdate, InternshipUpdateData } from '../../typings/radgrad';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { Interests } from '../interest/InterestCollection';
import slugify from '../slug/SlugCollection';

/**
 * Creates the Internship collection
 */
class InternshipCollection extends BaseCollection {
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
      'location.$': { type: Object },
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
      'location.$': { type: Object },
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
      'location.$': { type: Object },
      contact: { type: String, optional: true },
      posted: { type: String, optional: true },
      due: { type: String, optional: true },
      guid: String,
    });
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
    const interestIDs = Interests.getIDs(interests);
    // Removes spaces and lowercases position
    const guid = slugify(`${company}-${position}-${description.length}`);
    const doc = this.findOne({ guid });
    if (doc) {
      return doc._id;
    }
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
  public update(docID: string, { urls, position, description, interests, company, location, contact, posted, due }: InternshipUpdate) {
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
