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

