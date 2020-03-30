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
    return _.has(Meteor, 'settings.public.RadGrad.quarterSystem') ? Meteor.settings.public.RadGrad.quarterSystem : false;
  }

  public getAdminProfile(): IBaseProfile {
    return _.has(Meteor, 'settings.public.RadGrad.adminProfile') ? Meteor.settings.public.RadGrad.adminProfile : {
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
    return _.has(Meteor, 'settings.public.RadGrad.adminProfile.username') ? Meteor.settings.public.RadGrad.adminProfile.username : 'radgrad@hawaii.edu';
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

  public getFallSemesterStartDate(): Date {

  }

  public getFallSemesterEndDate(): Date {

  }

  public getSummerSemesterStartDate(): Date {

  }

  public getSummerSemesterEndDate(): Date {

  }

  public getSpringSemesterStartDate(): Date {

  }

  public getSpringSemesterEndDate(): Date {

  }
}

export const RadGradProperties = new RadGradPropertiesClass();
