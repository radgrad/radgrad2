import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';

export const academicTermToName = (term) => AcademicTerms.toString(term._id, false);

export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

export const academicTermNameToSlug = (name) => Slugs.getNameFromID(AcademicTerms.getAcademicTermFromToString(name).slugID);

export const courseToName = (course) => `${course.num}: ${course.shortName}`;

export const courseNameToCourseDoc = (name) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

export const courseNameToSlug = (name) => Slugs.getNameFromID(Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) }).slugID);

export const docToName = (doc) => doc.name;

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

export const opportunityIdToName = (id) => Opportunities.findDoc(id).name;

export const opportunityNameToSlug = (name) => Slugs.getNameFromID(Opportunities.findDoc(name).slugID);

export const profileToName = (profile) => `${Users.getFullName(profile.userID)} (${profile.username})`;

export const profileToUsername = (profile) => profile.username;

export const profileNameToUsername = (name) => name.substring(name.indexOf('(') + 1, name.indexOf(')'));

export const userIdToName = (userID) => {
  const profile = Users.getProfile(userID);
  return `${Users.getFullName(userID)} (${profile.username})`;
};
