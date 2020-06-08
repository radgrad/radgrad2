import { Meteor } from 'meteor/meteor';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';

if (Meteor.isServer) {
  describe('PageInterestsDailySnapshotCollection', function testSuite() {
    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      this.timeout(5000);
    });

    it('Cannot define duplicates', function test2() {

    });

    it('Can update', function test3(done) {
      this.timeout(5000);

      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {

    });

    it('Can checkIntegrity no errors', function test5() {

    });
  });
}
