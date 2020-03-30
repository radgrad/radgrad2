import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import 'mocha';
import { PageInterestsTermSnapshots } from './PageInterestsTermSnapshotCollection';

if (Meteor.isServer) {
  describe('TermSnapshotPageInterestsCollection', function testSuite() {
    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    // TODO
    it('Can define and remove', function test1(done) {
      this.timeout(5000);

      done();
    });

    // TODO
    it('Can checkIntegrity no errors', function test2() {
      const problems = PageInterestsTermSnapshots.checkIntegrity();
      expect(problems.length).to.equal(0);
    });
  });
}
