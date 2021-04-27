import _ from 'lodash';
import moment from 'moment';
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
  public snapshot: UIMSnapshot = {};

  /** Create and return a snapshot data structure. */
  private buildASnapshot() {
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
  }

  /** Once a day, update the snapshot, and generate UserInteraction documents as appropriate. */
  dailyUpdate() {
    const newSnapshot = this.buildASnapshot();
    const today = moment().format(moment.HTML5_FMT.DATE);
    StudentProfiles.findNonRetired().forEach(profile => {
      const username = profile.username;
      // First, determine if the user has visited any pages today, and if so, create a LOGIN UserInteraction
      const visitTimes = Object.values(profile.lastVisited);
      if (_.some(visitTimes, (time) => time === today)) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.LOGIN });
      }

    });
  }
}

// A singleton, storing state on what's new.
export const userInteractionManager = new UserInteractionManager();
