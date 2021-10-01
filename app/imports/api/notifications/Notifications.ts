import _ from 'lodash';
import moment from 'moment';
import { sendEmail } from '../email/Email';
import { Reviews } from '../review/ReviewCollection';
import { USER_INTERACTIONS, UserInteractions } from '../user-interaction/UserInteractionCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/**
 * The Notification class bundles together functions to support email notifications.
 *   * Notify the admin and all advisors when there are reviews to moderate
 *   * Notify the admin and all advisors when there are opportunity verification requests.
 */


class Notifications {
  private advisors: string[];
  private admin: string;
  private rootURL: string;
  private reviews: number;
  private requests: number;
  private instance: string;

  /** Set all the data necessary to send email notifications. */
  initialize() {
    this.instance = `RadGrad (${Meteor.settings.public.instanceName})`;
    this.admin = Meteor.settings.public.adminProfile.username;
    this.advisors = AdvisorProfiles.find().fetch().map(profile => profile.username);
    this.rootURL = process.env.ROOT_URL;
    this.reviews = Reviews.find({ moderated: false }).fetch().length;
    this.requests = VerificationRequests.find({ status: 'Open' }).fetch().length;
    console.log(`Notifications: Emails: ${JSON.stringify(this.advisors)}, ROOT_URL: ${this.rootURL}, reviews: ${this.reviews}, requests: ${this.requests}, MAIL_URL: ${process.env.MAIL_URL} `);
  };

  /** Invoke this to (potentially) send a notification email to advisors and the admin. */
  run() {
    this.initialize();
    if (this.reviews || this.requests) {
      const reviews = this.reviews;
      const requests = this.requests;
      const from = Meteor.settings.public.newsletterFrom;
      const rootURL = this.rootURL;
      const subject = `${this.instance}: Pending Reviews and/or Verification Requests`;
      const filename = 'notification.html';
      // email the admin
      let to = this.admin;
      let reviewURL = `${rootURL}#/admin/${this.admin}/manage-reviews`;
      let requestURL = `${rootURL}#/admin/${this.admin}/manage-reviews`;
      let templateData = { role: 'admin', reviews, requests, rootURL, reviewURL, requestURL };
      console.log('about to send email');
      sendEmail({to, from, subject, templateData, filename })
    }
  }
}

// A singleton, providing access to notification processing.
export const notifications = new Notifications();
