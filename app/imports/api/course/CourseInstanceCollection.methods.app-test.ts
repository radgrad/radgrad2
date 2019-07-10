import { Meteor } from 'meteor/meteor';
import {} from 'mocha';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { CourseInstances } from './CourseInstanceCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CourseInstanceCollection Meteor Methods ', function test() {
    const collectionName = CourseInstances.getCollectionName();
    const academicTerm = 'Spring-2017';
    const student = 'abi@hawaii.edu';
    const course = 'ics_111';
    const definitionData = {
      academicTerm,
      course,
      student,
      verified: true,
      fromRegistrar: true,
      grade: 'B',
      note: '',
      creditHrs: 3,
    };

    before(function (done) {
      this.timeout(5000);
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
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
        const id = CourseInstances.findCourseInstanceDoc(academicTerm, course, student)._id;
        const verified = false;
        const grade = 'A';
        const creditHrs = 4;
        await updateMethod.callPromise({ collectionName, updateData: { id, verified, grade, creditHrs } });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('Remove Method', async function (done) {
      try {
        const instance = CourseInstances.findCourseInstanceDoc(academicTerm, course, student)._id;
        await removeItMethod.callPromise({ collectionName, instance });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
