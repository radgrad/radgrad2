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

