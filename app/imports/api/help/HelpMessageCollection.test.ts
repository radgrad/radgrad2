import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { removeAllEntities } from '../base/BaseUtilities';
import { HelpMessages } from './HelpMessageCollection';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression only-arrow-functions */

if (Meteor.isServer) {
  describe('HelpMessageCollection', function testSuite() {
    let routeName;
    let title;
    let text;

    before(function setup() {
      removeAllEntities();
      routeName = 'Test_Route_Name';
      title = 'Test title';
      text = 'This is a sample help message.';
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let instanceID = HelpMessages.define({ routeName, title, text });
      expect(HelpMessages.isDefined(instanceID)).to.be.true;
      const dumpObject = HelpMessages.dumpOne(instanceID);
      HelpMessages.removeIt(instanceID);
      expect(HelpMessages.isDefined(instanceID)).to.be.false;
      instanceID = HelpMessages.restoreOne(dumpObject);
      expect(HelpMessages.isDefined(instanceID)).to.be.true;
      HelpMessages.removeIt(instanceID);
    });
  });
}
