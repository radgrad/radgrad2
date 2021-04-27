import { ProfileCareerGoals } from '../user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';

/** The structure of a snapshot. */
export interface UIMSnapshot {
  string?: { interests: string[], careerGoals: string[], level: number, degreePlanComplete: boolean }
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
    });
    return snap;
  }

  /** Build and save an in-memory snapshot. Run at system startup time. */
  public initialize() {
    this.snapshot = this.buildASnapshot();
  }

  /** Update the snapshot, and generate UserInteraction documents if appropriate. */
  updateData() {
    const newSnapshot = this.buildASnapshot();

  }
}

// A singleton, storing state on what's new.
export const userInteractionManager = new UserInteractionManager();
