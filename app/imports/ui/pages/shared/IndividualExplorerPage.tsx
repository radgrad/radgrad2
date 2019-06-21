import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../components/shared/ExplorerMenu';
import { EXPLORER_TYPE } from '../../components/shared/ExplorerConstants';
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

  private getType = (): string => Router.getIndividualExplorerType(this.props.match);

  /* ################################################# EXPLORER MENU HELPER FUNCTIONS ############################### */
  private getAddedList = (): { [key: string]: any }[] => {
    const type = this.getType();
    switch (type) {
      case 'plans':
        return this.addedPlans();
      case 'career-goals':
        return this.addedCareerGoals();
      case 'courses':
        return this.addedCourses();
      case 'degrees':
        return this.addedDegrees();
      case 'interests':
        return this.addedInterests();
      case 'opportunities':
        return this.addedOpportunities();
      case 'users': // do nothing
        return undefined;
      default:
        return undefined;
    }
  }

  private getCareerList = (): { [key: string]: any }[] => {
    const type = this.getType();
    switch (type) {
      case 'interests':
        return this.addedCareerInterests();
      default:
        return undefined;
    }
  }

  /* ################################################# WIDGET HELPER FUNCTIONS ###################################### */
  private getItem = (): { [key: string]: any } => {
    const type = this.getType();
    switch (type) {
      case 'plans':
        return this.plan();
      case 'career-goals':
        return this.careerGoal();
      case 'courses':
        return this.course();
      case 'degrees':
        return this.degree();
      case 'interests':
        return this.interest();
      case 'opportunities':
        return this.opportunity();
      case 'users': // do nothing
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
    if (role === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID === userID);
    }
    if (role === 'student') {
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { match } = this.props;
    const menuWidget = Router.renderPageMenuWidget(match);
    const type = Router.getIndividualExplorerType(match);
    const role = Router.getRoleByUrl(match);

    // Variables for Explorer Menu
    const addedList = this.getAddedList();

    // Variables for Individual Explorer Widgets
    const item = this.getItem();
    const name = item.name;
    const descriptionPairs = this.getDescriptionPairs();

    // Variables to deal with individual props unique to a certain epxlorer type
    /* Explorer Interests Widget */
    const isTypeInterests = type === EXPLORER_TYPE.INTERESTS;
    const careerList = isTypeInterests ? this.getCareerList() : undefined;
    /* Explorer Courses Widget */
    const isTypeCourses = type === EXPLORER_TYPE.COURSES;
    const shortName = isTypeCourses ? item.shortName : undefined;
    const isCourseCompleted = isTypeCourses ? this.completedCourse() : undefined;
    /* Explorer Career Goals Widget */
    const isTypeCareerGoals = type === EXPLORER_TYPE.CAREERGOAL;
    const socialPairs = isTypeCareerGoals ? this.socialPairsCareerGoals() : undefined;
    /* Explorer Opportunities Widget */
    const isTypeOpportunities = type === EXPLORER_TYPE.OPPORTUNITIES;
    const isOpportunityCompleted = isTypeOpportunities ? this.completedOpportunity() : undefined;

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
              type === EXPLORER_TYPE.ACADEMICPLAN ?
                <ExplorerPlansWidget name={name} descriptionPairs={descriptionPairs} item={item} role={role}/>
                : ''
            }
            {
              type === EXPLORER_TYPE.CAREERGOAL ?
                <ExplorerCareerGoalsWidget name={name} descriptionPairs={descriptionPairs} item={item}
                                           socialPairs={isTypeCareerGoals && socialPairs ? socialPairs : undefined}/>
                : ''
            }
            {
              type === EXPLORER_TYPE.COURSES ?
                <ExplorerCoursesWidget name={name} shortName={isTypeCourses && shortName ? shortName : undefined}
                                       descriptionPairs={descriptionPairs} item={item} role={role}
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
                <ExplorerOpportunitiesWidget name={name} desriptionPairs={descriptionPairs} item={item}
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

export default IndividualExplorerPage;
