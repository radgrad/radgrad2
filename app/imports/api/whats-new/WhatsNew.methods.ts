import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { whatsNew } from './WhatsNew';

/**
 * Meteor method used to retrieve the terms and conditions string from a file and return it to the client.
 */
export const getWhatsNew = new ValidatedMethod({
  name: 'WhatsNew.getWhatsNew',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      return whatsNew.getData();
    }
    return null;
  },
});
