import { Meteor } from 'meteor/meteor';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { Users } from '../user/UserCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('AcademicYearInstances Meteor Methods ', function test() {
    const collectionName = AcademicYearInstances.getCollectionName();
    const year = 2017;
    const student = 'abi@hawaii.edu';
    const definitionData = { student, year };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions(student);
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const studentID = Users.getID(student);
      const id = AcademicYearInstances.findDoc({ year, studentID })._id;
      const springYear = 2018;
      await updateMethod.callPromise({ collectionName, updateData: { id, year: springYear, retired: true } });
    });

    it('Remove Method', async function () {
      const studentID = Users.getID(student);
      const springYear = 2018;
      const instance = AcademicYearInstances.findDoc({ year: springYear, studentID })._id;
      await removeItMethod.callPromise({ collectionName, instance });
    });
  });
}
