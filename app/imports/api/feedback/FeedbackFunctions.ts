import _ from 'lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { FeedbackInstances } from './FeedbackInstanceCollection';
import { clearFeedbackInstancesMethod } from './FeedbackInstanceCollection.methods';
import { defineMethod } from '../base/BaseCollection.methods';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import * as oppUtils from '../opportunity/OpportunityUtilities';
import * as yearUtils from '../degree-plan/AcademicYearUtilities';
import * as planUtils from '../degree-plan/PlanChoiceUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/**
 * Provides FeedbackFunctions. Each FeedbackFunction is a method of the singleton instance FeedbackFunctions.
 * Each FeedbackFunction accepts a studentID and updates the FeedbackInstanceCollection based upon the current state
 * of the student. Normally, the FeedbackFunction will first delete any FeedbackInstances it previously created
 * for that student (if any), then add new ones if appropriate.
 *
 * Note that FeedbackFunctions call Meteor Methods to define and delete FeedbackInstances, so these functions must
 * be called on the client side.
 * @example
 * import { FeedbackFunctions } from '../feedback/FeedbackFunctions';
 *   :
 * FeedbackFunctions.recommendedCoursesThisAcademicTermByInterest(studentID);
 * @class FeedbackFunctions
 * @memberOf api/feedback
 */
export class FeedbackFunctionClass {
  public feedbackFunctionNames = [
    'checkPrerequisites',
    'checkCompletePlan',
    'checkOverloadedAcademicTerms',
    'generateRecommendedCourse',
    'generateRecommended400LevelCourse',
    'generateRecommendedCurrentAcademicTermOpportunities',
    'generateNextLevelRecommendation',
  ];

  /**
   * Checks the student's degree plan to ensure that all the prerequisites are met.
   * @param user the student's ID.
   */
  public checkPrerequisites(user: string) {
    const functionName = 'checkPrerequisites';
    const feedbackType = FeedbackInstances.WARNING;
    const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const studentID = Users.getID(user);

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    // Now iterate through all the CourseInstances associated with this student.
    const cis = CourseInstances.find({ studentID }).fetch();
    cis.forEach((ci) => {
      const academicTerm = AcademicTerms.findDoc(ci.termID);
      if (academicTerm.termNumber > currentAcademicTerm.termNumber) {
        const academicTermName = AcademicTerms.toString(ci.termID, false);
        const course = Courses.findDoc(ci.courseID);
        if (course) {
          const prereqs = course.prerequisites;
          prereqs.forEach((p) => {
            const courseID = Slugs.getEntityID(p, 'Course');
            const prerequisiteCourse = Courses.findDoc({ _id: courseID });
            const preCiIndex = _.findIndex(cis, (obj) => obj.courseID === courseID);
            if (preCiIndex !== -1) {
              const preCi = cis[preCiIndex];
              const preCourse = Courses.findDoc(preCi.courseID);
              const preAcademicTerm = AcademicTerms.findDoc(preCi.termID);
              if (preAcademicTerm) {
                if (preAcademicTerm.termNumber >= academicTerm.termNumber) {
                  const academicTermName2 = AcademicTerms.toString(preAcademicTerm._id, false);
                  const description = `${academicTermName}: ${course.num}'s prerequisite ${preCourse.num} is ` +
                    `after or in ${academicTermName2}.`;
                  const definitionData = { user, functionName, description, feedbackType };
                  defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
                }
              }
            } else {
              const description = `${academicTermName}: Prerequisite ${prerequisiteCourse.num} for ${course.num}` +
                ' not found.';
              const definitionData = { user, functionName, description, feedbackType };
              defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
            }
          });
        }
      }
    });
  }

  /**
   * Checks the student's degree plan to ensure that there aren't too many courses in any one academicTerm.
   * @param user the student's ID.
   */
  public checkOverloadedAcademicTerms(user: string) {
    const functionName = 'checkOverloadedAcademicTerms';
    console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.WARNING;
    const studentID = Users.getID(user);

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const currentAcademicTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const academicTerms = yearUtils.getStudentTerms(user);
    let haveOverloaded = false;
    let description = 'Your plan is overloaded. ';
    academicTerms.forEach((termID) => {
      const academicTerm = AcademicTerms.findDoc(termID);
      if (academicTerm.termNumber > currentAcademicTerm.termNumber) {
        const cis = CourseInstances.find({ studentID, termID, note: /ICS/ }).fetch();
        if (cis.length > 2) {
          haveOverloaded = true;
          description = `${description} ${AcademicTerms.toString(termID, false)}, `;
        }
      }
    });
    description = description.substring(0, description.length - 2);
    if (haveOverloaded) {
      const definitionData = { user, functionName, description, feedbackType };
      defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
    }
  }

  /**
   * Creates recommended courses based upon the student's interests. Only generates feedback if the student's plan
   * is missing courses.
   * @param user the student's ID.
   */
  public generateRecommendedCourse(user: string) {
    const functionName = 'generateRecommendedCourse';
    console.log(`Running feedback function ${functionName}`);
    // const feedbackType = FeedbackInstances.RECOMMENDATION;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });
    // TODO fix this since we don't have academic plans.
  }

  public generateRecommended400LevelCourse(user: string) {
    const functionName = 'generateRecommended400LevelCourse';
    // console.log(`Running feedback function ${functionName}`);
    // const feedbackType = FeedbackInstances.RECOMMENDATION;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });
    // TODO fix this.
  }

  /**
   * Creates a recommended opportunities FeedbackInstance for the given student and the current academicTerm.
   * @param user the student's ID.
   */
  public generateRecommendedCurrentAcademicTermOpportunities(user: string) {
    const functionName = 'generateRecommendedCurrentAcademicTermOpportunities';
    // console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.RECOMMENDATION;
    const studentID = Users.getID(user);

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    let bestChoices = oppUtils.getStudentCurrentAcademicTermOpportunityChoices(user);
    const basePath = this.getBasePath(user);
    const termID = AcademicTerms.getCurrentTermID();
    const oppInstances = OpportunityInstances.find({ studentID, termID }).fetch();
    if (oppInstances.length === 0) { // only make suggestions if there are no opportunities planned.
      // console.log(bestChoices);
      if (bestChoices) {
        const len = bestChoices.length;
        if (len > 3) {
          bestChoices = _.drop(bestChoices, len - 3);
        }
        let description = 'Consider the following opportunities for this academicTerm: ';
        bestChoices.forEach((opp) => {
          const slug = Slugs.findDoc(opp.slugID);
          description = `${description} \n- [${opp.name}](${basePath}explorer/opportunities/${slug.name}), `;
        });
        description = description.substring(0, description.length - 2);
        const definitionData = { user, functionName, description, feedbackType };
        defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
      }
    }
  }

  /**
   * Creates a recommendation for getting to the next RadGrad Level.
   * @param user The student's ID.
   */
  public generateNextLevelRecommendation(user: string) {
    const functionName = 'generateNextLevelRecommendation';
    // console.log(`Running feedback function ${functionName}`);
    const feedbackType = FeedbackInstances.RECOMMENDATION;

    // First clear any feedback instances previously created for this student.
    clearFeedbackInstancesMethod.call({ user, functionName });

    const studentProfile = Users.getProfile(user);
    // Need to build the route not use current route since might be the Advisor.
    const basePath = this.getBasePath(user);
    let description = 'Getting to the next Level: ';
    switch (studentProfile.level) {
      case 0:
        description = `${description} Take and pass [ICS 111](${basePath}explorer/courses/ics111) and [ICS 141](${basePath}explorer/courses/ics141)`;
        break;
      case 1:
        description = `${description} Take and pass [ICS 211](${basePath}explorer/courses/ics211) and [ICS 241](${basePath}explorer/courses/ics241)`;
        break;
      case 2:
        description = `${description} Get some innovation and experience [ICE points](${basePath}home/ice)`;
        break;
      case 3:
        description = `${description} Get some more innovation and experience [ICE points](${basePath}home/ice)`;
        break;
      case 4:
        description = `${description} Get some more innovation and experience [ICE points](${basePath}home/ice) and go review something.`;
        break;
      case 5:
        description = `${description} Get some more innovation and experience [ICE points](${basePath}home/ice) and do more reviews.`;
        break;
      default:
        description = '';
    }
    if (description) {
      const definitionData = { user, functionName, description, feedbackType };
      defineMethod.call({ collectionName: 'FeedbackInstanceCollection', definitionData });
    }
  }

  /**
   * Returns an array of the course slugs that are missing from the plan.
   * @param courseIDs The IDs of the courses taken by the student.
   * @param coursesNeeded An array of the course slugs needed for the degree.
   * @return {*|Array.<T>}
   */
  private missingCourses(courseIDs, coursesNeeded) {
    const planChoices = coursesNeeded.splice(0);
    courseIDs.forEach((id) => {
      const course = Courses.findDoc(id);
      const slug = Slugs.getNameFromID(course.slugID);
      const index = planUtils.planIndexOf(planChoices, slug);
      if (index !== -1) {
        planChoices.splice(index, 1);
      }
    });
    return planChoices;
  }

  private getBasePath(studentID) {
    // console.log(studentID);
    // const getPosition = (str, subString, index) => {
    //   return str.split(subString, index).join(subString).length;
    // };
    // if (FlowRouter.current()) {
    //   const currentRoute = FlowRouter.current().path;
    //   if (currentRoute.startsWith('/advisor')) {
    //     const username = Users.getProfile(studentID).username;
    //     basePath = `/student/${username}/`;
    //   } else {
    //     const index = getPosition(currentRoute, '/', 3);
    //     basePath = currentRoute.substring(0, index + 1);
    //   }
    // }
    return '';
  }
}

/**
 * Singleton instance for all FeedbackFunctions.
 * @type {FeedbackFunctionClass}
 * @memberOf api/feedback
 */
export const FeedbackFunctions = new FeedbackFunctionClass();
