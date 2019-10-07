import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

interface IHasName {
  name: string;
}

interface IHasSlugID {
  slugID: string;
}

export const academicPlanIdToName = (id) => AcademicPlans.findDoc(id).name;

export const academicPlanNameToSlug = (name) => Slugs.getNameFromID(AcademicPlans.findDoc(name).slugID);

export const academicTermIdToName = (id) => AcademicTerms.toString(id, false);

export const academicTermToName = (term) => AcademicTerms.toString(term._id, false);

export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

export const academicTermNameToSlug = (name) => Slugs.getNameFromID(AcademicTerms.getAcademicTermFromToString(name).slugID);

export const careerGoalIdToName = (id) => CareerGoals.findDoc(id).name;

export const careerGoalNameToSlug = (name) => Slugs.getNameFromID(CareerGoals.findDoc(name).slugID);

export const courseToName = (course) => `${course.num}: ${course.shortName}`;

export const courseNameToCourseDoc = (name) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

export const courseNameToSlug = (name) => Slugs.getNameFromID(Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) }).slugID);

export const courseSlugToName = (slug) => courseToName(Courses.findDoc(Slugs.getEntityID(slug, 'Course')));

export const degreeShortNameToSlug = (shortName) => Slugs.getNameFromID(DesiredDegrees.findDoc({ shortName }).slugID);

export const docToName = (doc: IHasName) => doc.name;

export const docToShortName = (doc) => doc.shortName;

export const docToSlugName = (doc: IHasSlugID) => Slugs.findDoc(doc.slugID).name;

export const docToSlugNameAndType = (doc: IHasSlugID) => `${Slugs.findDoc(doc.slugID).name} (${Slugs.findDoc(doc.slugID).entityName})`;

export const interestIdToName = (id) => Interests.findDoc(id).name;

export const interestNameToId = (name) => Interests.findDoc(name)._id;

export const interestNameToSlug = (name) => {
  const interestDoc = Interests.findDoc(name);
  return Slugs.getNameFromID(interestDoc.slugID);
};

export const interestTypeNameToSlug = (name) => {
  const typeDoc = InterestTypes.findDoc(name);
  return Slugs.getNameFromID(typeDoc.slugID);
};

export const interestTypeNameToId = (name) => InterestTypes.findDoc(name)._id;

export const mentorQuestionToSlug = (question) => {
  const qDoc = MentorQuestions.findDoc({ question });
  return Slugs.getNameFromID(qDoc.slugID);
};

export const opportunityIdToName = (id) => Opportunities.findDoc(id).name;

export const opportunityNameToSlug = (name) => Slugs.getNameFromID(Opportunities.findDoc(name).slugID);

export const opportunityInstanceToName = (oi) => {
  const student = StudentProfiles.findDoc({ userID: oi.studentID }).username;
  const opportunity = Opportunities.findDoc(oi.opportunityID).name;
  const term = AcademicTerms.toString(oi.termID, false);
  return `${student}-${opportunity}-${term}`;
};

export const opportunityInstanceNameToId = (name) => {
  const parts = name.split('-');
  const opportunityDoc = Opportunities.findDoc(parts[1]);
  const opportunityID = opportunityDoc._id;
  const termParts = parts[2].split(' ');
  const term = termParts[0];
  const year = parseInt(termParts[1], 10);
  const termDoc = AcademicTerms.findDoc({ term, year });
  const termID = termDoc._id;
  const profile = StudentProfiles.findDoc({ username: parts[0] });
  const studentID = profile.userID;
  return OpportunityInstances.findDoc({ opportunityID, termID, studentID })._id;
};

export const opportunityTypeNameToSlug = (name) => {
  const doc = OpportunityTypes.findDoc(name);
  return Slugs.getNameFromID(doc.slugID);
};

export const opportunityTypeIdToName = (id) => OpportunityTypes.findDoc(id).name;

export const profileToName = (profile) => `${Users.getFullName(profile.userID)} (${profile.username})`;

export const profileToUsername = (profile) => profile.username;

export const profileNameToUsername = (name) => name.substring(name.indexOf('(') + 1, name.indexOf(')'));

export const slugIDToSlugNameAndType = (slugID) => `${Slugs.findDoc(slugID).name} (${Slugs.findDoc(slugID).entityName})`;

export const slugNameAndTypeToName = (slugAndType) => slugAndType.split(' ')[0];

export const userIdToName = (userID) => {
  const profile = Users.getProfile(userID);
  return `${Users.getFullName(userID)} (${profile.username})`;
};
