import { Meteor } from 'meteor/meteor';
import { removeAllEntities } from '../base/BaseUtilities';
import { PublicStats } from './PublicStatsCollection';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('PublicStatsCollecion', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#careerGoalsTotal, #careerGoalsList', function test() {
      PublicStats.careerGoalsTotal();
    });
  });
}
