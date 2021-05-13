import { AcademicTerms } from '../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../api/course/CourseCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection';

export const enum ENROLLMENT_TYPE {
  COURSE = 'course',
  OPPORTUNITY = 'opportunity',
}

export interface EnrollmentData {
  termID: string;
  count: number;
}

export interface CourseEnrollmentForecast {
  courseID?: string;
  enrollment?: EnrollmentData[];
}

export interface OpportunityEnrollmentForecast {
  opportunityID?: string;
  enrollment?: EnrollmentData[];
}

export interface EnrollmentForecast {
  courseID?: string;
  opportunityID?: string;
  enrollment?: EnrollmentData[];
}

const getFutureEnrollmentSingle = (id: string, type: ENROLLMENT_TYPE): CourseEnrollmentForecast | OpportunityEnrollmentForecast => {
  const enrollmentForecast: EnrollmentForecast = {};
  const academicTerms = AcademicTerms.getNextYears(3); // CAM maybe it should be 2
  const termIDs = academicTerms.map((term) => term._id);
  switch (type) {
    case ENROLLMENT_TYPE.COURSE:
      enrollmentForecast.courseID = id;
      enrollmentForecast.enrollment = termIDs.map((termID) => ({
        termID,
        count: CourseInstances.findNonRetired({ termID, courseID: id }).length,
      }));
      break;
    case ENROLLMENT_TYPE.OPPORTUNITY:
      enrollmentForecast.opportunityID = id;
      enrollmentForecast.enrollment = termIDs.map((termID) => ({
        termID,
        count: OpportunityInstances.findNonRetired({ termID, opportunityID: id }).length,
      }));
      break;
  }
  return enrollmentForecast;
};

/**
 * Singleton class that calculates and updates the RadGrad forecasts.
 * @memberOf startup/server
 */
class RadGradForecastsClass {
  private coursesForecast: CourseEnrollmentForecast[];
  private opportunitiesForecast: OpportunityEnrollmentForecast[];

  private buildForecasts = () => {
    const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
    const courseIDs = courses.map((c) => c._id);
    this.coursesForecast = courseIDs.map((courseID) => getFutureEnrollmentSingle(courseID, ENROLLMENT_TYPE.COURSE));
    const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const opportunityIDs = opportunities.map((opportunity) => opportunity._id);
    this.opportunitiesForecast = opportunityIDs.map((opportunityID) => getFutureEnrollmentSingle(opportunityID, ENROLLMENT_TYPE.OPPORTUNITY));
    // console.log(this.coursesForecast, this.opportunitiesForecast);
  };

  constructor() {
    this.buildForecasts();
  }

  /**
   * Returns the enrollment forecasts for all non retired courses.
   * @return {CourseEnrollmentForecast[]}
   */
  public getCoursesForecast = (): CourseEnrollmentForecast[] => this.coursesForecast;

  /**
   * Returns the enrollment forecast for the given courseID.
   * @param {string} courseID the id of the course.
   * @return {CourseEnrollmentForecast}
   */
  public getCourseForecast = (courseID: string): CourseEnrollmentForecast => {
    const cast = this.coursesForecast.find((forecast) => forecast.courseID === courseID);
    return cast;
  };

  /**
   * Returns the enrollment forecasts for all non retired opportunities.
   * @return {OpportunityEnrollmentForecast[]}
   */
  public getOpportunitiesForecast = (): OpportunityEnrollmentForecast[] => this.opportunitiesForecast;

  /**
   * Returns the enrollment forecast for the given opportunityID.
   * @param {string} opportunityID the id of the opportunity.
   * @return {OpportunityEnrollmentForecast}
   */
  public getOpportunityForecast = (opportunityID: string): OpportunityEnrollmentForecast => {
    const cast = this.opportunitiesForecast.find((forecast) => forecast.opportunityID === opportunityID);
    return cast;
  };

  /**
   * Updates the forecasts.
   */
  public updateForecasts = (): void => {
    this.buildForecasts();
  };
}

/**
 * Singleton instance of the RadGradForecasts.
 * @type {RadGradForecastsClass}
 */
export const RadGradForecasts = new RadGradForecastsClass();
