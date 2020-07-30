import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { removeAllEntities } from '../base/BaseUtilities';
import { HelpMessages } from './HelpMessageCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('HelpMessageCollection', function testSuite() {

    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(50000);
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(5), fc.lorem(20), fc.boolean(), (fcRoute, fcTitle, fcText, fcRetired) => {
          const docID = HelpMessages.define({ routeName: fcRoute, title: fcTitle, text: fcText, retired: fcRetired });
          expect(HelpMessages.isDefined(docID)).to.be.true;
          const hm = HelpMessages.findDoc(docID);
          expect(hm.routeName).to.equal(fcRoute);
          expect(hm.title).to.equal(fcTitle);
          expect(hm.text).to.equal(fcText);
          expect(hm.retired).to.equal(fcRetired);
          HelpMessages.removeIt(docID);
          expect(HelpMessages.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const routeName = faker.lorem.word();
      const title = faker.lorem.words();
      const text = faker.lorem.paragraph();
      const docID1 = HelpMessages.define({ routeName, title, text });
      const docID2 = HelpMessages.define({ routeName, title, text });
      expect(docID1).to.equal(docID2);
      expect(HelpMessages.isDefined(docID1)).to.be.true;
      HelpMessages.removeIt(docID2);
      expect(HelpMessages.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(50000);
      const routeName = faker.lorem.word();
      const title = faker.lorem.words();
      const text = faker.lorem.paragraph();
      const docID = HelpMessages.define({ routeName, title, text });
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(5), fc.lorem(20), fc.boolean(), (fcRoute, fcTitle, fcText, fcRetired) => {
          expect(HelpMessages.isDefined(docID)).to.be.true;
          HelpMessages.update(docID, { routeName: fcRoute, title: fcTitle, text: fcText, retired: fcRetired });
          const hm = HelpMessages.findDoc(docID);
          expect(hm.routeName).to.equal(fcRoute);
          expect(hm.title).to.equal(fcTitle);
          expect(hm.text).to.equal(fcText);
          expect(hm.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let hm = HelpMessages.findOne({});
      const routeName = hm.routeName;
      const title = hm.title;
      const text = hm.text;
      const retired = hm.retired;
      let docID = hm._id;
      const dumpObject = HelpMessages.dumpOne(docID);
      HelpMessages.removeIt(docID);
      expect(HelpMessages.isDefined(docID)).to.be.false;
      docID = HelpMessages.restoreOne(dumpObject);
      hm = HelpMessages.findDoc(docID);
      expect(hm.routeName).to.equal(routeName);
      expect(hm.title).to.equal(title);
      expect(hm.text).to.equal(text);
      expect(hm.retired).to.equal(retired);
    });

    it('Can checkIntegrity no errors', function test5() {
      expect(HelpMessages.checkIntegrity()).to.have.lengthOf(0);
    });

    it('Can get by RouteName', function test6() {
      const hm = HelpMessages.findOne({});
      const routeName = hm.routeName;
      const title = HelpMessages.getHelpTitle(routeName);
      expect(title).to.equal(hm.title);
      const text = HelpMessages.getHelpText(routeName);
      expect(text).to.equal(hm.text);
      const helpMessage = HelpMessages.findDocByRouteName(routeName);
      expect(helpMessage).to.exist;
      expect(helpMessage.title).to.equal(hm.title);
      expect(helpMessage.text).to.equal(hm.text);
      expect(helpMessage.retired).to.equal(hm.retired);
    });
  });
}
