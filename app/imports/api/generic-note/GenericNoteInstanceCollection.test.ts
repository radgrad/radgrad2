import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import { GenericNoteInstances } from './GenericNoteInstanceCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { makeRandomBody, makeRandomTitle } from './SampleGenericNoteInstance';
import { IGenericNoteInstance } from '../../typings/radgrad';
import { removeAllEntities } from '../base/BaseUtilities';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Users } from '../user/UserCollection';
// import { StudentProfiles } from '../user/StudentProfileCollection';

if (Meteor.isServer) {
  describe('GenericNoteInstanceCollection', function testSuite() {

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
    });
    /**
     * in the removes the entities created by the test after test finishes
     */
    after(function teardown() {
      removeAllEntities();
    });


    /**
     * Right now every note in this test has the same title, body, academicTerm and student
     */
    it('Can define and removeIt', function test1(done) {
      // default time out is 2 sec but we expand it to 5 so the test could finish
      this.timeout(5000);
      const title = makeRandomTitle();
      const body = makeRandomBody();
      const termID = makeSampleAcademicTerm(); // returns docID get the slug for the term for define
      const userID = makeSampleUser(); // returning userID but need to give a slug/username for define
      const academicTermSlug = AcademicTerms.findSlugByID(termID);
      const studentUsername = Users.getProfile(userID).username;
      // console.log('is make sample user returning a student profile?', studentUsername);


      fc.assert(
        fc.property(fc.boolean(), (fcRetired) => {
          const docID = GenericNoteInstances.define({
            title: title,
            body: body,
            academicTerm: academicTermSlug,
            student: studentUsername,
            retired: fcRetired,
          });
          // expect(GenericNoteInstances.isDefined(docID)).to.be.true;
          const gni: IGenericNoteInstance = GenericNoteInstances.findDoc(docID);
          expect(gni.studentID).to.equal(Users.getProfile(userID).studentID);
          expect(gni.academicTerm).to.equal(AcademicTerms.getSlug(termID));
          // this should print the different notes being generated
          // console.log(GenericNoteInstances.findDoc(docID));
          GenericNoteInstances.removeIt(docID);
          // expect(GenericNoteInstances.isDefined(docID)).to.be.false;
        }),
      );
      // call done to make sure the test finishes
      done();
    });

    it('Can Update', function test2(done) {
      const title = faker.lorem.words();
      const body = faker.lorem.paragraph();
      const userID = makeSampleUser(); // returns userID
      const termID = makeSampleAcademicTerm(); // returns docID
      const academicTermSlug = AcademicTerms.findSlugByID(termID);
      const studentUsername = Users.getProfile(userID).username;
      fc.assert(
        fc.property(fc.boolean(), (fcRetired) => {
          const docID = GenericNoteInstances.define({
            title: title,
            body: body,
            academicTerm: academicTermSlug,
            student: studentUsername,
            retired: fcRetired,
          });
          // console.log('before the update, ', GenericNoteInstances.findDoc(docID));
          const newAcademicTerm = makeSampleAcademicTerm();
          const newAcademicTermSlug = AcademicTerms.findSlugByID(newAcademicTerm);
          const newTitle = faker.lorem.word();
          const newBody = faker.lorem.sentences();
          GenericNoteInstances.update(docID, {
            title: newTitle,
            body: newBody,
            student: studentUsername,
            academicTerm: newAcademicTermSlug,
          });
          const gni: IGenericNoteInstance = GenericNoteInstances.findDoc(docID);
          expect(gni.title).to.equal(newTitle);
          expect(gni.body).to.equal(newBody);
          expect(gni.academicTerm).to.equal(newAcademicTermSlug);
          expect(gni.studentID).to.equal(Users.getProfile(userID).studentID); // should not change from define
          expect(gni.retired).to.equal(fcRetired);
          // console.log('after update, ', GenericNoteInstances.findDoc(docID));
        }),
      );
      // call done to make sure the test finishes
      done();
    });
    // maybe I should add restoreOne to GNI collection
    it('Can dumpOne and removeIt and restoreOne', function test3() {
      const gni = GenericNoteInstances.findOne({});
      let docID = gni._id;
      const dumpObject = GenericNoteInstances.dumpOne(docID);
      // console.log('this is the dump object', dumpObject);
      GenericNoteInstances.removeIt(docID);
      expect(GenericNoteInstances.isDefined(docID)).to.be.false; //eslint-disable-line
      docID = GenericNoteInstances.restoreOne(dumpObject);
      expect(GenericNoteInstances.isDefined(docID)).to.be.true; //eslint-disable-line
    });
    /**
     * copied from CourseInstanceCollection.test.ts 106-107
     * checkIntegrity() returns an array with strings of errors
     * if the array is empty, it means there are no integrity errors
     */
    it('Can checkIntegrity no errors', function test4() {
      const errors = GenericNoteInstances.checkIntegrity();
      expect(errors.length).to.equal(0); // eslint-disable-line

    });
    /**
     * copied from CourseInstanceCollection.test.ts 110-115
     *
     */
    it('Can removeUser', function test5() {
      const gni: IGenericNoteInstance = GenericNoteInstances.findOne({});
      const studentID = gni.studentID;
      GenericNoteInstances.removeUser(studentID);
      expect(GenericNoteInstances.find({ student: studentID }).count()).to.equal(0);
    });
  });
}
