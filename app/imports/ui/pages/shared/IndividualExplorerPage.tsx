import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
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
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import ExplorerCareerGoalsWidget from '../../components/shared/ExplorerCareerGoalsWidget';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';

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

class IndividualExplorerPage extends React.Component<IIndividualExplorerPageProps> {
  constructor(props) {
    super(props);
  }

  private getType = (): string => Router.getUrlParam(this.props.match, 2);

  private getSlug = (): string => Router.getLastUrlParam(this.props.match);

  private getRole = (): string => Router.getRoleByUrl(this.props.match);

  private getMenuWidget = (): JSX.Element => {
    const role = this.getRole();
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
  }

  /* ################################################# EXPLORER MENU HELPER FUNCTIONS ############################### */
  private getAddedList = (): { [key: string]: any }[] => {
    const type = this.getType();
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return this.addedPlans();
      case EXPLORER_TYPE.CAREERGOALS:
        return this.addedCareerGoals();
      case EXPLORER_TYPE.COURSES:
        return this.addedCourses();
      case EXPLORER_TYPE.DEGREES:
        return this.addedDegrees();
      case EXPLORER_TYPE.INTERESTS:
        return this.addedInterests();
      case EXPLORER_TYPE.OPPORTUNITIES:
        return this.addedOpportunities();
      case EXPLORER_TYPE.USERS: // do nothing
        return undefined;
      default:
        return undefined;
    }
  }

  private getCareerList = (): { [key: string]: any }[] => {
    const type = this.getType();
    switch (type) {
      case EXPLORER_TYPE.INTERESTS:
        return this.addedCareerInterests();
      default:
        return undefined;
    }
  }

  /* ################################################# WIDGET HELPER FUNCTIONS ###################################### */
  private getItem = (): { [key: string]: any } => {
    const type = this.getType();
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return this.plan();
      case EXPLORER_TYPE.CAREERGOALS:
        return this.careerGoal();
      case EXPLORER_TYPE.COURSES:
        return this.course();
      case EXPLORER_TYPE.DEGREES:
        return this.degree();
      case EXPLORER_TYPE.INTERESTS:
        return this.interest();
      case EXPLORER_TYPE.OPPORTUNITIES:
        return this.opportunity();
      case EXPLORER_TYPE.USERS: // do nothing
        return undefined;
      default:
        return undefined;
    }
  }

  private getDescriptionPairs = (item: { [key: string]: any }): object[] => {
    const type = this.getType();
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return this.descriptionPairsPlans(item as IAcademicPlan);
      case EXPLORER_TYPE.CAREERGOALS:
        return this.descriptionPairsCareerGoals(item as ICareerGoal);
      case EXPLORER_TYPE.COURSES:
        return this.descriptionPairsCourses(item as ICourse);
      case EXPLORER_TYPE.DEGREES:
        return this.descriptionPairsDegrees(item as IDesiredDegree);
      case EXPLORER_TYPE.INTERESTS:
        return undefined; // Quinne implemented the descriptionPairs into their own components
      case EXPLORER_TYPE.OPPORTUNITIES:
        return this.descriptionPairsOpportunities(item as IOpportunity);
      case EXPLORER_TYPE.USERS: // do nothing
        return undefined;
      default:
        return undefined;
    }
  }

  /* ################################################# ACADEMIC PLAN HELPER FUNCTIONS ############################### */
  private addedPlans = (): { item: IAcademicPlan, count: number }[] => {
    const profile = Users.getProfile(Router.getUsername(this.props.match));
    if (profile.academicPlanID) {
      return [{ item: AcademicPlans.findDoc(profile.academicPlanID), count: 1 }];
    }
    return [];
  }

  private plan = (): IAcademicPlan => {
    const planSlugName = this.props.match.params.plan;
    const slug = Slugs.findDoc({ name: planSlugName });
    return AcademicPlans.findDoc({ slugID: slug._id });
  }

  private descriptionPairsPlans = (plan: IAcademicPlan): { label: string, value: any }[] => {
    const degree = DesiredDegrees.findDoc(plan.degreeID);
    const description = `${degree.description}\n\n${plan.description}`;
    return [
      { label: 'Description', value: description },
    ];
  }

  /* ################################################# CAREER GOALS HELPER FUNCTIONS ################################ */
  private addedCareerGoals = (): { item: ICareerGoal, count: number }[] => {
    const addedCareerGoals = [];
    const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    const profile = Users.getProfile(Router.getUsername(this.props.match));
    _.forEach(allCareerGoals, (careerGoal) => {
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        addedCareerGoals.push({ item: careerGoal, count: 1 });
      }
    });
    return addedCareerGoals;
  }

  private careerGoal = (): ICareerGoal => {
    const careerGoalSlugName = this.props.match.params.careergoal;
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const careerGoal = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return careerGoal[0];
  }

  private descriptionPairsCareerGoals = (careerGoal: ICareerGoal): { label: string, value: any }[] => [
    { label: 'Description', value: careerGoal.description },
    { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
  ]

  private socialPairsCareerGoals = (careerGoal: ICareerGoal): { label: string, amount: number, value: object[] }[] => [
    {
      label: 'students', amount: this.numUsersCareerGoals(careerGoal, ROLE.STUDENT),
      value: this.interestedUsersCareerGoals(careerGoal, ROLE.STUDENT),
    },
    {
      label: 'faculty members', amount: this.numUsersCareerGoals(careerGoal, ROLE.FACULTY),
      value: this.interestedUsersCareerGoals(careerGoal, ROLE.FACULTY),
    },
    {
      label: 'alumni',
      amount: this.numUsersCareerGoals(careerGoal, ROLE.ALUMNI),
      value: this.interestedUsersCareerGoals(careerGoal, ROLE.ALUMNI),
    },
    {
      label: 'mentors',
      amount: this.numUsersCareerGoals(careerGoal, ROLE.MENTOR),
      value: this.interestedUsersCareerGoals(careerGoal, ROLE.MENTOR),
    },
  ]

  private interestedUsersCareerGoals = (careerGoal: ICareerGoal, role: string): object[] => {
    const interested = [];
    const profiles = Users.findProfilesWithRole(role, {}, {});
    _.forEach(profiles, (profile) => {
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        interested.push(profile);
      }
    });
    return interested;
  }

  private numUsersCareerGoals = (careerGoal: ICareerGoal, role: string): number => this.interestedUsersCareerGoals(careerGoal, role).length

  /* ################################################# COURSES HELPER FUNCTIONS ##################################### */
  private addedCourses = (): { item: ICourse, count: number }[] => {
    const addedCourses = [];
    const allCourses = _.filter(Courses.find({}, { sort: { shortName: 1 } })
      .fetch(), (c) => !c.retired);
    const userID = Router.getUserIdFromRoute(this.props.match);
    _.forEach(allCourses, (course) => {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      })
        .fetch();
      if (ci.length > 0) {
        if (course.shortName !== 'Non-CS Course') {
          addedCourses.push({ item: course, count: ci.length });
        }
      }
    });
    return addedCourses;
  }

  private course = (): ICourse => {
    const courseSlugName = this.props.match.params.course;
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course;
  }

  private isCourseCompleted = (): boolean => {
    let ret = false;
    const courseSlugName = this.props.match.params.course;
    const courseStatus = this.passedCourseHelper(courseSlugName);
    if (courseStatus === 'Completed') {
      ret = true;
    }
    return ret;
  }

  private passedCourseHelper = (courseSlugName: string): string => {
    let ret = 'Not in plan';
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    const ci = CourseInstances.find({
      studentID: Router.getUserIdFromRoute(this.props.match),
      courseID: course[0]._id,
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
  }

  private descriptionPairsCourses = (course: ICourse): object[] => [
    { label: 'Course Number', value: course.num },
    { label: 'Credit Hours', value: course.creditHrs },
    { label: 'Description', value: course.description },
    { label: 'Syllabus', value: course.syllabus },
    { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
    { label: 'Prerequisites', value: this.prerequisites(course) },
  ]

  private prerequisites = (course: ICourse): any[] => {
    const list = course.prerequisites;
    const complete = [];
    const incomplete = [];
    const notInPlan = [];
    let itemStatus = '';
    _.forEach(list, (item) => {
      itemStatus = this.prerequisiteStatus(item);
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
  }

  private prerequisiteStatus = (prerequisite: string) => {
    if (isSingleChoice(prerequisite)) {
      return this.passedCourseHelper(prerequisite);
    }
    const slugs = prerequisite.split(',');
    let ret = 'Not in plan';
    slugs.forEach((slug) => {
      const result = this.passedCourseHelper(slug);
      if (result === 'Completed') {
        ret = result;
      } else if (result === 'In plan, but not yet complete') {
        ret = result;
      }
    });
    return ret;
  }

  /* ################################################# DEGREES HELPER FUNCTIONS ##################################### */
  private addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
    item: d,
    count: 1,
  }))

  private degree = (): IDesiredDegree => {
    const degreeSlugName = this.props.match.params.degree;
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.findNonRetired({ slugID: slug[0]._id });
    return degree[0];
  }

  private descriptionPairsDegrees = (degree: IDesiredDegree): { label: string, value: any }[] => [{
    label: 'Description',
    value: degree.description,
  }]

  /* ################################################# INTERESTS HELPER FUNCTIONS ################################### */
  private addedInterests = (): { item: IInterest, count: number }[] => {
    const addedInterests = [];
    if (Router.getUserIdFromRoute(this.props.match)) {
      const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
      const profile = Users.getProfile(Router.getUserIdFromRoute(this.props.match));
      _.forEach(allInterests, (interest) => {
        if (_.includes(profile.interestIDs, interest._id)) {
          addedInterests.push({ item: interest, count: 1 });
        }
      });
    }
    return addedInterests;
  }

  private addedCareerInterests = (): { item: IInterest, count: number }[] => {
    if (Router.getUserIdFromRoute(this.props.match)) {
      const profile = Users.getProfile(Router.getUserIdFromRoute(this.props.match));
      const allInterests = Users.getInterestIDsByType(profile.userID);
      return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
    }
    return [];
  }

  private interest = (): IInterest => {
    const interestSlugName = this.props.match.params.interest;
    const slug = Slugs.find({ name: interestSlugName }).fetch();
    const interest = Interests.find({ slugID: slug[0]._id }).fetch();
    return interest[0];
  }

  /* ################################################# OPPORTUNITIES HELPER FUNCTIONS ############################### */
  private addedOpportunities = (): { item: IOpportunity, count: number }[] => {
    const addedOpportunities = [];
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = Router.getUserIdFromRoute(this.props.match);
    const role = Router.getRoleByUrl(this.props.match);
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
          addedOpportunities.push({ item: opportunity, count: oi.length });
        }
      });
    }
    return addedOpportunities;
  }

  private opportunity = (): IOpportunity => {
    const opportunitySlugName = this.props.match.params.opportunity;
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0];
  }

  private isOpportunityCompleted = (): boolean => {
    const opportunitySlugName = this.props.match.params.opportunity;
    let ret = false;
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    const oi = OpportunityInstances.find({
      studentID: Router.getUserIdFromRoute(this.props.match),
      opportunityID: opportunity[0]._id,
      verified: true,
    }).fetch();
    if (oi.length > 0) {
      ret = true;
    }
    return ret;
  }

  private descriptionPairsOpportunities = (opportunity: IOpportunity): { label: string, value: any }[] => [
    { label: 'Opportunity Type', value: this.opportunityType(opportunity) },
    { label: 'Semesters', value: this.academicTerms(opportunity) },
    { label: 'Event Date', value: opportunity.eventDate },
    { label: 'Sponsor', value: this.sponsor(opportunity) },
    { label: 'Description', value: opportunity.description },
    { label: 'Interests', value: opportunity.interestIDs },
    { label: 'ICE', value: opportunity.ice },
    { label: 'Teaser', value: this.teaser(opportunity) },
  ]

  private opportunityType = (opportunity: IOpportunity): string => {
    const oppType = opportunity.opportunityTypeID;
    const oppSlug = OpportunityTypes.findSlugByID(oppType);
    return OpportunityTypes.findDocBySlug(oppSlug).name;
  }

  private academicTerms = (opportunity: IOpportunity): string[] => {
    const termIDs = opportunity.termIDs;
    return _.map(termIDs, (termID) => AcademicTerms.toString(termID));
  }

  private sponsor = (opportunity: IOpportunity): string => Users.getFullName(opportunity.sponsorID);

  private teaser = (opportunity: IOpportunity): object => {
    const oppTeaser = Teasers.find({ opportunityID: opportunity._id }).fetch();
    return oppTeaser[0];
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const menuWidget = this.getMenuWidget();
    const type = this.getType();
    const role = this.getRole();

    // Variables for Explorer Menu
    const addedList = this.getAddedList();

    // Variables for Individual Explorer Widgets
    const item = this.getItem();
    const name = item.name;
    const descriptionPairs = this.getDescriptionPairs(item);

    // Variables to deal with individual props unique to a certain epxlorer type
    /* Explorer Interests Widget */
    const isTypeInterests = type === EXPLORER_TYPE.INTERESTS;
    const careerList = isTypeInterests ? this.getCareerList() : undefined;
    /* Explorer Courses Widget */
    const isTypeCourses = type === EXPLORER_TYPE.COURSES;
    const shortName = isTypeCourses ? item.shortName : undefined;
    const isCourseCompleted = isTypeCourses ? this.isCourseCompleted() : undefined;
    /* Explorer Career Goals Widget */
    const isTypeCareerGoals = type === EXPLORER_TYPE.CAREERGOALS;
    const socialPairs = isTypeCareerGoals ? this.socialPairsCareerGoals(item as ICareerGoal) : undefined;
    /* Explorer Opportunities Widget */
    const isTypeOpportunities = type === EXPLORER_TYPE.OPPORTUNITIES;
    const isOpportunityCompleted = isTypeOpportunities ? this.isOpportunityCompleted() : undefined;

    return (
      <React.Fragment>
        {menuWidget}

        <Grid container={true} stackable={true}>
          <Grid.Row>
            {<HelpPanelWidgetContainer/>}
          </Grid.Row>

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
                                       completed={(isTypeCourses && isCourseCompleted !== undefined) ? isCourseCompleted : undefined}/>
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
                                             completed={(isTypeOpportunities && isOpportunityCompleted !== undefined) ? isOpportunityCompleted : undefined}
                                             role={role}/>
                : ''
            }
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const IndividualExplorerPageCon = withGlobalSubscription(IndividualExplorerPage);
const IndividualExplorerPageContainer = withInstanceSubscriptions(IndividualExplorerPageCon);

export default IndividualExplorerPageContainer;
