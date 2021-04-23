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

class WhatsNew {
  public newEntitySlugs = { interests: [], careerGoals: [], courses: [], opportunities: [], students: [], faculty: [], advisors: [] };
  public updatedEntitySlugs = { interests: [], careerGoals: [], courses: [], opportunities: [], students: [], faculty: [], advisors: [] };

  public update() {
    const entityCollections = [Interests, CareerGoals, Courses, Opportunities, StudentProfiles, FacultyProfiles, AdvisorProfiles];
    entityCollections.forEach(collection => {
      // @ts-ignore
      console.log(collection.getCollectionName());
      // @ts-ignore
      collection.collection.find().fetch().forEach(document => { console.log(document.name || document.username); });
    });
  }
}

// A singleton, storing state on what's new.
export const whatsNew = new WhatsNew();