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
 *   * This server-side class, which stores the current state of What's New, along with a method to update it.
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
  public newEntities = {};
  public updatedEntities = {};
  private oneWeekAgo = moment().subtract(1, 'weeks');

  private initialize() {
    // Initialize the slug objects with fields whose names are the collection names, and value is an empty array.
    Object.values(WHATS_NEW_FIELDS).forEach(fieldName => {
      this.newEntities[fieldName] = [];
      this.updatedEntities[fieldName] = [];
    });
    this.oneWeekAgo = moment().subtract(1, 'weeks');
  }

  public update() {
    this.initialize();
    const entityCollections = [Interests, CareerGoals, Courses, Opportunities];
    entityCollections.forEach(collection => {
      collection.collection.find().fetch().forEach(document => {
        const slug = collection.findSlugByID(document._id);
        this.addIfNew(slug, document, collection);
      });
    });
    const userCollections = [StudentProfiles, FacultyProfiles, AdvisorProfiles];
    userCollections.forEach(collection => {
      collection.collection.find().fetch().forEach(document => {
        const username = document.username;
        this.addIfNew(username, document, collection);
      });
    });
  }

  private addIfNew(name, document, collection) {
    if (document.createdAt && this.oneWeekAgo.isBefore(moment(document.createdAt))) {
      this.newEntities[collection.getCollectionName()].push(name);
    }
    if (document.updatedAt && this.oneWeekAgo.isBefore(moment(document.updatedAt))) {
      this.updatedEntities[collection.getCollectionName()].push(name);
    }
  }
}

// A singleton, storing state on what's new.
export const whatsNew = new WhatsNew();