import { Meteor } from 'meteor/meteor';
import { Papa } from 'meteor/harrison:papa-parse';
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
 * Returns an array of arrays, each containing data that can be made into CourseInstances.
 * @param parsedData The parsedData object returned from Papa.parse.
 * @returns { Array } A new array with extraneous elements deleted.
 * @memberOf api/star
 */
const filterParsedData = (parsedData) => {
  // First, get the actual data from the Papa results.
  let filteredData = parsedData.data;
  // Remove first element containing headers from data array.
  filteredData = _.drop(filteredData, 1);
  // Remove trailing elements that don't contain data.
  filteredData = _.dropRightWhile(filteredData, (data: any) => data.length < 5);
  // Remove test scores that appear at top.
  filteredData = _.dropWhile(filteredData, (data) => data[2].startsWith('Test'));
  return filteredData;
};

/**
 * Processes STAR CSV data and returns an array of objects containing CourseInstance fields.
 * @param { String } student The slug of the student corresponding to this STAR data.
 * @param { String } csvData A string containing the contents of a CSV file downloaded from STAR.
 * @returns { Array } A list of objects with fields: academicTerm, course, note, verified, grade, and creditHrs.
 * @memberOf api/star
 * @deprecated
 */
export const processStarCsvData = (student, csvData) => {
  if (Papa) {
    const parsedData = Papa.parse(csvData);
    if (parsedData.errors.length !== 0) {
      throw new Meteor.Error(`Error found when parsing STAR data for ${student}: ${parsedData.errors}`);
    }
    const headers = parsedData.data[0];
    // console.log('parsed data', parsedData);
    const academicTermIndex = _.findIndex(headers, (str) => str === 'Semester');
    const nameIndex = _.findIndex(headers, (str) => str === 'Course Name');
    const numberIndex = _.findIndex(headers, (str) => str === 'Course Number');
    const creditsIndex = _.findIndex(headers, (str) => str === 'Credits');
    const gradeIndex = _.findIndex(headers, (str) => str === 'Grade');
    const transferGradeIndex = _.findIndex(headers, (str) => str === 'Transfer Grade');
    // const transferCourseNameIndex = _.findIndex(headers, (str) => str === 'Transfer Course Name');
    const transferCourseNumberIndex = _.findIndex(headers, (str) => str === 'Transfer Course Number');
    // const transferCourseDesc = _.findIndex(headers, (str) => str === 'Transfer Course Description');
    if (_.every([academicTermIndex, nameIndex, numberIndex, creditsIndex, gradeIndex], (num) => num === -1)) {
      throw new Meteor.Error(`Required CSV header field was not found in ${headers}`);
    }
    const filteredData = filterParsedData(parsedData);

    // filteredData.map((data) => console.log('\n*** START ***\n', data, '\n*** END ***\n'));

    // Create array of objects containing raw data to facilitate error message during processing.
    const dataObjects = filteredData.map((data) => {
      const name = data[nameIndex];
      let grade = data[gradeIndex];
      // console.log(`grade ${grade}`);
      if (grade === 'CR' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade === 'CR' && data[transferGradeIndex] && !isNaN(data[transferGradeIndex])) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        // const exam = data[transferCourseDesc];
        if (data[transferGradeIndex] > 2) {
          grade = 'B';
        }
      } else if (grade === 'unknown' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade.includes('L')) {
        grade = 'C';
      }
      let num = data[numberIndex];
      if (isNaN(num)) {
        num = data[transferCourseNumberIndex];
      }
      const obj: StarDataObject = {
        semester: data[academicTermIndex],
        name,
        num,
        credits: data[creditsIndex],
        grade,
        student,
      };
      return obj;
    });
    // console.log(dataObjects);
    // Now we take that array of objects and transform them into CourseInstance data objects.
    return dataObjects.map((dataObject) => makeCourseInstanceObject(dataObject)).filter((ci) => ci.course !== Courses.unInterestingSlug && ci.academicTerm !== null);
  }
  // must be on the client.
  return null;
};

/**
 * Processes STAR CSV data.
 * @deprecated
 * @param csvData
 */
export const processBulkStarCsvData = (csvData) => {
  if (Papa) {
    const parsedData = Papa.parse(csvData);
    if (parsedData.errors.length !== 0) {
      throw new Meteor.Error(`Error found when parsing STAR data for ${parsedData.errors}`);
    }
    const headers = parsedData.data[0];
    // console.log('parsed data', parsedData);
    const academicTermIndex = _.findIndex(headers, (str) => str === 'Semester');
    const nameIndex = _.findIndex(headers, (str) => str === 'Course Name');
    const numberIndex = _.findIndex(headers, (str) => str === 'Course Number');
    const creditsIndex = _.findIndex(headers, (str) => str === 'Credits');
    const gradeIndex = _.findIndex(headers, (str) => str === 'Grade');
    const transferGradeIndex = _.findIndex(headers, (str) => str === 'Transfer Grade');
    // const transferCourseNameIndex = _.findIndex(headers, (str) => str === 'Transfer Course Name');
    const transferCourseNumberIndex = _.findIndex(headers, (str) => str === 'Transfer Course Number');
    // const transferCourseDesc = _.findIndex(headers, (str) => str === 'Transfer Course Description');
    const emailIndex = _.findIndex(headers, (str) => str === 'Email');
    const firstNameIndex = _.findIndex(headers, (str) => str === 'First Name');
    const lastNameIndex = _.findIndex(headers, (str) => str === 'Last Name');
    if (_.every([academicTermIndex, nameIndex, numberIndex, creditsIndex, gradeIndex, emailIndex, firstNameIndex, lastNameIndex], (num) => num === -1)) {
      throw new Meteor.Error(`Required CSV header field was not found in ${headers}`);
    }
    const filteredData = filterParsedData(parsedData);
    // Create array of objects containing raw data to facilitate error message during processing.
    const bulkData = {};
    filteredData.forEach((data) => {
      const name = data[nameIndex];
      let grade = data[gradeIndex];
      // console.log(`grade ${grade}`);
      if (grade === 'CR' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade === 'CR' && data[transferGradeIndex] && !isNaN(data[transferGradeIndex])) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        // const exam = data[transferCourseDesc];
        if (data[transferGradeIndex] > 2) {
          grade = 'B';
        }
      } else if (grade === 'unknown' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade.includes('L')) {
        grade = 'C';
      }
      let num = data[numberIndex];
      if (isNaN(num)) {
        num = data[transferCourseNumberIndex];
      }
      const student = data[emailIndex];
      const obj: StarDataObject = {
        semester: data[academicTermIndex],
        name,
        num,
        credits: data[creditsIndex],
        grade,
        student,
      };
      if (!bulkData[student]) {
        bulkData[student] = {};
        bulkData[student].courses = [];
        bulkData[student].firstName = data[firstNameIndex];
        bulkData[student].lastName = data[lastNameIndex];
      }
      bulkData[student].courses.push(obj);
    });
    // Now we take that array of objects and transform them into CourseInstance data objects.
    Object.keys(bulkData).forEach((key) => {
      bulkData[key].courses = bulkData[key].courses.map((dataObject) => makeCourseInstanceObject(dataObject)).filter((ci) => ci.course !== Courses.unInterestingSlug && ci.academicTerm !== null);
    });
    return bulkData;
  }
  return null;
};

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
    let semester = course.semester;
    if (!Meteor.settings.public.quarterSystem) {
      const split = semester.split(' ');
      if (split[0] === AcademicTerms.WINTER) {
        const yearSplit = split[1].split('/');
        semester = `${AcademicTerms.FALL} ${yearSplit[0]}`;
      }
    }
    const obj: StarDataObject = {
      semester,
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
