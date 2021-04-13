import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

/**
 * Meteor method used to retrieve the terms and conditions string from a file and return it to the client.
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
