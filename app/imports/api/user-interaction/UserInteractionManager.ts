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
    const snap: UIMSnapshot = {}; // TODO add internships?
    // Loop through each active student, and set their snapshot fields.
    StudentProfiles.findNonRetired({ isAlumni: false }).forEach(profile => {
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
    const startingCount = UserInteractions.count();
    const newSnapshot = this.buildASnapshot();
    const day = moment().format(moment.HTML5_FMT.DATE);
    StudentProfiles.findNonRetired({ isAlumni: false }).forEach(profile => {
      const username = profile.username;
      const userSnapshot = this.snapshot[username];
      const newUserSnapshot = newSnapshot[username];
      const notPresent = (type) => !UserInteractions.findOne({ username, type, day });

      // (1) LOGIN: determine if the user has visited any pages today
      const visitTimes = Object.values(profile.lastVisited);
      let type = USER_INTERACTIONS.LOGIN;
      if (_.some(visitTimes, (time) => time === day)) {
        if (notPresent(type)) {
          UserInteractions.define({ username, type });
        }
      }

      // (2) CHANGE_OUTLOOK: changes to interests, career goals, opportunities, and courses.
      const outlookArray = [];
      const outlookFields = ['interests', 'careerGoals', 'opportunities', 'courses' ];
      type = USER_INTERACTIONS.CHANGE_OUTLOOK;
      outlookFields.forEach(field => {
        if (this.areDifferent(userSnapshot[field], newUserSnapshot[field])) {
          outlookArray.push(field);
        }
      });
      // If interests, career goals, etc changed today, and no current doc, then create a new one.
      if ((outlookArray.length > 0) && notPresent(type)) {
        UserInteractions.define({ username, type, typeData: outlookArray });
      }

      // (3) EXPLORE: visits to explorer pages.
      const exploreArray = [];
      const explorePages = [PAGEIDS.OPPORTUNITY_BROWSER, PAGEIDS.OPPORTUNITY, PAGEIDS.INTEREST_BROWSER, PAGEIDS.INTEREST, PAGEIDS.COURSE_BROWSER, PAGEIDS.COURSE, PAGEIDS.CAREER_GOAL_BROWSER, PAGEIDS.CAREER_GOAL];
      type = USER_INTERACTIONS.EXPLORE;
      explorePages.forEach(page => {
        if (profile.lastVisited[page] === day) {
          exploreArray.push(page);
        }
      });
      // If there was a visit today, and no current doc, then create a new one.
      if ((exploreArray.length > 0) && notPresent(type)) {
        UserInteractions.define({ username, type, typeData: exploreArray });
      }

      // (4) PLAN: Visit to degree planner, and no current doc
      type = USER_INTERACTIONS.PLAN;
      if ((profile.lastVisited[PAGEIDS.STUDENT_DEGREE_PLANNER] === day) && notPresent(type)) {
        UserInteractions.define({ username, type });
      }

      // (5) LEVEL_UP: is today's level higher than yesterday's?
      type = USER_INTERACTIONS.LEVEL_UP;
      if ((userSnapshot.level < newUserSnapshot.level) && notPresent(type)) {
        UserInteractions.define({ username, type });
      }

      // (6) COMPLETE_PLAN: was the plan incomplete yesterday, but complete today?
      type = USER_INTERACTIONS.COMPLETE_PLAN;
      if (!userSnapshot.degreePlanComplete && newUserSnapshot.degreePlanComplete && notPresent(type)) {
        UserInteractions.define({ username, type });
      }

      // (7) REVIEW: submitting a new Review document in the past day.
      // Works best if it runs near midnight of current day.
      type = USER_INTERACTIONS.REVIEW;
      const startOfToday = moment().startOf('day').toDate();
      if ((Reviews.findNonRetired({ studentID: profile.userID, createdAt: { $gte: startOfToday } }).length > 0) && notPresent(type)) {
        UserInteractions.define({ username, type });
      }

      // (8) VERIFICATION: submitting a Verification Request in the past day.
      type = USER_INTERACTIONS.VERIFY;
      if ((VerificationRequests.findNonRetired({ studentID: profile.userID, createdAt: { $gte: startOfToday } }).length > 0) && notPresent(type)) {
        UserInteractions.define({ username, type });
      }

      // (8) CHANGE_VISIBILITY: change if visibility has changed.
      type = USER_INTERACTIONS.CHANGE_VISIBILITY;
      if ((this.areDifferent(userSnapshot.visibility, newUserSnapshot.visibility)) && notPresent(type)) {
        UserInteractions.define({ username, type, typeData: newUserSnapshot.visibility });
      }
    });

    // Last, but not least, update the saved snapshot to the current one.
    this.snapshot = newSnapshot;
    const newInteractions = UserInteractions.count() - startingCount;
    console.log('UserInteractionManager.dailyUpdate(): new Interactions: ', newInteractions );

  }
}

// A singleton, storing state on what's new.
export const userInteractionManager = new UserInteractionManager();
