import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../../../app/imports/api/base/BaseCollection.methods';
import { HelpMessages } from './HelpMessageCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../../../app/imports/api/test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('HelpMessageCollection Meteor Methods ', function test() {
    const collectionName = HelpMessages.getCollectionName();
    const routeName = 'Admin_Database_Dump_Page';
    const definitionData = { routeName, title: 'Admin Database Dump Page', text: 'help!' };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = HelpMessages.findDocByRouteName(routeName)._id;
      const title = 'new title';
      const text = 'new help text';
      await updateMethod.callPromise({ collectionName, updateData: { id, title, text } });
    });

    it('Remove Method', async function () {
      const instance = HelpMessages.findDocByRouteName(routeName)._id;
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
