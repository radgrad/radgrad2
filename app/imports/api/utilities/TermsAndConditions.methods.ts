import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const getTermsAndConditions = new ValidatedMethod({
  name: 'TermsAndConditions.getTermsAndConditions',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    const fileName = Meteor.settings.termsAndConditionsFileName;
    return fileName ? JSON.parse(Assets.getText(fileName)) : 'No terms and conditions available';
  },
});
