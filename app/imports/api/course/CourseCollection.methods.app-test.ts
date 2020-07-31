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
      prerequisites: ['ics_111'],
    };
    let docID;

    before(function (done) {
      this.timeout(50000);
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Courses.isDefined(docID)).to.be.true;
    });

    it('Update Method', async function () {
      const updateData: any = {};
      const id = docID;
      console.log(`${definitionData.slug}'s id is `, id);
      updateData.id = id;
      updateData.name = 'updated Course name';
      updateData.description = 'updated Course description';
      updateData.interests = ['algorithms', 'java'];
      updateData.prerequisites = ['ics_111', 'ics_141'];
      await updateMethod.callPromise({
        collectionName,
        updateData,
      });
      const course = Courses.findDoc(docID);
      console.log(course);
      expect(course.name).to.equal(updateData.name);
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

    it('Remove Method', async function (done) {
      this.timeout(5000);
      await removeItMethod.callPromise({ collectionName, instance: definitionData.slug });
      done();
    });
  });
}
