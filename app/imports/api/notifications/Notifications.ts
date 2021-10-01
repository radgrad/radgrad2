import { sendEmail } from '../email/Email';
import { Reviews } from '../review/ReviewCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/**
 * The Notification class provides functions to support email notifications.
 * Currently, the following notifications are supported:
 *   * Notify the admin when there are reviews and/or requests to moderate
 */

class Notifications {
  private advisors: string[];
  private admin: string;
  private rootURL: string;
  private reviews: number;
  private requests: number;
  private instance: string;

  /** Set all the data necessary to send email notifications. Not convinced a separate initialize() method is necessary. */
  initialize() {
    this.instance = `RadGrad (${Meteor.settings.public.instanceName})`;
    this.admin = Meteor.settings.public.adminProfile.username;
    this.advisors = AdvisorProfiles.find().fetch().map(profile => profile.username);
    this.rootURL = process.env.ROOT_URL;
    this.reviews = Reviews.find({ moderated: false }).fetch().length;
    this.requests = VerificationRequests.find({ status: 'Open' }).fetch().length;
  }

  /** Invoke this to (potentially) send a notification email to the admin. */
  run() {
    this.initialize();
    if ((this.reviews > 0) || (this.requests > 0)) {
      const reviews = this.reviews;
      const requests = this.requests;
      const from = Meteor.settings.public.newsletterFrom;
      const rootURL = this.rootURL;
      const subject = `${this.instance}: Pending Reviews and/or Verification Requests`;
      const filename = 'notification.html';
      // email the admin only for right now. Later we might include the advisors.
      const to = this.admin;
      const templateData = { reviews, requests, rootURL };
      console.log(`Notification Email: ${reviews} Reviews, ${requests} Requests `);
      sendEmail({ to, from, subject, templateData, filename });
    }
  }
}

// A singleton, providing access to notification processing.
export const notifications = new Notifications();
