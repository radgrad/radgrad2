import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import CardExplorerWidget from '../../components/shared/CardExplorerWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import CardExplorerMenu from '../../components/shared/CardExplorerMenu';
// eslint-disable-next-line no-unused-vars
import { IAcademicPlan, ICareerGoal, ICourse, IDesiredDegree, IInterest, IOpportunity } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';

interface ICardExplorerPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class CardExplorerPage extends React.Component<ICardExplorerPageProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = (): string => Router.getUsername(this.props.match);

  private getUserIdFromRoute = (): string => Router.getUserIdFromRoute(this.props.match);

  private getType = (): string => Router.getLastUrlParam(this.props.match);

  private getRole = (): string => Router.getRoleByUrl(this.props.match);

  private getMenuWidget = (): JSX.Element => {
    const role = this.getRole();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return <React.Fragment/>;
    }
  }

  private getCollection = (): object => {
    const type = this.getType();
    switch (type) {
      case 'plans':
        return AcademicPlans;
      case 'career-goals':
        return CareerGoals;
      case 'courses':
        return Courses;
      case 'degrees':
        return DesiredDegrees;
      case 'interests':
        return Interests;
      case 'opportunities':
        return Opportunities;
      case 'users':
        return Users;
      default:
        return {};
    }
  }

  private getRoleByUrl = (): string => {
    const url = this.props.match.url;
    const username = this.getUsername();
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = (): JSX.Element => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return <React.Fragment/>;
    }
  }

  private getAddedList = (): { item: IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity, count: number }[] => {
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

  // This function and the nonAdded functions in the switch statements are NOT used at all. However, I'm keeping them here
  // just in case. -Gian
  private getNonAddedList = (): (IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity)[] => {
    const type = this.getType();
    switch (type) {
      case 'plans':
        return this.nonAddedPlans();
      case 'career-goals':
        return this.nonAddedCareerGoals();
      case 'courses':
        return this.nonAddedCourses();
      case 'degrees':
        return this.nonAddedDegrees();
      case 'interests':
        return this.nonAddedInterests();
      case 'opportunities':
        return this.nonAddedOpportunities();
      case 'users': // do nothing
        return undefined;
      default:
        return undefined;
    }
  }

  /* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
  private addedPlans = (): { item: IAcademicPlan, count: number }[] => {
    const plan = [];
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const thePlan = AcademicPlans.findOne({ _id: profile.academicPlanID });
      if (thePlan) {
        plan.push({ item: thePlan, count: 1 });
      }
    }
    return plan;
  }

  nonAddedPlans = (): IAcademicPlan[] => {
    const plans = AcademicPlans.findNonRetired({});
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      return _.filter(plans, p => profile.academicPlanID === p._id);
    }
    return plans;
  }

  /* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
  private addedCareerGoals = (): { item: ICareerGoal, count: number }[] => {
    const addedCareerGoals = [];
    const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    const profile = Users.getProfile(this.getUsername());
    _.forEach(allCareerGoals, (careerGoal) => {
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        addedCareerGoals.push({ item: careerGoal, count: 1 });
      }
    });
    return addedCareerGoals;
  }

  private nonAddedCareerGoals = (): ICareerGoal[] => {
    const profile = Users.getProfile(this.getUsername());
    const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    const nonAddedCareerGoals = _.filter(allCareerGoals, (careerGoal) => {
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        return false;
      }
      return true;
    });
    return nonAddedCareerGoals;
  }

  /* ####################################### COURSES HELPER FUNCTIONS ############################################## */
  private addedCourses = (): { item: ICourse, count: number }[] => {
    let addedCourses = [];
    const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
    const userID = this.getUserIdFromRoute();
    _.forEach(allCourses, (course) => {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      }).fetch();
      if (ci.length > 0) {
        if (course.shortName !== 'Non-CS Course') {
          addedCourses.push({ item: course, count: ci.length });
        }
      }
    });
    if (Roles.userIsInRole(userID, [ROLE.STUDENT])) {
      const profile = StudentProfiles.findDoc({ userID });
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      // CAM: why are we filtering?
      if (plan.coursesPerAcademicTerm.length < 15) { // not bachelors and masters
        const regex = /[1234]\d\d/g;
        addedCourses = _.filter(addedCourses, (c) => c.item.number.match(regex));
      }
    }
    return addedCourses;
  }

  private nonAddedCourses = (): ICourse[] => {
    const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
    const userID = this.getUserIdFromRoute();
    const nonAddedCourses = _.filter(allCourses, (course) => {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      }).fetch();
      if (ci.length > 0) {
        return false;
      }
      if (course.shortName === 'Non-CS Course') {
        return false;
      }
      return true;
    });
    return nonAddedCourses;
  }

  /* ####################################### DEGREES HELPER FUNCTIONS ############################################## */
  private addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
    item: d,
    count: 1,
  }))

  private nonAddedDegrees = (): IDesiredDegree[] => []

  /* ####################################### INTERESTS HELPER FUNCTIONS ############################################ */
  private addedInterests = (): { item: IInterest, count: number }[] => {
    const addedInterests = [];
    if (this.getUserIdFromRoute()) {
      const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
      const profile = Users.getProfile(this.getUserIdFromRoute());
      _.forEach(allInterests, (interest) => {
        if (_.includes(profile.interestIDs, interest._id)) {
          addedInterests.push({ item: interest, count: 1 });
        }
      });
    }
    return addedInterests;
  }

  private addedCareerInterests = (): { item: IInterest, count: number }[] => {
    if (this.getUserIdFromRoute()) {
      const profile = Users.getProfile(this.getUserIdFromRoute());
      const allInterests = Users.getInterestIDsByType(profile.userID);
      return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
    }
    return [];
  }

  private nonAddedInterests = (): IInterest[] => {
    const interests = Interests.find({}).fetch();
    if (this.getUserIdFromRoute()) {
      const profile = Users.getProfile(this.getUserIdFromRoute());
      return _.filter(interests, int => !_.includes(profile.interestIDs, int._id));
    }
    return interests;
  }

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
  private addedOpportunities = (): { item: IOpportunity, count: number }[] => {
    const addedOpportunities = [];
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = this.getUserIdFromRoute();
    const group = this.getRoleByUrl();
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID === userID);
    }
    if (group === 'student') {
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

  private nonAddedOpportunities = (): IOpportunity[] => {
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = this.getUserIdFromRoute();
    const group = this.getRoleByUrl();
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID !== userID);
    }
    if (group === 'student') {
      const nonAddedOpportunities = _.filter(allOpportunities, (opportunity) => {
        const oi = OpportunityInstances.find({
          studentID: userID,
          opportunityID: opportunity._id,
        }).fetch();
        if (oi.length > 0) {
          return false;
        }
        return true;
      });
      return nonAddedOpportunities;
    }
    return allOpportunities;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const menuWidget = this.getMenuWidget();

    const addedList = this.getAddedList();
    const isTypeInterest = this.getType() === 'interests'; // Only Interests takes in Career List for CardExplorerMenu
    type types = 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
    type roles = 'student' | 'faculty' | 'mentor';

    return (
      <React.Fragment>
        {menuWidget}

        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={3}>
            <CardExplorerMenu menuAddedList={addedList} type={this.getType() as types}
                              role={this.getRoleByUrl()}
                              menuCareerList={isTypeInterest ? this.addedCareerInterests() : undefined}
            />
          </Grid.Column>

          <Grid.Column width={13}>
            <CardExplorerWidget collection={this.getCollection()} type={this.getType()} role={this.getRoleByUrl()}/>
          </Grid.Column>
        </Grid>

      </React.Fragment>
    );
  }
}

const CardExplorerPageCon = withGlobalSubscription(CardExplorerPage);
const CardExplorerPageContainer = withInstanceSubscriptions(CardExplorerPageCon);

export default CardExplorerPageContainer;
