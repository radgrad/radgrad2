import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../../app/imports/api/base/BaseCollection';
import { ROLE } from '../../app/imports/api/role/Role';
import { Opportunities } from '../../app/imports/api/opportunity/OpportunityCollection';
import { Slugs } from '../../app/imports/api/slug/SlugCollection';
import { Courses } from '../../app/imports/api/course/CourseCollection';
import { CourseInstances } from '../../app/imports/api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../app/imports/api/opportunity/OpportunityInstanceCollection';
import { CareerGoals } from '../../app/imports/api/career/CareerGoalCollection';
import { Interests } from '../../app/imports/api/interest/InterestCollection';
import { StudentProfiles } from '../../app/imports/api/user/StudentProfileCollection';
import { ProfileCareerGoals } from '../../app/imports/api/user/profile-entries/ProfileCareerGoalCollection';
import { profileGetInterestIDs } from '../../app/imports/ui/components/shared/utilities/data-model';

class StudentParticipationCollection extends BaseCollection {
  constructor() {
    super('StudentParticipationCollection', new SimpleSchema({
      itemID: SimpleSchema.RegEx.Id,
      itemSlug: String,
      itemCount: SimpleSchema.Integer,
    }));
    this.defineSchema = new SimpleSchema({
      itemSlug: String,
      itemCount: Number,
    });
    this.updateSchema = new SimpleSchema({
      itemCount: { type: Number, optional: true },
    });
  }

  /**
   * Defines the enrollment data for the given item.
   * @param itemSlug the slug for the Course or Opportunity
   * @param itemCount the number of students that have the course or opportunity in their plan.
   * @returns {any} The id of the record.
   */
  define({ itemSlug, itemCount }: StudentParticipationDefine) {
    const doc = this.collection.findOne({ itemSlug });
    if (doc) {
      return doc._id;
    }
    if (!Slugs.isDefined(itemSlug)) {
      throw new Meteor.Error(`${itemSlug} is not a defined slug.`);
    }
    const slug = Slugs.findDoc(itemSlug);
    const itemID = slug.entityID;
    return this.collection.insert({ itemID, itemSlug, itemCount });
  }

  // TODO: should we be updating StudentParticipation everytime we add something to a collection?
  /**
   * Updates the enrollment data for the given item.
   * @param docID the ID of the record.
   * @param itemCount the new itemCount.
   */
  update(docID: string, { itemCount }: StudentParticipationUpdate) {
    this.assertDefined(docID);
    const updateData: StudentParticipationUpdate = {};
    updateData.itemCount = itemCount;
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Removes the enrollment information.
   * @param docID the ID of the record.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Only ADMINs can update the records.
   * @param userId
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks itemID and itemSlug
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Courses.isDefined(doc.itemID) &&
          !Opportunities.isDefined(doc.itemID) &&
          !CareerGoals.isDefined(doc.itemID) &&
          !Interests.isDefined(doc.itemID)) {
          problems.push(`Bad itemID. ${doc.itemID} is neither a Course or Opportunity ID.`);
        }
        if (!Slugs.isSlugForEntity(doc.itemSlug, Courses.getType()) &&
          !Slugs.isSlugForEntity(doc.itemSlug, Opportunities.getType()) &&
          !Slugs.isSlugForEntity(doc.itemSlug, CareerGoals.getType()) &&
          !Slugs.isSlugForEntity(doc.itemSlug, Interests.getType())) {
          problems.push(`Bad itemSlug. ${doc.itemSlug} is neither a Course or Opportunity slug.`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the StudentParticipation docID in a format acceptable to define().
   * @param docID The docID of a StudentParticipation item.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID: string): StudentParticipationDefine {
    const doc = this.findDoc(docID);
    const itemID = doc.itemID;
    const itemSlug = doc.itemSlug;
    const itemCount = doc.itemCount;
    return { itemID, itemSlug, itemCount };
  }

  upsertEnrollmentData() {
    if (Meteor.isServer) {
      // Courses
      const courses = Courses.findNonRetired();
      courses.forEach((c) => {
        const itemID = c._id;
        const itemSlug = Slugs.getNameFromID(c.slugID);
        const items = CourseInstances.findNonRetired({ courseID: itemID });
        const itemCount = _.uniqBy(items, (i) => i.studentID).length;
        this.collection.upsert({ itemSlug }, { $set: { itemID, itemSlug, itemCount } });
      });
      // Opportunities
      Opportunities.findNonRetired().forEach((o) => {
        const itemID = o._id;
        const itemSlug = Slugs.getNameFromID(o.slugID);
        const items = OpportunityInstances.findNonRetired({ opportunityID: itemID });
        const itemCount = _.uniqBy(items, (i) => i.studentID).length;
        this.collection.upsert({ itemSlug }, { $set: { itemID, itemSlug, itemCount } });
      });
      const students = StudentProfiles.findNonRetired({ isAlumni: false });
      // CareerGoals
      const careerGoals = CareerGoals.findNonRetired();
      careerGoals.forEach((c) => {
        const itemID = c._id;
        const itemSlug = Slugs.getNameFromID(c.slugID);
        const filtered = students.filter((s) => ProfileCareerGoals.findNonRetired({ studentID: s.userID, careerGoalID: itemID }).length > 0);
        // console.log('students with careerGoal %o = %o', itemID, filtered);
        const itemCount = filtered.length;
        this.collection.upsert({ itemSlug }, { $set: { itemID, itemSlug, itemCount } });
      });
      // Interests
      const interests = Interests.findNonRetired();
      interests.forEach((i) => {
        const itemID = i._id;
        const itemSlug = Slugs.getNameFromID(i.slugID);
        const filterd = students.filter((s) => _.includes(profileGetInterestIDs(s), itemID));
        const itemCount = filterd.length;
        this.collection.upsert({ itemSlug }, { $set: { itemID, itemSlug, itemCount } });
      });
    }
  }
}

export const StudentParticipations = new StudentParticipationCollection();
