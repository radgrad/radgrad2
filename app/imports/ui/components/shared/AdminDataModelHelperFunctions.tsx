import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

export const academicTermToName = (term) => AcademicTerms.toString(term._id, false);

export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

export const courseToName = (course) => `${course.num}: ${course.shortName}`;

export const courseNameToCourseDoc = (name) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

export const docToName = (doc) => doc.name;

export const interestIdToName = (id) => Interests.findDoc(id).name;

export const interestNameToId = (name) => Interests.findDoc(name)._id;

export const interestNameToSlug = (name) => {
  const interestDoc = Interests.findDoc(name);
  return Slugs.getNameFromID(interestDoc.slugID);
};

export const profileToName = (profile) => `${Users.getFullName(profile.userID)} (${profile.username})`;

export const profileToUsername = (profile) => profile.username;

export const profileNameToUsername = (name) => name.substring(name.indexOf('(') + 1, name.indexOf(')'));
