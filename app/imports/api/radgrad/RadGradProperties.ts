import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { IBaseProfile } from '../../typings/radgrad';

/**
 * Properties to configure RadGrad for different institutions.
 */
class RadGradPropertiesClass {
  /**
   * Returns true if using quarters, false if using semesters.
   * @return true if using quarters, false if using semesters.
   */
  public getQuarterSystem(): boolean {
    return _.has(Meteor, 'settings.public.quarterSystem') ? Meteor.settings.public.quarterSystem : false;
  }

  public getAdminProfile(): IBaseProfile {
    return _.has(Meteor, 'settings.public.adminProfile') ? Meteor.settings.public.adminProfile : {
      username: 'radgrad@hawaii.edu',
      firstName: 'RadGrad',
      lastName: 'Admin',
    };
  }

  /**
   * Returns the RadGrad admin email address.
   * @return the RadGrad admin email address.
   */
  public getAdminEmail(): string {
    return _.has(Meteor, 'settings.public.adminProfile.username') ? Meteor.settings.public.adminProfile.username : 'radgrad@hawaii.edu';
  }

  /**
   * Returns the email domain.
   * @return the email domain.
   */
  public getEmailDomain(): string {
    return _.has(Meteor, 'settings.public.emailDomain') ? Meteor.settings.public.emailDomain : 'hawaii.edu';
  }

  /**
   * Returns the newsletter from address.
   * @return the newsletter from address.
   */
  public getNewsletterFrom(): string {
    return _.has(Meteor, 'settings.public.newsletterFrom') ? Meteor.settings.public.newsletterFrom : 'Phillip Johnson <donotreply@mail.gun.radgrad.org>';
  }

  // public getFallSemesterStartDate(): Date {
  //
  // }
  //
  // public getFallSemesterEndDate(): Date {
  //
  // }
  //
  // public getSummerSemesterStartDate(): Date {
  //
  // }
  //
  // public getSummerSemesterEndDate(): Date {
  //
  // }
  //
  // public getSpringSemesterStartDate(): Date {
  //
  // }
  //
  // public getSpringSemesterEndDate(): Date {
  //
  // }
}

export const RadGradProperties = new RadGradPropertiesClass();
