import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { HelpMessages } from './HelpMessageCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('HelpMessageCollection Meteor Methods ', function test() {
    const collectionName = HelpMessages.getCollectionName();
    const routeName = 'Admin_Database_Dump_Page';
    const definitionData = { routeName, title: 'Admin Database Dump Page', text: 'help!' };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });

    it('Define Method', async function (done) {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        await defineMethod.callPromise({ collectionName, definitionData });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Update Method', async function (done) {
      try {
        const id = HelpMessages.findDocByRouteName(routeName)._id;
        const title = 'new title';
        const text = 'new help text';
        await updateMethod.callPromise({ collectionName, updateData: { id, title, text } });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Remove Method', async function (done) {
      try {
        const instance = HelpMessages.findDocByRouteName(routeName)._id;
        await removeItMethod.callPromise({ collectionName, instance });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
