import { Meteor } from 'meteor/meteor';
import _ from 'lodash';

/**
 * Properties to configure RadGrad for different institutions.
 */
class RadGradPropertiesClass {
  /**
   * Returns true if using quarters, false if using semesters.
   * @return true if using quarters, false if using semesters.
   */
  public getQuarterSystem(): boolean {
    return _.has(Meteor, 'settings.public.RadGrad.quarterSystem') ? Meteor.settings.public.RadGrad.quarterSystem : false;
  }

  /**
   * Returns the RadGrad admin email address.
   * @return the RadGrad admin email address.
   */
  public getAdminEmail(): string {
    return _.has(Meteor, 'settings.public.RadGrad.adminEmail') ? Meteor.settings.public.RadGrad.adminEmail : 'radgrad@hawaii.edu';
  }

  /**
   * Returns the email domain.
   * @return the email domain.
   */
  public getEmailDomain(): string {
    return _.has(Meteor, 'settings.public.RadGrad.emailDomain') ? Meteor.settings.public.RadGrad.emailDomain : 'hawaii.edu';
  }

  /**
   * Returns the newsletter from address.
   * @return the newsletter from address.
   */
  public getNewsletterFrom(): string {
    return _.has(Meteor, 'settings.public.RadGrad.newsletterFrom') ? Meteor.settings.public.RadGrad.newsletterFrom : 'Phillip Johnson <donotreply@mail.gun.radgrad.org>';
  }
}

export const RadGradProperties = new RadGradPropertiesClass();
