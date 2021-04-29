import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { Factoids } from './FactoidCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FactoidCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can update InterestFactoid', function test1(done) {
      let factoid = Factoids.getInterestFactoid();
      expect(factoid).to.be.undefined;
      fc.assert(
        fc.property(fc.lorem(3), fc.integer(10), fc.integer(10), fc.integer(10), fc.lorem(20), (name, numberOfStudents, numberOfOpportunities, numberOfCourses, description) => {
          Factoids.updateInterestFactoid({ name, numberOfStudents, numberOfOpportunities, numberOfCourses, description });
          factoid = Factoids.getInterestFactoid();
          expect(factoid.name).to.equal(name);
          expect(factoid.numberOfCourses).to.equal(numberOfCourses);
          expect(factoid.numberOfOpportunities).to.equal(numberOfOpportunities);
          expect(factoid.numberOfStudents).to.equal(numberOfStudents);
          expect(factoid.description).to.equal(description);
        }),
      );
      done();
    });

    it( 'Can update CareerGoalFactoid', function test2(done) {
      let factoid = Factoids.getCareerGoalFactoid();
      expect(factoid).to.be.undefined;
      fc.assert(
        fc.property(fc.lorem(3), fc.integer(10), fc.integer(10), fc.integer(10), fc.lorem(20), (name, numberOfStudents, numberOfOpportunities, numberOfCourses, description) => {
          Factoids.updateCareerGoalFactoid({ name, numberOfStudents, numberOfOpportunities, numberOfCourses, description });
          factoid = Factoids.getCareerGoalFactoid();
          expect(factoid.name).to.equal(name);
          expect(factoid.numberOfCourses).to.equal(numberOfCourses);
          expect(factoid.numberOfOpportunities).to.equal(numberOfOpportunities);
          expect(factoid.numberOfStudents).to.equal(numberOfStudents);
          expect(factoid.description).to.equal(description);
        }),
      );
      done();
    });

    it('Can update LevelFactoid', function test3(done) {
      let factoid = Factoids.getLevelFactoid();
      expect(factoid).to.be.undefined;
      fc.assert(
        fc.property(fc.integer(1, 6), fc.integer(365), fc.lorem(15), (level, numberOfStudents, description) => {
          Factoids.updateLevelFactoid({ level, numberOfStudents, description });
          factoid = Factoids.getLevelFactoid();
          expect(factoid.level).to.equal(level);
          expect(factoid.numberOfStudents).to.equal(numberOfStudents);
          expect(factoid.description).to.equal(description);
        }),
      );
      done();
    });

    it('Can update ReviewFactoid', function test4(done) {
      let factoid = Factoids.getReviewFactoid();
      expect(factoid).to.be.undefined;
      fc.assert(
        fc.property(fc.lorem(3), fc.lorem(20), (name, description) => {
          Factoids.updateReviewFactoid({ name, description });
          factoid = Factoids.getReviewFactoid();
          expect(factoid.name).to.equal(name);
          expect(factoid.description).to.equal(description);
        }),
      );
      done();
    });

    it('Can update OpportunityFactoid', function test5(done) {
      let factoid = Factoids.getOpportunityFactoid();
      expect(factoid).to.be.undefined;
      fc.assert(
        fc.property(fc.webUrl(), fc.lorem(3), fc.integer(1, 100), fc.integer(1, 100), fc.integer(1, 100), fc.lorem(20), fc.integer(500), (picture, name, i, c, e, description, numberOfStudents) => {
          Factoids.updateOpportunityFactoid({ name, description, numberOfStudents, ice: { i, c, e }, picture });
          factoid = Factoids.getOpportunityFactoid();
          expect(factoid.name).to.equal(name);
          expect(factoid.ice.i).to.equal(i);
          expect(factoid.ice.c).to.equal(c);
          expect(factoid.ice.e).to.equal(e);
          expect(factoid.description).to.equal(description);
          expect(factoid.numberOfStudents).to.equal(numberOfStudents);
        }),
      );
      done();
    });
  });
}
