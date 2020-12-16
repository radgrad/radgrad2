import _ from 'lodash';
import BaseTypeCollection from '../base/BaseTypeCollection';
import { TypeDefine, TypeUpdate } from '../../typings/radgrad';

/**
 * InterestTypes help organize Interests into logically related groupings such as "CS-Disciplines", "Locations", etc.
 * @extends api/base.BaseTypeCollection
 * @memberOf api/interest
 */
class InterestTypeCollection extends BaseTypeCollection {

  /**
   * Creates the InterestType collection.
   */
  constructor() {
    super('InterestType');
  }

  /**
   * Defines a new InterestType with its name, slug, and description.
   * @example
   * InterestTypes.define({ name: 'Locations', slug: 'locations', description: 'Regions of interest.' });
   * @param { Object } description Object with keys name, slug, and description.
   * Slug must be globally unique and previously undefined.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  public define({ name, slug, description, retired = false }: TypeDefine) {
    return super.define({ name, slug, description, retired });
  }

  /**
   * Update an InterestType.
   * @param docID the docID to be updated.
   * @param name the new name (optional).
   * @param description the new description (optional).
   * @throws { Meteor.Error } If docID is not defined.
   */
  public update(docID, { name, description, retired }: TypeUpdate) {
    this.assertDefined(docID);
    const updateData: TypeUpdate = {};
    if (!_.isNil(name)) {
      updateData.name = name;
    }
    if (!_.isNil(description)) {
      updateData.description = description;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
    return true;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/interest.InterestTypeCollection}
 * @memberOf api/interest
 */
export const InterestTypes = new InterestTypeCollection();
