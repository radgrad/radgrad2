import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import {InternshipDefine, InternshipUpdate} from '../../typings/radgrad';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';

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
      interests: { type: Array },
      'interests.$': String,
      careerGoals: { type: Array },
      'careerGoals.$': String,
      company: { type: String, optional: true },
      location: { type: Object, optional: true },
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
      careerGoals: { type: Array },
      'careerGoals.$': String,
      company: { type: String, optional: true },
      location: { type: Object, optional: true },
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
      careerGoals: { type: Array },
      'careerGoals.$': String,
      company: { type: String, optional: true },
      location: { type: Object, optional: true },
      contact: { type: String, optional: true },
      posted: { type: String, optional: true },
      due: { type: String, optional: true },
      guid: String,
    });
  }

  /**
   * Defines a new Internship.
   * @example
   * Internship.define({ urls: 'https://jobs.acm.org/jobs/data-analyst-internship-it-intern',
   *                     position: 'Data Analyst Internship',
   *                     description: 'Internship for upcoming Data Analysts',
   *                     lastUploaded: '2021-06-09T20:18:23.067Z'
   *                     missedUploads: 3,
   *                     interests: ['machine learning', 'python', 'software engineering'],
   *                     careerGoals: ['Data Scientist', 'Software Developer'],
   *                     company: 'Hutington Ingalls Industries, Inc.',
   *                     location: {
   *                       'city': 'Honolulu',
   *                       'state': 'Hawaii',
   *                       'zip': '96823'
   *                     },
   *                     contact: 'johndoe@foo.com',
   *                     posted: '2021-06-07T19:24:32.529Z',
   *                     due: '2021-06-28' });
   *
   * @param urls is the list of URLs to the pages in the sites with a full description of this internship.
   * @param position is the internship title.
   * @param description is the description of internship.
   * @param lastUploaded is the timestamp of when internship was found through scraping. If added manually, field is either absent or set to a falsy value.
   * @param missedUploads is an indicator of listing status. A value of 0-3 is "active", 4-7 is "expired", and 8+ is "retired."
   * @param interests is a list of Interest slugIDs matching this description.
   * @param careerGoals is a list of Career Goal slugIDs matching this description.
   * @param company is the internship company.
   * @param location is the object containing location information.
   * @param contact is the name, email, url, etc. of contact person.
   * @param posted is when internship was posted. Should be in YYYY-MM-DD format.
   * @param due is optional, defaults to false.
   */
  public define({ urls, position, description, lastUploaded, missedUploads, interests, careerGoals, company, location, contact, posted, due }: InternshipDefine) {
    const interestIDs = Interests.getIDs(interests);
    const careerGoalIDs = CareerGoals.getIDs(careerGoals);
    // Removes spaces and lowercases position
    const internshipTitle = position.replace(/\s+/g, '-').toLowerCase();
    // Generates guid using the exact time of internship definition
    const defineTime = new Date();
    const guid = `${internshipTitle}-${defineTime}`;
    const internshipID = this.collection.insert({
      urls,
      position,
      description,
      lastUploaded,
      missedUploads,
      interestIDs,
      careerGoalIDs,
      company,
      location,
      contact,
      posted,
      due,
      guid,
    });
    return internshipID;
  }

  public update(instance: string, { urls, position, description, interests, careerGoals, company, location, contact, posted, due }: InternshipUpdate) {
    const docID = this.getID(instance);
    const updateData: {
      urls?: string[];
      position?: string;
      description?: string;
      interests?: string[];
      careerGoals?: string[];
      company?: string;
      location?: Record<string, unknown>;
      contact?: string;
      posted?: string;
      due?: string;
    } = {};
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
      updateData.interests = interests;
    }
    if (careerGoals) {
      if (!Array.isArray(careerGoals)) {
        throw new Meteor.Error(`Interests ${careerGoals} is not an Array`);
      }
      updateData.careerGoals = careerGoals;
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
  }
}

export const Internships = new InternshipCollection();