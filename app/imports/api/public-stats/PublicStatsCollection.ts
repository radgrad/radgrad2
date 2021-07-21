import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import moment from 'moment';
import BaseCollection from '../base/BaseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { Internships } from '../internship/InternshipCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { Reviews } from '../review/ReviewCollection';
import { Users } from '../user/UserCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';

/**
 * PublicStats holds statistics about RadGrad that can be accessed without logging in.
 * These are referenced in the landing page and the guided tour.
 * Basically, the collection is a set of documents with two fields: key and value.
 * The field this.stats holds a list of strings which define the set of legal keys.
 * Each of these strings is also the name of a method in this class which is responsible for calculating the value
 * associated with the key and then upserting the key-value pair into the collection.
 *
 * See startup/server/initialize-db.js for the code that starts a cron job that updates this collection when the
 * system starts up and once a day thereafter.
 *
 * @extends api/base.BaseCollection
 * @memberOf api/public-stats
 */
class PublicStatsCollection extends BaseCollection {
  private readonly stats: string[];

  public coursesTotalKey: string;

  public coursesUpdateTime: string; // format YYYY-MM-DD-HH-mm-ss

  public careerGoalsTotalKey: string;

  public careerGoalsListKey: string;

  public careerGoalsUpdateTime: string; // format YYYY-MM-DD-HH-mm-ss

  public interestsTotalKey: string;

  public interestsListKey: string;

  public interestsUpdateTime: string; // format YYYY-MM-DD-HH-mm-ss

  public internshipsTotalKey: string;

  public internshipsListKey: string;

  public internshipsUpdateTime: string; // format YYYY-MM-DD-HH-mm-ss

  public opportunitiesTotalKey: string;

  public opportunitiesProjectsTotalKey: string;

  public opportunitiesProjectsListKey: string;

  public opportunitiesUpdateTime: string; // format YYYY-MM-DD-HH-mm-ss

  public usersTotalKey: string;

  public usersStudentsTotalKey: string;

  public usersFacultyTotalKey: string;

  public courseReviewsTotalKey: string;

  public courseReviewsCoursesKey: string;

  public levelOneTotalKey: string;

  public levelTwoTotalKey: string;

  public levelThreeTotalKey: string;

  public levelFourTotalKey: string;

  public levelFiveTotalKey: string;

  public levelSixTotalKey: string;

  /**
   * Creates the PublicStats collection.
   */
  constructor() {
    super('PublicStats', new SimpleSchema({
      key: { type: String },
      value: { type: String },
    }));
    this.stats = [];
    this.coursesTotalKey = 'coursesTotal';
    this.stats.push(this.coursesTotalKey);
    this.coursesUpdateTime = 'coursesUpdateTime';
    this.careerGoalsTotalKey = 'careerGoalsTotal';
    this.stats.push(this.careerGoalsTotalKey);
    this.careerGoalsListKey = 'careerGoalsList';
    this.stats.push(this.careerGoalsListKey);
    this.careerGoalsUpdateTime = 'careerGoalUpdateTime';
    this.interestsTotalKey = 'interestsTotal';
    this.stats.push(this.interestsTotalKey);
    this.interestsListKey = 'interestsList';
    this.stats.push(this.interestsListKey);
    this.interestsUpdateTime = 'interestsUpdateTime';
    this.internshipsTotalKey = 'internshipsTotal';
    this.stats.push(this.internshipsTotalKey);
    this.internshipsListKey = 'internshipsList';
    this.stats.push(this.internshipsListKey);
    this.internshipsUpdateTime = 'internshipsUpdateTime';
    this.opportunitiesTotalKey = 'opportunitiesTotal';
    this.stats.push(this.opportunitiesTotalKey);
    this.opportunitiesProjectsTotalKey = 'opportunitiesProjectsTotal';
    this.stats.push(this.opportunitiesProjectsTotalKey);
    this.opportunitiesProjectsListKey = 'opportunitiesProjectsList';
    this.stats.push(this.opportunitiesProjectsListKey);
    this.opportunitiesUpdateTime = 'opportunitiesUpdateTime';
    this.usersTotalKey = 'usersTotal';
    this.stats.push(this.usersTotalKey);
    this.usersStudentsTotalKey = 'usersStudentsTotal';
    this.stats.push(this.usersStudentsTotalKey);
    this.usersFacultyTotalKey = 'usersFacultyTotal';
    this.stats.push(this.usersFacultyTotalKey);
    this.courseReviewsTotalKey = 'courseReviewsTotal';
    this.stats.push(this.courseReviewsTotalKey);
    this.courseReviewsCoursesKey = 'courseReviewsCourses';
    this.stats.push(this.courseReviewsCoursesKey);
    this.levelOneTotalKey = 'levelOneTotal';
    this.stats.push(this.levelOneTotalKey);
    this.levelTwoTotalKey = 'levelTwoTotal';
    this.stats.push(this.levelTwoTotalKey);
    this.levelThreeTotalKey = 'levelThreeTotal';
    this.stats.push(this.levelThreeTotalKey);
    this.levelFourTotalKey = 'levelFourTotal';
    this.stats.push(this.levelFourTotalKey);
    this.levelFiveTotalKey = 'levelFiveTotal';
    this.stats.push(this.levelFiveTotalKey);
    this.levelSixTotalKey = 'levelSixTotal';
    this.stats.push(this.levelSixTotalKey);
  }

  public careerGoalsTotal() {
    const count = CareerGoals.find().count();
    this.collection.upsert({ key: this.careerGoalsTotalKey }, { $set: { value: `${count}` } });
  }

  public careerGoalsList() {
    const goals = CareerGoals.findNonRetired();
    const names = goals.map((goal) => goal.name);
    const nameStr = names.length > 0 ? names.join(', ') : 'none';
    this.collection.upsert({ key: this.careerGoalsListKey }, { $set: { value: nameStr } });
  }

  public setCareerGoalUpdateTime(time: string) {
    this.collection.upsert({ key: this.careerGoalsUpdateTime }, { $set: { value: time } });
  }

  public coursesTotal() {
    const count = Courses.findNonRetired().length;
    this.collection.upsert({ key: this.coursesTotalKey }, { $set: { value: `${count}` } });
  }

  public setCoursesUpdateTime(time: string) {
    this.collection.upsert({ key: this.coursesUpdateTime }, { $set: { value: time } });
  }

  public interestsTotal() {
    const numInterests = Interests.countNonRetired();
    this.collection.upsert({ key: this.interestsTotalKey }, { $set: { value: `${numInterests}` } });
  }

  public interestsList() {
    const interests = Interests.findNonRetired();
    const names = interests.map((interest) => interest.name);
    const nameStr = names.length > 0 ? names.join(', ') : 'none';
    this.collection.upsert({ key: this.interestsListKey }, { $set: { value: nameStr } });
  }

  public setInterestsUpdateTime(time: string) {
    this.collection.upsert({ key: this.interestsUpdateTime }, { $set: { value: time } });
  }

  public internshipsTotal() {
    const numInternships = Internships.countNonRetired();
    this.collection.upsert({ key: this.internshipsTotalKey }, { $set: { value: `${numInternships}` } });
  }

  public internshipsList() {
    const internships = Internships.findNonRetired();
    const names = internships.map((interest) => interest.position);
    const nameStr = names.length > 0 ? names.join(', ') : 'none';
    this.collection.upsert({ key: this.internshipsListKey }, { $set: { value: nameStr } });
  }

  public setInternshipsUpdateTime(time: string) {
    this.collection.upsert({ key: this.internshipsUpdateTime }, { $set: { value: time } });
  }

  public opportunitiesTotal() {
    const numOpps = Opportunities.countNonRetired();
    this.collection.upsert({ key: this.opportunitiesTotalKey }, { $set: { value: `${numOpps}` } });
  }

  public opportunitiesProjectsTotal() {
    const projectType = OpportunityTypes.findDoc({ name: 'Project' });
    const numProjects = Opportunities.findNonRetired({ opportunityTypeID: projectType._id }).length;
    this.collection.upsert({ key: this.opportunitiesProjectsTotalKey }, { $set: { value: `${numProjects}` } });
  }

  public opportunitiesProjectsList() {
    const projectType = OpportunityTypes.findDoc({ name: 'Project' });
    const projects = Opportunities.findNonRetired({ opportunityTypeID: projectType._id });
    const names = projects.map((project) => project.name);
    const nameStr = names.length > 0 ? names.join(', ') : 'none';
    this.collection.upsert({ key: this.opportunitiesProjectsListKey }, { $set: { value: nameStr } });
  }

  public setOpportunitiesUpdateTime(time: string) {
    this.collection.upsert({ key: this.opportunitiesUpdateTime }, { $set: { value: time } });
  }

  public upsertLevelTotal(level, key) {
    const numUsers = StudentProfiles.find({ level }).count();
    this.collection.upsert({ key }, { $set: { value: `${numUsers}` } });
  }

  public levelOneTotal() {
    this.upsertLevelTotal(1, this.levelOneTotalKey);
  }

  public levelTwoTotal() {
    this.upsertLevelTotal(2, this.levelTwoTotalKey);
  }

  public levelThreeTotal() {
    this.upsertLevelTotal(3, this.levelThreeTotalKey);
  }

  public levelFourTotal() {
    this.upsertLevelTotal(4, this.levelFourTotalKey);
  }

  public levelFiveTotal() {
    this.upsertLevelTotal(5, this.levelFiveTotalKey);
  }

  public levelSixTotal() {
    this.upsertLevelTotal(6, this.levelSixTotalKey);
  }

  public usersTotal() {
    const numUsers = Users.findProfiles({}, {}).length;
    this.collection.upsert({ key: this.usersTotalKey }, { $set: { value: `${numUsers}` } });
  }

  public usersStudentsTotal() {
    const numUsers = StudentProfiles.find().count();
    this.collection.upsert({ key: this.usersStudentsTotalKey }, { $set: { value: `${numUsers}` } });
  }

  public usersFacultyTotal() {
    const numUsers = FacultyProfiles.find().count();
    this.collection.upsert({ key: this.usersFacultyTotalKey }, { $set: { value: `${numUsers}` } });
  }

  public courseReviewsTotal() {
    const numCourseReviews = Reviews.find({ reviewType: 'course' }).count();
    this.collection.upsert({ key: this.courseReviewsTotalKey }, { $set: { value: `${numCourseReviews}` } });
  }

  public courseReviewsCourses() {
    const courseReviews = Reviews.findNonRetired({ reviewType: 'course' });
    let courseNumbers = [];
    courseReviews.forEach((review) => {
      const course = Courses.findDoc(review.revieweeID);
      courseNumbers.push(course.num);
    });
    courseNumbers = _.uniq(courseNumbers);
    if (courseNumbers.length > 0) {
      this.collection.upsert({ key: this.courseReviewsCoursesKey }, { $set: { value: courseNumbers.join(', ') } });
    }
  }

  public generateStats() {
    if (!(Meteor.isTest || Meteor.isAppTest)) {
      // CAM We have to do this.
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const instance = this;
      this.stats.forEach((key) => instance[key]());
    }
  }

  /**
   * Returns the value for the given key, or empty string if invalid key.
   * @param {string} key
   * @returns {string}
   */
  public getPublicStat(key: string): string {
    try {
      return this.findDoc({ key }).value;
    } catch (e) {
      return '';
    }
  }

  /**
   * Returns an empty array to indicate no integrity checking.
   * @returns {Array} An empty array.
   */
  public checkIntegrity() {
    return [];
  }

  /**
   * Returns a date object corresponding to the passed key, which should be one of the lastUpdate fields in YYYY-MM-DD-HH-mm-ss.
   * @param key Should be PublicStats.opportunitiesUpdateTime etc.
   */
  public getLastUpdateTimestamp(key: string) {
    return moment(PublicStats.getPublicStat(key), 'YYYY-MM-DD-HH-mm-ss');
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/public-stats.PublicStatsCollection}
 * @memberOf api/public-stats
 */
export const PublicStats = new PublicStatsCollection();
