import moment from 'moment';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';

/**
 * What's New is implemented via the following mechanisms:
 *   * This server-side class, which stores the current state of What's New, along with methods to update it.
 *   * The WhatsNew method, which is called by the client to obtain what's new data for display.
 *   * The WhatsNew server-side cron job, which calls this class's update method once a day.
 */

export enum WHATS_NEW_FIELDS {
  INTERESTS = 'InterestCollection',
  CAREER_GOALS = 'CareerGoalCollection',
  COURSES = 'CourseCollection',
  OPPORTUNITIES = 'OpportunityCollection',
  STUDENTS = 'StudentProfileCollection',
  FACULTY = 'FacultyProfileCollection',
  ADVISORS = 'AdvisorProfileCollection',
}

class WhatsNew {
  public newEntitySlugs = {};
  public updatedEntitySlugs = {};

  constructor() {
    // Initialize the slug objects with fields whose names are the collection names, and value is an empty array.
    Object.keys(WHATS_NEW_FIELDS).forEach(fieldName => {
      this.newEntitySlugs[fieldName] = [];
      this.updatedEntitySlugs = [];
    });
  }

  public update() {
    const weekAgo = moment().subtract(1, 'weeks');
    const entityCollections = [Interests, CareerGoals, Courses, Opportunities];
    const userCollections = [StudentProfiles, FacultyProfiles, AdvisorProfiles];
    entityCollections.forEach(collection => {
      collection.collection.find().fetch().forEach(document => {
        const slug = collection.findSlugByID(document._id);
        console.log(slug, document.createdAt, document.updatedAt);
      });
    });

    userCollections.forEach(collection => {
      collection.collection.find().fetch().forEach(document => {
        const username = document.username;
        console.log(username, document.createdAt, document.updatedAt);
      });
    });

  }
}

// A singleton, storing state on what's new.
export const whatsNew = new WhatsNew();