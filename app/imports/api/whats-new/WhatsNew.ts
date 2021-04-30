import _ from 'lodash';
import moment from 'moment';
import { USER_INTERACTIONS, UserInteractions } from '../user-interaction/UserInteractionCollection';
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
  logins?: number;
  levelUps?: number,
  lastUpdate?: Date;
}

class WhatsNew {
  private newEntities = {};
  private updatedEntities = {};
  private oneWeekAgo = moment().subtract(1, 'weeks');
  private lastUpdate = new Date();
  private logins = 0;
  private levelUps = 0;

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
    return { newEntities: this.newEntities, updatedEntities: this.updatedEntities, logins: this.logins, levelUps: this.levelUps, lastUpdate: this.lastUpdate };
  }

  public updateData() {
    this.initialize();
    this.lastUpdate = new Date();
    this.updateEntities();
    this.updateUsers();
    this.updateLogins();
    this.updateLevelUps();
  }

  /** Sets the logins field with the number of unique users accessing the system during the past week. */
  private updateLogins() {
    const loginDocs = UserInteractions.find({ type: USER_INTERACTIONS.LOGIN, createdAt: { $gte: this.oneWeekAgo.toDate() } }).fetch();
    this.logins = _.uniq(loginDocs.map(doc => doc.username)).length;
  }

  /** Sets the levelUps field with the number of Level Up events during the past week. OK if one user levels up twice. */
  private updateLevelUps() {
    const levelUpDocs = UserInteractions.find({ type: USER_INTERACTIONS.LEVEL_UP, createdAt: { $gte: this.oneWeekAgo.toDate() } }).fetch();
    this.levelUps = _.uniq(levelUpDocs.map(doc => doc.username)).length;
  }

  /** Sets the newEntities and updateEntities fields for Interests, Career Goals, Opportunities, and Courses. */
  private updateEntities() {
    const entityCollections = [Interests, CareerGoals, Courses, Opportunities];
    entityCollections.forEach(collection => {
      collection.collection.find().fetch().forEach(document => {
        const slug = collection.findSlugByID(document._id);
        this.addIfNew(slug, document, collection);
      });
    });
  }

  /** Sets the newEntities and updateEntities fields for all users except Admin. */
  private updateUsers() {
    const userCollections = [StudentProfiles, FacultyProfiles, AdvisorProfiles];
    userCollections.forEach(collection => {
      collection.collection.find().fetch().forEach(document => {
        const username = document.username;
        this.addIfNew(username, document, collection);
      });
    });
  }

  /** Helper for updateEntities and updateUsers. */
  private addIfNew(name, document, collection) {
    if (document.createdAt && this.oneWeekAgo.isBefore(moment(document.createdAt))) {
      this.newEntities[collection.getCollectionName()].push(name);
    }
    if (document.updatedAt && this.oneWeekAgo.isBefore(moment(document.updatedAt))) {
      this.updatedEntities[collection.getCollectionName()].push(name);
    }
  }
}

// A singleton, storing state regarding what's new during the past week.
export const whatsNew = new WhatsNew();
