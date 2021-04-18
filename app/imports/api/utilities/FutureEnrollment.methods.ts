import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { RadGradProperties } from '../radgrad/RadGradProperties';

export const enum ENROLLMENT_TYPE {
  COURSE = 'course',
  OPPORTUNITY = 'opportunity',
}

const getFutureEnrollmentSingle = (id: string, type: ENROLLMENT_TYPE) => {
  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired(
    { termNumber: { $gte: currentTerm.termNumber } },
    {
      sort: { termNumber: 1 },
      limit: numTerms,
    },
  );
  const termIDs = academicTerms.map((term) => term._id);
  switch (type) {
    case ENROLLMENT_TYPE.COURSE:
      return termIDs.map((termID) => ({ termSlug: AcademicTerms.findSlugByID(termID), count: CourseInstances.findNonRetired({ termID, courseID: id }).length }));
    case ENROLLMENT_TYPE.OPPORTUNITY:
      return termIDs.map((termID) => ({ termSlug: AcademicTerms.findSlugByID(termID), count: OpportunityInstances.findNonRetired({ termID, opportunityID: id }).length }));
  }
  return [];
};

export const getFutureEnrollmentSingleMethod = new ValidatedMethod({
  name: 'Forecast.getFutureEnrollmentSingle',
  mixins: [CallPromiseMixin],
  validate: null,
  run(id: string, type: ENROLLMENT_TYPE) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      return { id, enrollment: getFutureEnrollmentSingle(id, type) };
    }
    return {};
  },
});

export const getFutureEnrollmentMethod = new ValidatedMethod({
  name: 'Forecast.getFutureEnrollment',
  mixins: [CallPromiseMixin],
  validate: null,
  run(type: ENROLLMENT_TYPE) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get profile entries.');
    }
    if (Meteor.isServer) {
      let ids;
      switch (type) {
        case ENROLLMENT_TYPE.COURSE: {
          const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
          ids = courses.map((c) => c._id);
          break;
        }
        case ENROLLMENT_TYPE.OPPORTUNITY: {
          const opps = Opportunities.findNonRetired({}, { sort: { name: 1 } });
          ids = opps.map((o) => o._id);
          break;
        }
      }
      return ids.map((id) => ({ id, enrollment: getFutureEnrollmentSingle(id, type) }));
    }
    return [];
  },
});
