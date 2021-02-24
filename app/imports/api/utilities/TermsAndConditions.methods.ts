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
    let terms = '';
    if (Meteor.isServer) {
      const fileName = Meteor.settings.termsAndConditionsFileName;
      if (fileName) {
        terms = Assets.getText(fileName);
      } else {
        terms = 'Terms unknown';
      }
    }
    return terms;
  },
});
