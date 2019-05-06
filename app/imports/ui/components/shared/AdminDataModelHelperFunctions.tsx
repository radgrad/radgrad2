import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';

export const academicTermToName = (term) => AcademicTerms.toString(term._id, false);

export const academicTermNameToDoc = (name) => AcademicTerms.getAcademicTermFromToString(name);

export const courseToName = (course) => `${course.num}: ${course.shortName}`;

export const courseNameToCourseDoc = (name) => Courses.findDoc({ shortName: name.substring(name.indexOf(':') + 2) });

export const docToName = (doc) => doc.name;

export const profileToName = (profile) => `${Users.getFullName(profile.userID)} (${profile.username})`;

export const profileToUsername = (profile) => profile.username;

export const profileNameToUsername = (name) => name.substring(name.indexOf('(') + 1, name.indexOf(')'));
