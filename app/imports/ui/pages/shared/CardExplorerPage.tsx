import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
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
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';

interface ICardExplorerPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  favoritePlans: IAcademicPlan[];
  favoriteCareerGoals: ICareerGoal[];
  favoriteCourses: ICourse[];
  favoriteInterests: IInterest[];
  favoriteOpportunities: IOpportunity[];
}

class CardExplorerPage extends React.Component<ICardExplorerPageProps> {
  constructor(props) {
    super(props);
    // console.log('CardExplorerPage ', props);
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
  private addedPlans = (): { item: IAcademicPlan, count: number }[] => _.map(this.props.favoritePlans, (f) => ({ item: AcademicPlans.findDoc(f.academicPlanID), count: 1 }));

  /* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
  private addedCareerGoals = (): { item: ICareerGoal, count: number }[] => _.map(this.props.favoriteCareerGoals, (f) => ({ item: CareerGoals.findDoc(f.careerGoalID), count: 1 }));

  /* ####################################### COURSES HELPER FUNCTIONS ############################################## */
  private addedCourses = (): { item: ICourse, count: number }[] => _.map(this.props.favoriteCourses, (f) => ({ item: Courses.findDoc(f.courseID), count: 1 }));

  /* ####################################### DEGREES HELPER FUNCTIONS ############################################## */
  private addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
    item: d,
    count: 1,
  }))

  /* ####################################### INTERESTS HELPER FUNCTIONS ############################################ */
  private addedInterests = (): { item: IInterest, count: number }[] => _.map(this.props.favoriteInterests, (f) => ({ item: Interests.findDoc(f.interestID), count: 1 }));

  private addedCareerInterests = (): { item: IInterest, count: number }[] => {
    if (this.getUserIdFromRoute()) {
      const profile = Users.getProfile(this.getUserIdFromRoute());
      const allInterests = Users.getInterestIDsByType(profile.userID);
      return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
    }
    return [];
  }

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
  private addedOpportunities = (): { item: IOpportunity, count: number }[] => _.map(this.props.favoriteOpportunities, (f) => ({ item: Opportunities.findDoc(f.opportunityID), count: 1 }));

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
              <CardExplorerWidget collection={collection} type={type} role={role} menuList={addedList}/>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>
        <BackToTopButton/>
      </div>
    );
  }
}

export default withRouter(withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favoritePlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ studentID });
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ studentID });
  const favoriteOpportunities = FavoriteOpportunities.findNonRetired({ studentID });
  return {
    favoritePlans,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
  };
})(CardExplorerPage));
