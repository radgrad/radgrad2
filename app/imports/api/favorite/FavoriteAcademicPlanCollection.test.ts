import { Meteor } from 'meteor/meteor';
import fc from 'fast-check';
import { expect } from 'chai';
import { FavoriteAcademicPlans } from './FavoriteAcademicPlanCollection';
import { makeSampleAcademicPlan } from '../degree-plan/SampleAcademicPlans';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { Users } from '../user/UserCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteAcademicPlanCollection', function testSuite() {
    let academicPlan;
    let plan;
    let student;
    let studentFirstName;
    let username;

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
      academicPlan = makeSampleAcademicPlan();
      plan = AcademicPlans.findDoc(academicPlan);
      student = makeSampleUser();
      const profile = Users.getProfile(student);
      studentFirstName = profile.firstName;
      username = profile.username;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = FavoriteAcademicPlans.define({ academicPlan, student });
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.true;
      FavoriteAcademicPlans.removeIt(docID);
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = FavoriteAcademicPlans.define({ academicPlan, student });
      const docID2 = FavoriteAcademicPlans.define({ academicPlan, student });
      expect(docID1).to.equal(docID2);
      expect(FavoriteAcademicPlans.isDefined(docID2)).to.be.true;
      FavoriteAcademicPlans.removeIt(docID2);
      expect(FavoriteAcademicPlans.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      const docID = FavoriteAcademicPlans.define({ academicPlan, student });
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.true;
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          FavoriteAcademicPlans.update(docID, { retired });
          const doc = FavoriteAcademicPlans.findDoc(docID);
          expect(doc.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = FavoriteAcademicPlans.findOne({});
      let docID = fav._id;
      const dumpObject = FavoriteAcademicPlans.dumpOne(docID);
      FavoriteAcademicPlans.removeIt(docID);
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.false;
      docID = FavoriteAcademicPlans.restoreOne(dumpObject);
      expect(FavoriteAcademicPlans.isDefined(docID)).to.be.true;
      fav = FavoriteAcademicPlans.findDoc(docID);
      expect(fav.studentID).to.equal(student);
      expect(fav.academicPlanID).to.equal(academicPlan);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = FavoriteAcademicPlans.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = FavoriteAcademicPlans.define({ academicPlan, student });
      const academicPlanDoc = FavoriteAcademicPlans.getAcademicPlanDoc(docID);
      expect(academicPlanDoc).to.exist;
      expect(academicPlanDoc.name).to.equal(plan.name);
      const academicPlanSlug = Slugs.getNameFromID(academicPlanDoc.slugID);
      expect(FavoriteAcademicPlans.getAcademicPlanSlug(docID)).to.equal(academicPlanSlug);
      const studentDoc = FavoriteAcademicPlans.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(studentFirstName);
      const studentUsername = FavoriteAcademicPlans.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
      expect(studentUsername).to.equal(username);
    });
  });
}
