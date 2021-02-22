import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { sendEmail, sendEmailParams } from './Email';
import { ROLE } from '../role/Role';

/**
 * The Email sendEmail ValidatedMethod.
 * @memberOf api/analytic
 */
export const sendEmailMethod = new ValidatedMethod({
  name: 'Email.sendEmail',
  validate: null,
  run(emailData: sendEmailParams) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to send emails.', Error().stack);
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an Admin to send emails.', Error().stack);
    }
    sendEmail(emailData);
  },
});

export const sendRefusedTermsEmailMethod = new ValidatedMethod({
  name: 'Email.sendRefusedTermsEmail',
  validate: null,
  run(emailData: sendEmailParams) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to send emails.', Error().stack);
    }
    sendEmail(emailData);
  },
});
