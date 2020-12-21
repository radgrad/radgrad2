import _ from 'lodash';
import BaseTypeCollection from '../base/BaseTypeCollection';
import { TypeDefine, TypeUpdate } from '../../typings/radgrad';

/**
 * OpportunityTypes help organize Opportunities into logically related groupings such as "Internships", "Clubs", etc.
 * @extends api/base.BaseTypeCollection
 * @memberOf api/opportunity
 */
class OpportunityTypeCollection extends BaseTypeCollection {

  /**
   * Creates the OpportunityType collection.
   */
  constructor() {
    super('OpportunityType');
  }

  /**
   * Defines a new OpportunityType with its name, slug, and description.
   * @example
   * OpportunityTypes.define({ name: 'Research', slug: 'research', description: 'A research project.' });
   * @param { Object } description Object with keys name, slug, and description.
   * Slug must be globally unique and previously undefined.
   * @throws { Meteor.Error } If the slug already exists.
   * @returns The newly created docID.
   */
  public define({ name, slug, description, retired = false }: TypeDefine) {
    return super.define({ name, slug, description, retired });
  }

  /**
   * Update an OpportunityType.
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
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/opportunity.OpportunityTypeCollection}
 * @memberOf api/opportunity
 */
export const OpportunityTypes = new OpportunityTypeCollection();
