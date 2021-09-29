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
 * The Notification class bundles together functions to support email notifications.
 *   * Notify the admin and all advisors when there are reviews to moderate
 *   * Notify the admin and all advisors when there are opportunity verification requests.
 */


class Notifications {
  private adminEmail: string;
  private advisorEmails: string[];
  private instanceDomainName: string;
  constructor() {
    this.adminEmail = Meteor.settings.public.adminProfile.username;
    console.log(`admin email is ${this.adminEmail}`);
    this.advisorEmails = AdvisorProfiles.find().fetch().map(profile => profile.username);
    console.log(`advisor emails is: ${JSON.stringify(this.advisorEmails)}`);
  }
}

// A singleton, providing access to notification processing.
export const notifications = new Notifications();
