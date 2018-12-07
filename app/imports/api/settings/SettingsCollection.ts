import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ISettingsDefine, ISettingsUpdate } from '../../typings/radgrad';

/**
 *
 */
class SettingsCollection extends BaseCollection {
  constructor() {
    super('Settings', new SimpleSchema({
      quarterSystem: { type: Boolean },
    }));
  }

  /**
   * Defines the Settings.
   * @param quarterSystem boolean true if using a quarter system.
   */
  public define({ quarterSystem }: ISettingsDefine) {
    return this.collection.insert({ quarterSystem });
  }

  public update(docID: string, { quarterSystem }: ISettingsUpdate) {
    throw new Meteor.Error('Quarter System is read only', 'Read Only', Error().stack);
  }

  public removeIt(instance: string) {
    throw new Meteor.Error('Cannot remove the Settings', '', Error().stack);
  }

  public dumpOne(docID: string): ISettingsDefine {
    const doc = this.findDoc(docID);
    const quarterSystem = doc.quarterSystem;
    return { quarterSystem };
  }
}
