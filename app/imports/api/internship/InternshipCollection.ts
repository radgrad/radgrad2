import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { InternshipDefine } from '../../typings/radgrad';

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
    });
    this.updateSchema = new SimpleSchema({
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
    });
  }
}

/**
 * Defines a new Internship.
 * @example
 * @param urls is the list of URLs to the pages in the sites with a full description of this internship.
 * @param position is the position name.
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
 * @param guid is globally unique ID.
 */
public define({ urls, position, description, lastUploaded, missedUploads, interests, company, location, contact, posted, due}: InternshipDefine) {
  
  this.collection.insert({
    urls,
    position,
    description,
    lastUploaded,
    missedUploads,
    interests,
    company,
    location,
    contact,
    posted,
    due,
    guid,
  })
}
export const Internships = new InternshipCollection();