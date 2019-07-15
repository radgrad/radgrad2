import { Meteor } from 'meteor/meteor';
import {} from 'mocha';
import { expect } from 'chai';
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

    it('Define, update, remove Methods', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const id = await defineMethod.callPromise({ collectionName, definitionData });
      expect(id).to.exist;
      let instance = CourseInstances.findCourseInstanceDoc(academicTerm, course, student);
      expect(instance.grade).to.equal('B');
      const verified = false;
      const grade = 'A';
      const creditHrs = 4;
      await updateMethod.callPromise({ collectionName, updateData: { id, verified, grade, creditHrs } });
      instance = CourseInstances.findCourseInstanceDoc(academicTerm, course, student);
      expect(instance.grade).to.equal('A');
      await removeItMethod.callPromise({ collectionName, instance });
      expect(CourseInstances.count()).to.equal(0);
    });
  });
}
