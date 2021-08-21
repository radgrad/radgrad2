import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Courses } from '../course/CourseCollection';
import { Slugs } from '../slug/SlugCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { StarDataObject } from '../../typings/radgrad';

/**
 * Given the semester string from STAR (for example, 'Fall 2015 ext'), parses it, defines the corresponding academicTerm,
 * and returns the AcademicTerm slug.
 * @param academicTerm The STAR semester string.
 * @returns {String} The RadGrad academicTerm slug.
 * @throws Meteor.Error If parsing fails.
 * @memberOf api/star
 */
const findAcademicTermSlug = (starDataObject: StarDataObject): string => {
  const academicTerm = starDataObject.semester;
  if ((!_.isString(academicTerm)) || (academicTerm.length < 8)) {
    throw new Meteor.Error(`Could not parse academic term data: ${JSON.stringify(starDataObject)}`);
  }
  const academicTermTokens = academicTerm.split(' ');
  let term;
  switch (academicTermTokens[0]) {
    case 'Spring':
      term = AcademicTerms.SPRING;
      break;
    case 'Spr':
      term = AcademicTerms.SPRING;
      break;
    case 'Summer':
      term = AcademicTerms.SUMMER;
      break;
    case 'Sum':
      term = AcademicTerms.SUMMER;
      break;
    case 'Fall':
      term = AcademicTerms.FALL;
      break;
    case 'Winter':
      term = AcademicTerms.WINTER;
      break;
    case 'Win':
      term = AcademicTerms.WINTER;
      break;
    default:
      return null;
  }
  let year = parseInt(academicTermTokens[1], 10);
  if (isNaN(year)) {
    year = parseInt(academicTermTokens[2], 10);
    if (isNaN(year)) {
      return null;
    }
  }
  return AcademicTerms.findSlugByID(AcademicTerms.define({ term, year }));
};

/**
 * Returns the course slug, which is either an ICS course or 'other.
 * @param starDataObject The data object.
 * @returns { String } The slug.
 * @memberOf api/star
 */
const findCourseSlug = (starDataObject: StarDataObject) => {
  let slug = `${starDataObject.name.toLowerCase()}_${starDataObject.num}`;
  if (!Slugs.isSlugForEntity(slug, Courses.getType())) {
    slug = Courses.unInterestingSlug;
  }
  return slug;
};

/**
 * Creates a courseInstance data object from the passed arguments.
 * @param starDataObject STAR data.
 * @returns { Object } An object suitable for passing to CourseInstances.define.
 * @memberOf api/star
 */
const makeCourseInstanceObject = (starDataObject: StarDataObject) => ({
  academicTerm: findAcademicTermSlug(starDataObject),
  course: findCourseSlug(starDataObject),
  note: `${starDataObject.name} ${starDataObject.num}`,
  verified: true,
  fromRegistrar: true,
  creditHrs: starDataObject.credits,
  grade: starDataObject.grade,
  student: starDataObject.student,
});

/**
 * Processes STAR JSON data and returns an array of objects containing CourseInstance fields.
 * @param { String } student The slug of the student corresponding to this STAR data.
 * @param { String } jsonData JSON object for a student.
 * @returns { Array } A list of objects with fields: academicTerm, course, note, verified, grade, and creditHrs.
 * @memberOf api/star
 */
export const processStarJsonData = (student, jsonData) => {
  // console.log(jsonData);
  if (student !== jsonData.email) {
    throw new Meteor.Error(`JSON data is not for ${student}`);
  }
  const courses = jsonData.courses;
  const dataObjects = courses.map((course) => {
    const name = course.name;
    let grade = course.grade;
    if ((CourseInstances.validGrades).includes(grade)) {
      if (grade === 'CR' && course.transferGrade && isNaN(course.transferGrade)) {
        grade = course.transferGrade;
      } else if (grade === 'CR' && course.transferGrade && !isNaN(course.transferGrade)) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        if (course.transferGrade > 2) {
          grade = 'B';
        }
      }
    } else {
      grade = 'OTHER';
    }
    let num = course.number;
    if (isNaN(num)) {
      num = course.transferNumber;
    }
    const obj: StarDataObject = {
      semester: course.semester,
      name,
      num,
      credits: course.credits,
      grade,
      student,
    };
    return obj;
  });

  // console.log('single', dataObjects);
  // Now we take that array of objects and transform them into CourseInstance data objects.
  return dataObjects.map((dataObject) => makeCourseInstanceObject(dataObject)).filter((ci) => ci.course !== Courses.unInterestingSlug && ci.academicTerm !== null);
};

/**
 * Processes STAR JSON data and returns an array of objects containing CourseInstance fields.
 * @param { Array } jsonData JSON array with objects for students.
 * @returns { Array } A list of objects with fields: academicTerm, course, note, verified, grade, and creditHrs.
 * @memberOf api/star
 */
export const processBulkStarJsonData = (jsonData) => {
  const bulkData = {};
  jsonData.forEach((data) => {
    // console.log(data);
    const student = data.email;
    if (!bulkData[student]) {
      bulkData[student] = {};
      bulkData[student].courses = processStarJsonData(student, data);
      bulkData[student].firstName = data.name.first;
      bulkData[student].lastName = data.name.last;
    }
  });
  // console.log('bulk', bulkData);
  return bulkData;
};
