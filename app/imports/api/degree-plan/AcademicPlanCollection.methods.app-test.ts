import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AcademicPlans } from './AcademicPlanCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('AcademicPlanCollection Meteor Methods ', function test() {
    const collectionName = AcademicPlans.getCollectionName();
    const definitionData = {
      slug: 'bs-cs-2016-test',
      degreeSlug: 'bs-cs',
      name: 'B.S. in Computer Sciences',
      description: 'The BS in CS degree offers a solid foundation in computer science.',
      academicTerm: 'Fall-2016',
      coursesPerAcademicTerm: [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0],
      courseList: ['ics_111-1', 'ics_141-1', 'ics_211-1', 'ics_241-1', 'ics_311-1', 'ics_314-1', 'ics_212-1',
        'ics_321-1', 'ics_312,ics_331-1', 'ics_313,ics_361-1', 'ics_332-1', 'ics_400+-1', 'ics_400+-2', 'ics_400+-3',
        'ics_400+-4', 'ics_400+-5'],
    };

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
        const id = AcademicPlans.findIdBySlug(definitionData.slug);
        const degreeSlug = 'ba-ics';
        const name = 'updated AcademicPlan name';
        const academicTerm = 'Spring-2017';
        const coursesPerAcademicTerm = [5, 5, 5, 5, 2, 0, 2, 2, 0, 2, 2, 0];
        await updateMethod.callPromise({
          collectionName,
          updateData: { id, degreeSlug, name, academicTerm, coursesPerAcademicTerm },
        });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Remove Method', async function (done) {
      try {
        await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
