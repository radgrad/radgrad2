import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ISettingsDefine, ISettingsUpdate } from '../../typings/radgrad';

/**
 * Holds the settings for RadGrad.
 * @memberOf api/radgrad
 */
class RadGradSettingsCollection extends BaseCollection {
  constructor() {
    super('RadGradSettings', new SimpleSchema({
      quarterSystem: { type: Boolean },
    }));
  }

  /**
   * Defines the RadGradSettings.
   * @param quarterSystem boolean true if using a quarter system.
   */
  public define({ quarterSystem }: ISettingsDefine) {
    return this.collection.insert({ quarterSystem });
  }

  public findOne(selector: object, options?: object) {
    const document = super.findOne(selector, options);
    if (document) {
      return document;
    }
    return Meteor.settings.public.RadGrad ? Meteor.settings.public.RadGrad : { quarterSystem: false };
  }

  public update(docID: string, { quarterSystem }: ISettingsUpdate) {
    throw new Meteor.Error(`Quarter System is read only ${docID} ${quarterSystem}`, 'Read Only', Error().stack);
  }

  public removeIt(instance: string) {
    throw new Meteor.Error(`Cannot remove the RadGradSettings ${instance}`, '', Error().stack);
  }

  public dumpOne(docID: string): ISettingsDefine {
    const document = this.findDoc(docID);
    const quarterSystem = document.quarterSystem;
    return { quarterSystem };
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the number of RadGradSettings documents.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    const numSettings = this.collection.find().count();
    if (numSettings !== 1) {
      problems.push(`Wrong number of settings documents: ${numSettings}`);
    }
    return problems;
  }
}

export const RadGradSettings = new RadGradSettingsCollection();
