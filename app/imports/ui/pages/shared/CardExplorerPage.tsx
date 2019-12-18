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
import CardExplorerMenu from '../../components/shared/CardExplorerMenu';
import {
  IAcademicPlan, // eslint-disable-line no-unused-vars
  ICareerGoal, // eslint-disable-line no-unused-vars
  ICourse, // eslint-disable-line no-unused-vars
  IDesiredDegree, IFavoriteAcademicPlan, IFavoriteCareerGoal, // eslint-disable-line no-unused-vars
  IFavoriteCourse, IFavoriteInterest, IFavoriteOpportunity, // eslint-disable-line no-unused-vars
  IInterest, // eslint-disable-line no-unused-vars
  IOpportunity, IProfile, IRadGradMatch, // eslint-disable-line no-unused-vars
} from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import {
  AcademicPlanFavoritesScoreboard,
  CareerGoalFavoritesScoreboard,
  CourseFavoritesScoreboard, InterestFavoritesScoreboard, OpportunityFavoritesScoreboard,
} from '../../../startup/client/collections';

interface ICardExplorerPageProps {
  match: IRadGradMatch;
  items: IAcademicPlan[] | ICareerGoal[] | ICourse[] | IDesiredDegree[] | IInterest[] | IOpportunity[] | IProfile[];
  favoriteCounts: { _id: string, count: number }[];
  favoritePlans: IAcademicPlan[];
  favoritePlanCounts: { count: number, academicPlanID: string }[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
  favoriteCourses: IFavoriteCourse[];
  favoriteInterests: IFavoriteInterest[];
  favoriteOpportunities: IFavoriteOpportunity[];
  type: string;
  role: string;
}

const getMenuWidget = (props: ICardExplorerPageProps): JSX.Element => {
  switch (props.role) {
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

const getCollection = (type: string): any => {
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
};

const addedPlans = (props: ICardExplorerPageProps): { item: IAcademicPlan, count: number }[] => _.map(props.favoritePlans, (f: any) => ({ item: AcademicPlans.findDoc(f.academicPlanID), count: 1 }));

const addedCareerGoals = (props: ICardExplorerPageProps): { item: ICareerGoal, count: number }[] => _.map(props.favoriteCareerGoals, (f: any) => ({ item: CareerGoals.findDoc(f.careerGoalID), count: 1 }));

const addedCourses = (props: ICardExplorerPageProps): { item: ICourse, count: number }[] => _.map(props.favoriteCourses, (f: any) => ({ item: Courses.findDoc(f.courseID), count: 1 }));

const addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
  item: d,
  count: 1,
}));

const addedInterests = (props: ICardExplorerPageProps): { item: IInterest, count: number }[] => _.map(props.favoriteInterests, (f: any) => ({ item: Interests.findDoc(f.interestID), count: 1 }));

const addedCareerInterests = (props: ICardExplorerPageProps): { item: IInterest, count: number }[] => {
  if (Router.getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    const allInterests = Users.getInterestIDsByType(profile.userID);
    return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
  }
  return [];
};

const addedOpportunities = (props: ICardExplorerPageProps): { item: IOpportunity, count: number }[] => _.map(props.favoriteOpportunities, (f: any) => ({ item: Opportunities.findDoc(f.opportunityID), count: 1 }));

const getAddedList = (props: ICardExplorerPageProps): { item: IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity, count: number }[] => {
  switch (props.type) {
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
      return [];
    default:
      return [];
  }
};

const CardExplorerPage = (props: ICardExplorerPageProps) => {
  const menuWidget = getMenuWidget(props);

  const addedList = getAddedList(props);
  const isTypeInterest = Router.getLastUrlParam(props.match) === EXPLORER_TYPE.INTERESTS; // Only Interests takes in Career List for CardExplorerMenu

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
            <CardExplorerMenu menuAddedList={addedList} type={props.type} role={props.role}
                              menuCareerList={isTypeInterest ? addedCareerInterests(props) : undefined}
            />
          </Grid.Column>

          <Grid.Column width={11}>
            <CardExplorerWidget items={props.items} type={props.type} role={props.role} favoriteCounts={props.favoriteCounts}/>
          </Grid.Column>
          <Grid.Column width={1}/>
        </Grid.Row>
      </Grid>
      <BackToTopButton/>
    </div>
  );
};

export default withRouter(withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favoritePlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: studentID });
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ userID: studentID });
  const favoriteOpportunities = FavoriteOpportunities.findNonRetired({ studentID });
  const role = Router.getRoleByUrl(props.match);
  const type = Router.getLastUrlParam(props.match);
  let allItems = [];
  if (type !== EXPLORER_TYPE.USERS) {
    allItems = getCollection(type).findNonRetired();
  }
  let items;
  let ids: string[];
  let favoriteCounts;
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      ids = _.map(favoritePlans, (f) => f.academicPlanID);
      items = _.filter(allItems, (item) => !_.includes(ids, item._id));
      favoriteCounts = _.map(items, (i) => {
        const countArr: any[] = AcademicPlanFavoritesScoreboard.find({ _id: i._id }).fetch();
        if (countArr.length > 0) {
          return countArr[0].count;
        }
        return 0;
      });
      break;
    case EXPLORER_TYPE.CAREERGOALS:
      ids = _.map(favoriteCareerGoals, (f) => f.careerGoalID);
      items = _.filter(allItems, (item) => !_.includes(ids, item._id));
      favoriteCounts = _.map(items, (i) => {
        const countArr: any[] = CareerGoalFavoritesScoreboard.find({ _id: i._id }).fetch();
        if (countArr.length > 0) {
          return countArr[0].count;
        }
        return 0;
      });
      break;
    case EXPLORER_TYPE.COURSES:
      ids = _.map(favoriteCourses, (f) => f.courseID);
      items = _.filter(allItems, (item) => !_.includes(ids, item._id));
      favoriteCounts = _.map(items, (i) => {
        const countArr: any[] = CourseFavoritesScoreboard.find({ _id: i._id }).fetch();
        if (countArr.length > 0) {
          return countArr[0].count;
        }
        return 0;
      });
      break;
    case EXPLORER_TYPE.INTERESTS:
      ids = _.map(favoriteInterests, (f) => f.interestID);
      items = _.filter(allItems, (item) => !_.includes(ids, item._id));
      favoriteCounts = _.map(items, (i) => {
        const countArr: any[] = InterestFavoritesScoreboard.find({ _id: i._id }).fetch();
        if (countArr.length > 0) {
          return countArr[0].count;
        }
        return 0;
      });
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      ids = _.map(favoriteOpportunities, (f) => f.opportunityID);
      items = _.filter(allItems, (item) => !_.includes(ids, item._id));
      favoriteCounts = _.map(items, (i) => {
        const countArr: any[] = OpportunityFavoritesScoreboard.find({ _id: i._id }).fetch();
        if (countArr.length > 0) {
          return countArr[0].count;
        }
        return 0;
      });
      break;
    case EXPLORER_TYPE.USERS:
    case EXPLORER_TYPE.DEGREES:
    default:
      items = allItems;
  }
  const favoritePlanCounts = AcademicPlanFavoritesScoreboard.find().fetch();
  return {
    items,
    favoriteCounts,
    favoritePlans,
    favoritePlanCounts,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
    role,
    type,
  };
})(CardExplorerPage));
