import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { getFutureEnrollmentMethod } from './CourseCollection.methods';
import { Courses } from './CourseCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { nextAcademicTerm } from '../academic-term/AcademicTermUtilities';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('CourseCollection Meteor Methods ', function test() {
    const collectionName = Courses.getCollectionName();
    const definitionData = {
      name: 'Introduction to the theory and practice of scripting',
      shortName: 'Intro to Scripting',
      slug: 'ics_215',
      num: 'ICS 215',
      description: 'Introduction to scripting languages.',
      creditHrs: 4,
      interests: ['java'],
      syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
    };

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      await defineMethod.callPromise({ collectionName, definitionData });
    });

    it('Update Method', async function () {
      const id = Courses.findIdBySlug(definitionData.slug);
      const name = 'updated CareerGoal name';
      const description = 'updated CareerGoal description';
      const interests = ['algorithms', 'java'];
      await updateMethod.callPromise({
        collectionName,
        updateData: { id, name, description, interests },
      });
    });

    it('getFutureEnrollment Methods', async function () {
      // First, just call this expecting that there is no future enrollment data.
      let id = Courses.findIdBySlug(definitionData.slug);
      let data = await getFutureEnrollmentMethod.callPromise(id);
      expect(data.courseID).to.equal(id);
      expect(data.enrollmentData[0][1]).to.equal(0);

      // Now make a course instance for next academicTerm
      // console.log(nextAcademicTerm(AcademicTerms.getCurrentAcademicTermDoc()));
      const academicTerm = AcademicTerms.findIdBySlug(nextAcademicTerm(AcademicTerms.getCurrentAcademicTermDoc()).slugID);
      const student = 'abi@hawaii.edu';
      const course = 'ics_111';
      const courseInstanceDefinitionData = {
        academicTerm,
        course,
        student,
        verified: true,
        fromRegistrar: true,
        grade: 'B',
        note: '',
        creditHrs: 3,
      };
      await defineMethod.callPromise({
        collectionName: 'CourseInstanceCollection',
        definitionData: courseInstanceDefinitionData,
      });

      // We'll now expect next academicTerm to have enrollment of 1.
      id = Courses.findIdBySlug('ics_111');
      data = await getFutureEnrollmentMethod.callPromise(id);
      expect(data.courseID).to.equal(id);
      expect(data.enrollmentData[0][1]).to.equal(1);
    });

    it('Remove Method', async function () {
      await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
    });
  });
}
