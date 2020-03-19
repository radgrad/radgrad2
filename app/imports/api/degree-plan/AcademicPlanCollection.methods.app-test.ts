import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AcademicPlans } from './AcademicPlanCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
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
      choiceList: ['ics_111-1', 'ics_141-1', 'ics_211-1', 'ics_241-1', 'ics_311-1', 'ics_314-1', 'ics_212-1',
        'ics_321-1', 'ics_312,ics_331-1', 'ics_313,ics_361-1', 'ics_332-1', 'ics_400+-1', 'ics_400+-2', 'ics_400+-3',
        'ics_400+-4', 'ics_400+-5'],
      groups: {
        ics_111: {
          name: 'ICS 111',
          courseSlugs: ['ics_111'],
        },
        ics_141: {
          name: 'ICS 141',
          courseSlugs: ['ics_141'],
        },
        ics_211: {
          name: 'ICS 211',
          courseSlugs: ['ics_211'],
        },
        ics_241: {
          name: 'ICS 241',
          courseSlugs: ['ics_241'],
        },
        ics_212: {
          name: 'ICS 212',
          courseSlugs: ['ics_212'],
        },
        ics_311: {
          name: 'ICS 311',
          courseSlugs: ['ics_311'],
        },
        'ics_312,ics_331': {
          name: 'ICS 312 or ICS 331',
          courseSlugs: ['ics_312', 'ics_331'],
        },
        ics_321: {
          name: 'ICS 321',
          courseSlugs: ['ics_321'],
        },
        'ics_313,ics_361': {
          name: 'ICS 313 or ICS 361',
          courseSlugs: ['ics_313', 'ics_361'],
        },
        ics_314: {
          name: 'ICS 314',
          courseSlugs: ['ics_314'],
        },
        ics_332: {
          name: 'ICS 332',
          courseSlugs: ['ics_332'],
        },
        'ics_400+': {
          name: 'ICS 400+',
          courseSlugs: ['ics_414', 'ics_415', 'ics_419', 'ics_421', 'ics_422', 'ics_423', 'ics_424', 'ics_425',
            'ics_426', 'ics_431', 'ics_432', 'ics_434', 'ics_435', 'ics_441', 'ics_442', 'ics_443', 'ics_451',
            'ics_452', 'ics_455', 'ics_461', 'ics_462', 'ics_464', 'ics_465', 'ics_466', 'ics_469', 'ics_471',
            'ics_475', 'ics_476', 'ics_481', 'ics_483', 'ics_484', 'ics_485', 'ics_491', 'ics_495', 'ics_499',
          ],
        },

      },
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = AcademicPlans.findIdBySlug(definitionData.slug);
      const degreeSlug = 'ba-ics';
      const name = 'updated AcademicPlan name';
      const academicTerm = 'Spring-2017';
      const coursesPerAcademicTerm = [5, 5, 5, 5, 2, 0, 2, 2, 0, 2, 2, 0];
      await updateMethod.callPromise({
        collectionName,
        updateData: { id, degreeSlug, name, academicTerm, coursesPerAcademicTerm },
      });
    });

    it('Remove Method', async function () {
      await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
    });
  });
}
