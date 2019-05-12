import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../base/BaseCollection';
import { IHelpDefine, IHelpUpdate } from '../../typings/radgrad'; // eslint-disable-line

/**
 * Represents a Help message for a RadGrad page.
 * @extends api/base.BaseCollection
 * @memberOf api/help
 */
class HelpMessageCollection extends BaseCollection {
  /**
   * Creates the HelpMessage collection.
   */
  constructor() {
    super('HelpMessage', new SimpleSchema({
      routeName: { type: String },
      title: { type: String },
      text: { type: String },
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      routeName: String,
      title: String,
      text: String,
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      routeName: { type: String, optional: true },
      title: { type: String, optional: true },
      text: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines the help for a given routeName.
   * @param routeName the route name.
   * @param title the title of the help.
   * @param text the help text.
   * @return {any} the ID of the help.
   */
  public define({ routeName, title, text, retired }: IHelpDefine): string {
    return this.collection.insert({ routeName, title, text, retired });
  }

  /**
   * Update a Help Message
   * @param docID The docID to be updated.
   * @param routeName The new routeName (optional).
   * @param title The new title (optional)
   * @param text New help text. (optional).
   * @throws { Meteor.Error } If docID is not defined.
   */
  public update(docID: string, { routeName, title, text, retired }: IHelpUpdate) {
    this.assertDefined(docID);
    const updateData: IHelpUpdate = {};
    if (routeName) {
      updateData.routeName = routeName;
    }
    if (title) {
      updateData.title = title;
    }
    if (text) {
      updateData.text = text;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Help Message..
   * @param docID The docID of the entity to be removed.
   * @throws { Meteor.Error } If docID is not a Help Message.
   */
  public removeIt(docID: string) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Returns the text for the given routeName.
   * @param routeName The route name.
   */
  public getHelpText(routeName: string): string {
    return this.collection.findOne({ routeName }).text;
  }

  /**
   * Returns the title for the given routeName.
   * @param routeName The route name.
   */
  public getHelpTitle(routeName: string): string {
    return this.collection.findOne({ routeName }).title;
  }

  /**
   * Returns an empty array (no integrity checking done on this collection.)
   * @returns {Array} An empty array.
   */
  public checkIntegrity(): string[] {
    return [];
  }

  /**
   * Returns the HelpMessage doc associated with RouteName.
   * @param routeName The routeName
   * @returns The doc, or null if not found.
   */
  public findDocByRouteName(routeName: string) {
    return this.collection.findOne({ routeName });
  }

  /**
   * Returns an object representing the HelpMessage docID in a format acceptable to define().
   * @param docID The docID of a HelpMessage.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IHelpDefine {
    const doc = this.findDoc(docID);
    const routeName = doc.routeName;
    const title = doc.title;
    const text = doc.text;
    const retired = doc.retired;
    return { routeName, title, text, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/help
 * @type {api/help.HelpMessageCollection}
 */
export const HelpMessages = new HelpMessageCollection();
