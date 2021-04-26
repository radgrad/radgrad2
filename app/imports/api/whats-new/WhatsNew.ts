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
 *   * This server-side class, which stores the current state of What's New along with updateData() and getData() methods.
 *   * The WhatsNew method, which is called by the client to obtain what's new data via the getData() method.
 *   * The WhatsNew server-side cron job, which updates what's new once a day via updateData().
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

export interface WhatsNewData {
  newEntities?: Record<string, any>;
  updatedEntities?: Record<string, any>;
  lastUpdate?: Date;
}

class WhatsNew {
  private newEntities = {};
  private updatedEntities = {};
  private oneWeekAgo = moment().subtract(1, 'weeks');
  private lastUpdate = new Date();

  constructor() {
    this.initialize();
    this.updateData();
  }

  private initialize() {
    // Initialize the slug objects with fields whose names are the collection names, and value is an empty array.
    Object.values(WHATS_NEW_FIELDS).forEach(fieldName => {
      this.newEntities[fieldName] = [];
      this.updatedEntities[fieldName] = [];
    });
    this.oneWeekAgo = moment().subtract(1, 'weeks');
  }

  public getData(): WhatsNewData {
    return { newEntities: this.newEntities, updatedEntities: this.updatedEntities, lastUpdate: this.lastUpdate };
  }

  public updateData() {
    this.initialize();
    this.lastUpdate = new Date();
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
