import _ from 'lodash';
import moment from 'moment';
import { PAGEIDS } from '../../ui/utilities/PageIDs';
import { ProfileCareerGoals } from '../user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../user/profile-entries/ProfileOpportunityCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { USER_INTERACTIONS, UserInteractions } from './UserInteractionCollection';

/** The structure of a snapshot. */
export interface UIMSnapshot {
  string?: { interests: string[], careerGoals: string[], courses: string[], opportunities: string[], level: number, degreePlanComplete: boolean }
}

/**
 * Provides the in-memory snapshot of student user state, along with methods to initialize and update it.
 * When updating, UserInteraction documents are generated if state has changed since the last update.
 */
class UserInteractionManager {
  public snapshot = {};

  constructor() {
    this.snapshot = {};
  }

  /** Create and return a snapshot data structure. */
  public buildASnapshot() {
    const snap: UIMSnapshot = {};
    // First, initialize the data structure.
    StudentProfiles.findNonRetired().forEach(profile => {
      snap[profile.username] = { interests: [], careerGoals: [], level: profile.level, degreePlanComplete: StudentProfiles.isDegreePlanComplete(profile.username) };
    });
    // Now loop through once more and add the interests and career goals.
    StudentProfiles.findNonRetired().forEach(profile => {
      const username = profile.username;
      snap[username].interests = ProfileInterests.getInterestSlugs(username);
      snap[username].careerGoals = ProfileCareerGoals.getCareerGoalSlugs(username);
      snap[username].courses = ProfileCourses.getCourseSlugs(username);
      snap[username].opportunities = ProfileOpportunities.getOpportunitySlugs(username);
    });
    // console.log(snap);
    return snap;
  }

  /** Build and save an in-memory snapshot. Run at system startup time. */
  public initialize() {
    this.snapshot = this.buildASnapshot();
    console.log('    at end of initialize(), is this.snapshot undefined?', this.snapshot === undefined);
  }

  /** Once a day, update the snapshot, and generate UserInteraction documents as appropriate. */
  public dailyUpdate() {
    console.log('Starting UserInteraction Manager dailyUpdate');
    console.log('Is this.snapshot undefined?: ', this.snapshot === undefined);
    const newSnapshot = this.buildASnapshot();
    const today = moment().format(moment.HTML5_FMT.DATE);
    StudentProfiles.findNonRetired().forEach(profile => {
      const username = profile.username;

      // (1) LOGIN: determine if the user has visited any pages today
      const visitTimes = Object.values(profile.lastVisited);
      if (_.some(visitTimes, (time) => time === today)) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.LOGIN });
      }

      // (2) CHANGE_OUTLOOK: changes to interests, career goals, opportunities, and courses.
      const outlookArray = [];
      const outlookFields = ['interests', 'careerGoals', 'opportunities', 'courses' ];
      outlookFields.forEach(field => {
        if (_.difference(this.snapshot[field], newSnapshot[field]).length > 0) {
          outlookArray.push(field);
        }
      });
      if (outlookArray.length > 0) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.CHANGE_OUTLOOK, typeData: outlookArray });
      }

      // (3) EXPLORE: visits to explorer pages.
      const exploreArray = [];
      const explorePages = [PAGEIDS.OPPORTUNITY_BROWSER, PAGEIDS.OPPORTUNITY, PAGEIDS.INTEREST_BROWSER, PAGEIDS.INTEREST, PAGEIDS.COURSE_BROWSER, PAGEIDS.COURSE, PAGEIDS.CAREER_GOAL_BROWSER, PAGEIDS.CAREER_GOAL];
      explorePages.forEach(page => {
        if (profile.lastVisited[page] === today) {
          exploreArray.push(page);
        }
      });
      if (exploreArray.length > 0) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.EXPLORE, typeData: exploreArray });
      }

      // (4) PLAN: Visit to degree planner.
      if (profile.lastVisited[PAGEIDS.STUDENT_DEGREE_PLANNER] === today) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.PLAN });
      }

      // (5) LEVEL_UP: is today's level higher than yesterday's?
      if (this.snapshot[username].level < newSnapshot[username].level) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.LEVEL_UP });
      }

      // (6) COMPLETE_PLAN: was the plan incomplete yesterday, but complete today?
      if (!this.snapshot[username].degreePlanComplete && newSnapshot[username.degreePlanComplete]) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.COMPLETE_PLAN });
      }
    });

    // Last, but not least, update the saved snapshot to the current one.
    this.snapshot = newSnapshot;
    console.log('Finished daily update');
  }
}

// A singleton, storing state on what's new.
export const userInteractionManager = new UserInteractionManager();
