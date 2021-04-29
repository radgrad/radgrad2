import _ from 'lodash';
import moment from 'moment';
import { PAGEIDS } from '../../ui/utilities/PageIDs';
import { Reviews } from '../review/ReviewCollection';
import { ProfileCareerGoals } from '../user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../user/profile-entries/ProfileOpportunityCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { USER_INTERACTIONS, UserInteractions } from './UserInteractionCollection';

/** The structure of a snapshot. */
export interface UIMSnapshot {
  string?: { interests: string[], careerGoals: string[], courses: string[], opportunities: string[], level: number, degreePlanComplete: boolean, visibility: string[] }
}

/** The boolean fields in a student's profile used to indicate what's visible. */
enum VISIBILITY {
  PICTURE = 'sharePicture',
  WEBSITE = 'shareWebsite',
  INTERESTS = 'shareInterests',
  CAREER_GOALS = 'shareCareerGoals',
  COURSES = 'shareCourses',
  OPPORTUNITIES = 'shareOpportunities',
  LEVEL = 'shareLevel',
  ICE = 'shareICE',
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
    // Loop through each active student, and set their snapshot fields.
    StudentProfiles.findNonRetired().forEach(profile => {
      const username = profile.username;
      snap[username] = {
        interests: ProfileInterests.getInterestSlugs(username),
        careerGoals: ProfileCareerGoals.getCareerGoalSlugs(username),
        courses: ProfileCourses.getCourseSlugs(username),
        opportunities: ProfileOpportunities.getOpportunitySlugs(username),
        level: profile.level,
        degreePlanComplete: StudentProfiles.isDegreePlanComplete(profile.username),
        visibility: this.setVisibility(profile),
      };
    });
    // console.log(snap);
    return snap;
  }

  /** Returns an array of strings indicating the current visibilities for the user. */
  setVisibility(profile) {
    const visibility = [];
    Object.values(VISIBILITY).forEach(visibilityField => {
      if (profile[visibilityField] === true) {
        visibility.push(visibilityField);
      }
    });
    return visibility;
  }

  /** Returns true if the two passed arrays (of strings) are different in some way. */
  areDifferent(array1, array2) {
    return (array1.sort().join(',') !== array2.sort().join(','));
  }

  /** Build and save an in-memory snapshot. Run at system startup time. */
  public initialize() {
    this.snapshot = this.buildASnapshot();
  }

  /** Once a day, update the snapshot, and generate UserInteraction documents as appropriate. */
  public dailyUpdate() {
    console.log('Starting UserInteractionManager.dailyUpdate()');
    const newSnapshot = this.buildASnapshot();
    const today = moment().format(moment.HTML5_FMT.DATE);
    StudentProfiles.findNonRetired().forEach(profile => {
      const username = profile.username;
      const userSnapshot = this.snapshot[username];
      const newUserSnapshot = newSnapshot[username];

      // (1) LOGIN: determine if the user has visited any pages today
      const visitTimes = Object.values(profile.lastVisited);
      if (_.some(visitTimes, (time) => time === today)) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.LOGIN });
      }

      // (2) CHANGE_OUTLOOK: changes to interests, career goals, opportunities, and courses.
      const outlookArray = [];
      const outlookFields = ['interests', 'careerGoals', 'opportunities', 'courses' ];
      outlookFields.forEach(field => {
        if (this.areDifferent(userSnapshot[field], newUserSnapshot[field])) {
          outlookArray.push(field);
        }
      });
      // If we found that interests, career goals, etc changed today, then emit a UserInteraction document.
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
      if (userSnapshot.level < newUserSnapshot.level) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.LEVEL_UP });
      }

      // (6) COMPLETE_PLAN: was the plan incomplete yesterday, but complete today?
      if (!userSnapshot.degreePlanComplete && newUserSnapshot.degreePlanComplete) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.COMPLETE_PLAN });
      }

      // (7) REVIEW: submitting a new Review document in the past day.
      const startOfToday = moment().startOf('day').toDate(); // Must run before midnight of current day.
      if (Reviews.findNonRetired({ studentID: profile.userID, createdAt: { $gte: startOfToday } }).length > 0) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.REVIEW });
      }

      // (8) VERIFICATION: submitting a Verification Request in the past day.
      if (VerificationRequests.findNonRetired({ studentID: profile.userID, createdAt: { $gte: startOfToday } }).length > 0) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.VERIFY });
      }

      // (8) CHANGE_VISIBILITY: change if visibility has changed.
      if (this.areDifferent(userSnapshot.visibility, newUserSnapshot.visibility)) {
        UserInteractions.define({ username, type: USER_INTERACTIONS.CHANGE_VISIBILITY, typeData: newUserSnapshot.visibility });
      }
    });

    // Last, but not least, update the saved snapshot to the current one.
    this.snapshot = newSnapshot;
  }
}

// A singleton, storing state on what's new.
export const userInteractionManager = new UserInteractionManager();
