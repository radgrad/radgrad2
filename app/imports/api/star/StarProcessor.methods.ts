import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import moment from 'moment';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { Users } from '../user/UserCollection';
import { getDepartment } from '../course/CourseUtilities';
import {
  processStarCsvData,
  processStarJsonData,
  processBulkStarCsvData,
  processBulkStarJsonData,
} from './StarProcessor';
import { updateStudentLevel } from '../level/LevelProcessor';
import { StudentProfileDefine } from '../../typings/radgrad';

const processStudentStarDefinitions = (advisor, student, definitions) => {
  // console.log(`processStudentStarDefinitions(${advisor}, ${student}, ${definitions})`);
  // console.log(`Processing ${student}'s STAR data`);
  // console.log(definitions);
  const studentID = Users.getID(student);
  // console.log(student, studentID);
  const courseInstances = CourseInstances.find({ studentID }).fetch() ;
  const oldInstances = courseInstances.filter((ci) => CourseInstances.isInCurrentOrPast(ci._id));
  oldInstances.forEach((instance) => {
    CourseInstances.removeIt(instance._id);
  });
  let numInterestingCourses = 0;
  // let numOtherCourses = 0;
  // console.log('create new instances');
  const departments = {};
  definitions.forEach((definition) => {
    // console.log('termID', termID);
    // console.log(definition);
    if (definition.course !== Courses.unInterestingSlug) {
      const termID = AcademicTerms.findIdBySlug(definition.academicTerm);
      const department = getDepartment(definition.course);
      if (!(department in departments)) {
        departments[department] = 1;
      } else {
        departments[department] += 1;
      }
      numInterestingCourses += 1;
      const courseID = Courses.findIdBySlug(definition.course);
      // console.log('courseID', courseID);
      const planning = CourseInstances.find({ studentID, termID, courseID, verified: false }).fetch();
      // console.log('planning', planning);
      if (planning.length > 0) {
        CourseInstances.removeIt(planning[0]._id);
      }
    } else {
      // numOtherCourses += 1;
    }
    definition.fromRegistrar = true; // eslint-disable-line no-param-reassign
    if (definition.grade === '***' || definition.grade === 'TBD') {
      definition.grade = 'B'; // eslint-disable-line no-param-reassign
      definition.verified = false; // eslint-disable-line no-param-reassign
    }
    if (definition.course !== Courses.unInterestingSlug) {
      // console.log('CourseInstances.define', definition);
      CourseInstances.define(definition);
    }
  });
  let text = 'Uploaded ';
  for (const key in departments) {
    if (departments.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
      text = `${text} ${departments[key]} ${key}, `;
    }
  }
  text = text.substring(0, text.length - 2);
  if (numInterestingCourses > 1) {
    text = `${text} courses from STAR.`;
  } else {
    text = `${text} course from STAR.`;
  }
  // console.log(`${student} had ${numInterstingCourses} course(s)`);
  // update the student's lastRegistrarLoad
  const lastRegistrarLoad = moment().format('YYYY-MM-DD-HH-mm-ss');
  const profile = Users.getProfile(student);
  const docID = profile._id;
  StudentProfiles.update(docID, { lastRegistrarLoad });
};

/**
 * Processes the student's star data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param student the student's username.
 * @param csvData the student's STAR data.
 * @memberOf api/star
 */
const processStudentStarCsvData = (advisor, student, csvData) => {
  // console.log('processStudentStarCsvData', student, csvData);
  const definitions = processStarCsvData(student, csvData);
  processStudentStarDefinitions(advisor, student, definitions);
};

/**
 * Processes the student's star json data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param student the student's username.
 * @param jsonData the student's STAR data as JSON object.
 * @memberOf api/star
 */
const processStudentStarJsonData = (advisor, student, jsonData) => {
  const defintions = processStarJsonData(student, jsonData);
  processStudentStarDefinitions(advisor, student, defintions);
};

// TODO archive this method
/**
 * ValidatedMethod for loading student STAR data.
 * @memberOf api/star
 */
export const starLoadDataMethod = new ValidatedMethod({
  name: 'StarProcessor.loadStarCsvData',
  mixins: [CallPromiseMixin],
  validate: null,
  run(data) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
      }
      processStudentStarCsvData(data.advisor, data.student, data.csvData);
    }
  },
});

/**
 * ValidatedMethod for loading student STAR JSON data.
 * @memberOf api/star
 */
export const starLoadJsonDataMethod = new ValidatedMethod({
  name: 'StarProcessor.loadStarJsonData',
  mixins: [CallPromiseMixin],
  validate: null,
  run(data) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
      }
      processStudentStarJsonData(data.advisor, data.student, data.jsonData);
    }
  },
});

const processBulkStarDefinitions = (advisor, definitions) => {
  let updateNum = 0;
  let newStudents = 0;
  // console.log(definitions);
  if (definitions) {
    const students = Object.keys(definitions);
    students.forEach((student) => {
      if (Users.isDefined(student)) {
        updateNum += 1;
        processStudentStarDefinitions(advisor, student, definitions[student].courses);
        const studentID = Users.getID(student);
        updateStudentLevel(studentID);
      } else {
        console.log(`${student} is not defined need to create them.`);
        try {
          const definitionData: StudentProfileDefine = {
            username: student,
            firstName: definitions[student].firstName,
            lastName: definitions[student].lastName,
            level: 1,
          };
          StudentProfiles.define(definitionData);
          processStudentStarDefinitions(advisor, student, definitions[student].courses);
          const studentID = Users.getID(student);
          updateStudentLevel(studentID);
          newStudents += 1;
        } catch (e) {
          console.log(`Error defining student ${student}`, e);
        }
      }
    });
  }
  return `Updated ${updateNum} student(s), Created ${newStudents} new student(s)`;
};

/**
 * Processes the bulk star data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param csvData the student's STAR data.
 * @memberOf api/star
 */
const processBulkStarData = (advisor, csvData) => {
  const definitions = processBulkStarCsvData(csvData);
  return processBulkStarDefinitions(advisor, definitions);
};

/**
 * Processes the bulk star data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param jsonData the student's STAR JSON data.
 * @memberOf api/star
 */
const processBulkStarDataJson = (advisor, jsonData) => {
  // console.log(`processBulkStarDataJson(${advisor}`, jsonData);
  const definitions = processBulkStarJsonData(jsonData);
  // console.log(definitions);
  return processBulkStarDefinitions(advisor, definitions);
};

// TODO archive this method
/**
 * ValidatedMethod for loading bulk STAR data.
 * @memberOf api/star
 */
export const starBulkLoadDataMethod = new ValidatedMethod({
  name: 'StarProcess.bulkLoadStarCsvData',
  mixins: [CallPromiseMixin],
  validate: null,
  run(data) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
    }
    return processBulkStarData(data.advisor, data.csvData);
  },
});

export const starBulkLoadJsonDataMethod = new ValidatedMethod({
  name: 'StarProcess.bulkLoadStarJsonData',
  mixins: [CallPromiseMixin],
  validate: null,
  run(data) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
      }
      // console.log(data);
      return processBulkStarDataJson(data.advisor, data.jsonData);
    }
    return null;
  },
});
