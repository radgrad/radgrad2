import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import { withRouter } from 'react-router-dom';
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
// @ts-ignore
import CardExplorerMenu from '../../components/shared/CardExplorerMenu';
// eslint-disable-next-line no-unused-vars
import { IAcademicPlan, ICareerGoal, ICourse, IDesiredDegree, IInterest, IOpportunity } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import BackToTopButton from '../../components/shared/BackToTopButton';

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

  private getCollection = (): object => {
    const type = this.getType();
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return AcademicPlans;
      case EXPLORER_TYPE.CAREERGOALS:
        return CareerGoals;
      case EXPLORER_TYPE.COURSES:
        return Courses;
      case EXPLORER_TYPE.DEGREES:
        return DesiredDegrees;
      case EXPLORER_TYPE.INTERESTS:
        return Interests;
      case EXPLORER_TYPE.OPPORTUNITIES:
        return Opportunities;
      case EXPLORER_TYPE.USERS:
        return Users;
      default:
        return {};
    }
  }

  private getAddedList = (): { item: IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity, count: number }[] => {
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
        return [];
      default:
        return [];
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
        addedCourses = _.filter(addedCourses, (c) => c.item.num.match(regex));
      }
    }
    return addedCourses;
  }

  /* ####################################### DEGREES HELPER FUNCTIONS ############################################## */
  private addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
    item: d,
    count: 1,
  }))

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

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
  private addedOpportunities = (): { item: IOpportunity, count: number }[] => {
    const addedOpportunities = [];
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = this.getUserIdFromRoute();
    const role = this.getRole();
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const menuWidget = this.getMenuWidget();

    const addedList = this.getAddedList();
    const isTypeInterest = this.getType() === EXPLORER_TYPE.INTERESTS; // Only Interests takes in Career List for CardExplorerMenu
    const role = this.getRole();
    const collection = this.getCollection();
    const type = this.getType();

    return (
      <div>
        {menuWidget}

        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
            <CardExplorerMenu menuAddedList={addedList} type={type} role={role}
                              menuCareerList={isTypeInterest ? this.addedCareerInterests() : undefined}
            />
          </Grid.Column>

            <Grid.Column width={11}>
              <CardExplorerWidget collection={collection} type={type} role={role}/>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>
        <BackToTopButton/>
      </div>
    );
  }
}

export default withRouter(CardExplorerPage);
