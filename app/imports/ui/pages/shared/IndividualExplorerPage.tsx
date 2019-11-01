import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import * as Router from '../../components/shared/RouterHelperFunctions';
import ExplorerMenu from '../../components/shared/ExplorerMenu';
import { IAcademicPlan, ICareerGoal, ICourse, IDesiredDegree, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerPlansWidget from '../../components/shared/ExplorerPlansWidget';
import ExplorerOpportunitiesWidget from '../../components/shared/ExplorerOpportunitiesWidget';
import ExplorerDegreesWidget from '../../components/shared/ExplorerDegreesWidget';
import ExplorerCoursesWidget from '../../components/shared/ExplorerCoursesWidget';
import ExplorerInterestsWidget from '../../components/shared/ExplorerInterestsWidget';
import { Slugs } from '../../../api/slug/SlugCollection';
import { ROLE } from '../../../api/role/Role';
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import ExplorerCareerGoalsWidget from '../../components/shared/ExplorerCareerGoalsWidget';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IIndividualExplorerPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course?: string;
      degree?: string;
      opportunity?: string;
      plan?: string;
      interest?: string;
      careergoal?: string;
    }
  };
}

const getMenuWidget = (props: IIndividualExplorerPageProps): JSX.Element => {
  const role = Router.getRoleByUrl(props.match);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget/>;
    case URL_ROLES.MENTOR:
      return <MentorPageMenuWidget/>;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget/>;
    default:
      return <React.Fragment/>;
  }
};

const addedPlans = (props: IIndividualExplorerPageProps): { item: IAcademicPlan, count: number }[] => {
  const profile = Users.getProfile(Router.getUsername(props.match));
  if (profile.academicPlanID) {
    return [{ item: AcademicPlans.findDoc(profile.academicPlanID), count: 1 }];
  }
  return [];
};

const plan = (props: IIndividualExplorerPageProps): IAcademicPlan => {
  const planSlugName = props.match.params.plan;
  const slug = Slugs.findDoc({ name: planSlugName });
  return AcademicPlans.findDoc({ slugID: slug._id });
};

const descriptionPairsPlans = (thePlan: IAcademicPlan): { label: string, value: any }[] => {
  const degree = DesiredDegrees.findDoc(thePlan.degreeID);
  const description = `${degree.description}\n\n${thePlan.description}`;
  return [
    { label: 'Description', value: description },
  ];
};

const addedCareerGoals = (props: IIndividualExplorerPageProps): { item: ICareerGoal, count: number }[] => {
  const goals = [];
  const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  const profile = Users.getProfile(Router.getUsername(props.match));
  _.forEach(allCareerGoals, (careerGoal) => {
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      goals.push({ item: careerGoal, count: 1 });
    }
  });
  return goals;
};

const careerGoal = (props: IIndividualExplorerPageProps): ICareerGoal => {
  const careerGoalSlugName = props.match.params.careergoal;
  const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
  const careerGoals = CareerGoals.findNonRetired({ slugID: slug[0]._id });
  return careerGoals[0];
};

const descriptionPairsCareerGoals = (theCareerGoal: ICareerGoal): { label: string, value: any }[] => [
  { label: 'Description', value: theCareerGoal.description },
  { label: 'Interests', value: _.sortBy(Interests.findNames(theCareerGoal.interestIDs)) },
];

const interestedUsersCareerGoals = (theCareerGoal: ICareerGoal, role: string): object[] => {
  let interested = [];
  const profiles = Users.findProfilesWithRole(role, {}, {});
  _.forEach(profiles, (profile) => {
    if (_.includes(profile.careerGoalIDs, theCareerGoal._id)) {
      interested.push(profile);
    }
  });
  interested = _.filter(interested, (profile) => profile.picture && profile.picture !== defaultProfilePicture);
  // only allow 50 students randomly selected.
  for (let i = interested.length - 1; i >= 50; i--) {
    interested.splice(Math.floor(Math.random() * interested.length), 1);
  }
  return interested;
};

const numUsersCareerGoals = (theCareerGoal: ICareerGoal, role: string): number => interestedUsersCareerGoals(theCareerGoal, role).length;

const numStudentsCareerGoals = (theCareerGoal: ICareerGoal): number => {
  const participatingStudents = StudentParticipations.findDoc({ itemID: theCareerGoal._id });
  return participatingStudents.itemCount;
};

const socialPairsCareerGoals = (theCareerGoal: ICareerGoal): { label: string, amount: number, value: object[] }[] => [
  {
    label: 'students', amount: numStudentsCareerGoals(theCareerGoal),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.STUDENT),
  },
  {
    label: 'faculty members', amount: numUsersCareerGoals(theCareerGoal, ROLE.FACULTY),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.FACULTY),
  },
  {
    label: 'alumni',
    amount: numUsersCareerGoals(theCareerGoal, ROLE.ALUMNI),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.ALUMNI),
  },
  {
    label: 'mentors',
    amount: numUsersCareerGoals(theCareerGoal, ROLE.MENTOR),
    value: interestedUsersCareerGoals(theCareerGoal, ROLE.MENTOR),
  },
];

const addedCourses = (props: IIndividualExplorerPageProps): { item: ICourse, count: number }[] => {
  const courese = [];
  const allCourses = _.filter(Courses.find({}, { sort: { shortName: 1 } })
    .fetch(), (c) => !c.retired);
  const userID = Router.getUserIdFromRoute(props.match);
  _.forEach(allCourses, (course) => {
    const ci = CourseInstances.find({
      studentID: userID,
      courseID: course._id,
    })
      .fetch();
    if (ci.length > 0) {
      if (course.shortName !== 'Non-CS Course') {
        courese.push({ item: course, count: ci.length });
      }
    }
  });
  return courese;
};

const course = (props: IIndividualExplorerPageProps): ICourse => {
  const courseSlugName = props.match.params.course;
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const theCourse = Courses.findDoc({ slugID: slug[0]._id });
  return theCourse;
};

const passedCourseHelper = (courseSlugName: string, props: IIndividualExplorerPageProps): string => {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const theCourse = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: theCourse[0]._id,
  })
    .fetch();
  _.forEach(ci, (c) => {
    if (c.verified === true) {
      ret = 'Completed';
    } else if (ret !== 'Completed') {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
};

const isCourseCompleted = (props: IIndividualExplorerPageProps): boolean => {
  let ret = false;
  const courseSlugName = props.match.params.course;
  const courseStatus = passedCourseHelper(courseSlugName, props);
  if (courseStatus === 'Completed') {
    ret = true;
  }
  return ret;
};

const prerequisiteStatus = (prerequisite: string, props: IIndividualExplorerPageProps) => {
  if (isSingleChoice(prerequisite)) {
    return passedCourseHelper(prerequisite, props);
  }
  const slugs = prerequisite.split(',');
  let ret = 'Not in plan';
  slugs.forEach((slug) => {
    const result = passedCourseHelper(slug, props);
    if (result === 'Completed') {
      ret = result;
    } else if (result === 'In plan, but not yet complete') {
      ret = result;
    }
  });
  return ret;
};

const prerequisites = (theCourse: ICourse, props: IIndividualExplorerPageProps): any[] => {
  const list = theCourse.prerequisites;
  const complete = [];
  const incomplete = [];
  const notInPlan = [];
  let itemStatus = '';
  _.forEach(list, (item) => {
    itemStatus = prerequisiteStatus(item, props);
    if (itemStatus === 'Not in plan') {
      notInPlan.push({ course: item, status: itemStatus });
    } else if (itemStatus === 'Completed') {
      complete.push({ course: item, status: itemStatus });
    } else {
      incomplete.push({ course: item, status: itemStatus });
    }
  });
  if (complete.length === 0 && incomplete.length === 0 && notInPlan.length === 0) {
    return null;
  }
  return [complete, incomplete, notInPlan];
};

const descriptionPairsCourses = (theCourse: ICourse, props: IIndividualExplorerPageProps): object[] => [
  { label: 'Course Number', value: theCourse.num },
  { label: 'Credit Hours', value: theCourse.creditHrs },
  { label: 'Description', value: theCourse.description },
  { label: 'Syllabus', value: theCourse.syllabus },
  { label: 'Interests', value: _.sortBy(Interests.findNames(theCourse.interestIDs)) },
  { label: 'Prerequisites', value: prerequisites(theCourse, props) },
];

const addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
  item: d,
  count: 1,
}));

const degree = (props: IIndividualExplorerPageProps): IDesiredDegree => {
  const degreeSlugName = props.match.params.degree;
  const slug = Slugs.find({ name: degreeSlugName }).fetch();
  const theDegree = DesiredDegrees.findNonRetired({ slugID: slug[0]._id });
  return theDegree[0];
};

const descriptionPairsDegrees = (theDegree: IDesiredDegree): { label: string, value: any }[] => [{
  label: 'Description',
  value: theDegree.description,
}];

const addedInterests = (props: IIndividualExplorerPageProps): { item: IInterest, count: number }[] => {
  const interests = [];
  if (Router.getUserIdFromRoute(props.match)) {
    const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    _.forEach(allInterests, (interest) => {
      if (_.includes(profile.interestIDs, interest._id)) {
        interests.push({ item: interest, count: 1 });
      }
    });
  }
  return interests;
};

const addedCareerInterests = (props: IIndividualExplorerPageProps): { item: IInterest, count: number }[] => {
  if (Router.getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    const allInterests = Users.getInterestIDsByType(profile.userID);
    return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
  }
  return [];
};

const interest = (props: IIndividualExplorerPageProps): IInterest => {
  const interestSlugName = props.match.params.interest;
  const slug = Slugs.find({ name: interestSlugName }).fetch();
  const theInterest = Interests.findNonRetired({ slugID: slug[0]._id });
  return theInterest[0];
};

const addedOpportunities = (props: IIndividualExplorerPageProps): { item: IOpportunity, count: number }[] => {
  const opportunities = [];
  const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const userID = Router.getUserIdFromRoute(props.match);
  const role = Router.getRoleByUrl(props.match);
  if (role === URL_ROLES.FACULTY) {
    return _.filter(allOpportunities, o => o.sponsorID === userID);
  }
  if (role === URL_ROLES.STUDENT) {
    _.forEach(allOpportunities, (opportunity) => {
      const oi = OpportunityInstances.find({
        studentID: userID,
        opportunityID: opportunity._id,
      }).fetch();
      if (oi.length > 0) {
        opportunities.push({ item: opportunity, count: oi.length });
      }
    });
  }
  return opportunities;
};

const opportunity = (props: IIndividualExplorerPageProps): IOpportunity => {
  const opportunitySlugName = props.match.params.opportunity;
  const slug = Slugs.find({ name: opportunitySlugName }).fetch();
  const theOpp = Opportunities.find({ slugID: slug[0]._id }).fetch();
  return theOpp[0];
};

const isOpportunityCompleted = (props: IIndividualExplorerPageProps): boolean => {
  const opportunitySlugName = props.match.params.opportunity;
  let ret = false;
  const slug = Slugs.find({ name: opportunitySlugName }).fetch();
  const theOpp = Opportunities.find({ slugID: slug[0]._id }).fetch();
  const oi = OpportunityInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    opportunityID: theOpp[0]._id,
    verified: true,
  }).fetch();
  if (oi.length > 0) {
    ret = true;
  }
  return ret;
};

const opportunityType = (theOpp: IOpportunity): string => {
  const oppType = theOpp.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
};

const academicTerms = (theOpp: IOpportunity): string[] => {
  const termIDs = theOpp.termIDs;
  return _.map(termIDs, (termID) => AcademicTerms.toString(termID));
};

const sponsor = (theOpp: IOpportunity): string => Users.getFullName(theOpp.sponsorID);

const teaser = (theOpp: IOpportunity): object => {
  const oppTeaser = Teasers.find({ opportunityID: theOpp._id }).fetch();
  return oppTeaser[0];
};


const descriptionPairsOpportunities = (theOpp: IOpportunity): { label: string, value: any }[] => [
  { label: 'Opportunity Type', value: opportunityType(theOpp) },
  { label: 'Semesters', value: academicTerms(theOpp) },
  { label: 'Event Date', value: theOpp.eventDate },
  { label: 'Sponsor', value: sponsor(theOpp) },
  { label: 'Description', value: theOpp.description },
  { label: 'Interests', value: theOpp.interestIDs },
  { label: 'ICE', value: theOpp.ice },
  { label: 'Teaser', value: teaser(theOpp) },
];


const getAddedList = (props: IIndividualExplorerPageProps): { [key: string]: any }[] => {
  const type = Router.getUrlParam(props.match, 2);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return addedPlans(props);
    case EXPLORER_TYPE.CAREERGOALS:
      return addedCareerGoals(props);
    case EXPLORER_TYPE.COURSES:
      return addedCourses(props);
    case EXPLORER_TYPE.DEGREES:
      return addedDegrees();
    case EXPLORER_TYPE.INTERESTS:
      return addedInterests(props);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return addedOpportunities(props);
    case EXPLORER_TYPE.USERS: // do nothing
      return undefined;
    default:
      return undefined;
  }
};

const getCareerList = (props: IIndividualExplorerPageProps): { [key: string]: any }[] => {
  const type = Router.getUrlParam(props.match, 2);
  switch (type) {
    case EXPLORER_TYPE.INTERESTS:
      return addedCareerInterests(props);
    default:
      return undefined;
  }
};

const getItem = (props: IIndividualExplorerPageProps): { [key: string]: any } => {
  const type = Router.getUrlParam(props.match, 2);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return plan(props);
    case EXPLORER_TYPE.CAREERGOALS:
      return careerGoal(props);
    case EXPLORER_TYPE.COURSES:
      return course(props);
    case EXPLORER_TYPE.DEGREES:
      return degree(props);
    case EXPLORER_TYPE.INTERESTS:
      return interest(props);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return opportunity(props);
    case EXPLORER_TYPE.USERS: // do nothing
      return undefined;
    default:
      return undefined;
  }
};

const getDescriptionPairs = (item: { [key: string]: any }, props: IIndividualExplorerPageProps): object[] => {
  const type = Router.getUrlParam(props.match, 2);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return descriptionPairsPlans(item as IAcademicPlan);
    case EXPLORER_TYPE.CAREERGOALS:
      return descriptionPairsCareerGoals(item as ICareerGoal);
    case EXPLORER_TYPE.COURSES:
      return descriptionPairsCourses(item as ICourse, props);
    case EXPLORER_TYPE.DEGREES:
      return descriptionPairsDegrees(item as IDesiredDegree);
    case EXPLORER_TYPE.INTERESTS:
      return undefined; // Quinne implemented the descriptionPairs into their own components
    case EXPLORER_TYPE.OPPORTUNITIES:
      return descriptionPairsOpportunities(item as IOpportunity);
    case EXPLORER_TYPE.USERS: // do nothing
      return undefined;
    default:
      return undefined;
  }
};

const IndividualExplorerPage = (props: IIndividualExplorerPageProps) => {
  const menuWidget = getMenuWidget(props);
  const type = Router.getUrlParam(props.match, 2);
  const role = Router.getRoleByUrl(props.match);

  // Variables for Explorer Menu
  const addedList = getAddedList(props);

  // Variables for Individual Explorer Widgets
  const item = getItem(props);
  const name = item.name;
  const descriptionPairs = getDescriptionPairs(item, props);

  // Variables to deal with individual props unique to a certain epxlorer type
  /* Explorer Interests Widget */
  const isTypeInterests = type === EXPLORER_TYPE.INTERESTS;
  const careerList = isTypeInterests ? getCareerList(props) : undefined;
  /* Explorer Courses Widget */
  const isTypeCourses = type === EXPLORER_TYPE.COURSES;
  const shortName = isTypeCourses ? item.shortName : undefined;
  /* Explorer Career Goals Widget */
  const isTypeCareerGoals = type === EXPLORER_TYPE.CAREERGOALS;
  const socialPairs = isTypeCareerGoals ? socialPairsCareerGoals(item as ICareerGoal) : undefined;
  /* Explorer Opportunities Widget */
  const isTypeOpportunities = type === EXPLORER_TYPE.OPPORTUNITIES;

  return (
    <React.Fragment>
      {menuWidget}

      <Grid container={true} stackable={true}>
        <Grid.Column width={3}>
          <ExplorerMenu menuAddedList={addedList}
                        menuCareerList={isTypeInterests && careerList ? careerList : undefined}
                        type={type} role={role}/>
        </Grid.Column>

        <Grid.Column width={13}>
          {
            type === EXPLORER_TYPE.ACADEMICPLANS ?
              <ExplorerPlansWidget name={name} descriptionPairs={descriptionPairs} item={item}/>
              : ''
          }
          {
            type === EXPLORER_TYPE.CAREERGOALS ?
              <ExplorerCareerGoalsWidget name={name} descriptionPairs={descriptionPairs} item={item}
                                         socialPairs={isTypeCareerGoals && socialPairs ? socialPairs : undefined}/>
              : ''
          }
          {
            type === EXPLORER_TYPE.COURSES ?
              <ExplorerCoursesWidget name={name} shortName={isTypeCourses && shortName ? shortName : undefined}
                                     descriptionPairs={descriptionPairs} item={item}
                                     completed={(isTypeCourses && isCourseCompleted(props) !== undefined) ? isCourseCompleted(props) : undefined}/>
              : ''
          }
          {
            type === EXPLORER_TYPE.DEGREES ?
              <ExplorerDegreesWidget name={name} descriptionPairs={descriptionPairs}/>
              : ''
          }
          {
            type === EXPLORER_TYPE.INTERESTS ?
              <ExplorerInterestsWidget/>
              : ''
          }
          {
            type === EXPLORER_TYPE.OPPORTUNITIES ?
              <ExplorerOpportunitiesWidget name={name} descriptionPairs={descriptionPairs} item={item}
                                           completed={(isTypeOpportunities && isOpportunityCompleted(props) !== undefined) ? isOpportunityCompleted(props) : undefined}
                                           role={role}/>
              : ''
          }
        </Grid.Column>
      </Grid>

      <BackToTopButton/>
    </React.Fragment>
  );
};


export default IndividualExplorerPage;
