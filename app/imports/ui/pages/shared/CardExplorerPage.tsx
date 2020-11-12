import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import CardExplorerWidget from '../../components/shared/CardExplorerWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import CardExplorerMenu from '../../components/shared/CardExplorerMenu';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IDesiredDegree,
  IInterest,
  IOpportunity,
} from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/route-constants';
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
  // eslint-disable-next-line react/no-unused-prop-types
  favoritePlans: IAcademicPlan[];
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteCareerGoals: ICareerGoal[];
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteCourses: ICourse[];
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteInterests: IInterest[];
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteOpportunities: IOpportunity[];
}

const getMenuWidget = (props: ICardExplorerPageProps): JSX.Element => {
  const role = Router.getRoleByUrl(props.match);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};

const getCollection = (props: ICardExplorerPageProps): object => {
  const type = Router.getLastUrlParam(props.match);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return AcademicPlans;
    case EXPLORER_TYPE.CAREERGOALS:
      return CareerGoals;
    case EXPLORER_TYPE.COURSES:
      return Courses;
    case EXPLORER_TYPE.INTERESTS:
      return Interests;
    case EXPLORER_TYPE.OPPORTUNITIES:
      return Opportunities;
    default:
      return {};
  }
};

const addedPlans = (props: ICardExplorerPageProps): { item: IAcademicPlan, count: number }[] => _.map(props.favoritePlans, (f: any) => ({
  item: AcademicPlans.findDoc(f.academicPlanID),
  count: 1,
}));

const addedCareerGoals = (props: ICardExplorerPageProps): { item: ICareerGoal, count: number }[] => _.map(props.favoriteCareerGoals, (f: any) => ({
  item: CareerGoals.findDoc(f.careerGoalID),
  count: 1,
}));

const addedCourses = (props: ICardExplorerPageProps): { item: ICourse, count: number }[] => _.map(props.favoriteCourses, (f: any) => ({
  item: Courses.findDoc(f.courseID),
  count: 1,
}));

const addedInterests = (props: ICardExplorerPageProps): { item: IInterest, count: number }[] => _.map(props.favoriteInterests, (f: any) => ({
  item: Interests.findDoc(f.interestID),
  count: 1,
}));

const addedCareerInterests = (props: ICardExplorerPageProps): { item: IInterest, count: number }[] => {
  if (Router.getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    const allInterests = Users.getInterestIDsByType(profile.userID);
    return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
  }
  return [];
};

const addedOpportunities = (props: ICardExplorerPageProps): { item: IOpportunity, count: number }[] => _.map(props.favoriteOpportunities, (f: any) => ({
  item: Opportunities.findDoc(f.opportunityID),
  count: 1,
}));

const getAddedList = (props: ICardExplorerPageProps): { item: IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity, count: number }[] => {
  const type = Router.getLastUrlParam(props.match);
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
    default:
      return [];
  }
};

const CardExplorerPage = (props: ICardExplorerPageProps) => {
  const menuWidget = getMenuWidget(props);

  const addedList = getAddedList(props);
  const isTypeInterest = Router.getLastUrlParam(props.match) === EXPLORER_TYPE.INTERESTS; // Only Interests takes in Career List for CardExplorerMenu
  const role = Router.getRoleByUrl(props.match);
  const collection = getCollection(props);
  const type = Router.getLastUrlParam(props.match);

  return (
    <div>
      {menuWidget}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <CardExplorerMenu
                menuAddedList={addedList}
                type={type}
                role={role}
                menuCareerList={isTypeInterest ? addedCareerInterests(props) : undefined}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <CardExplorerWidget collection={collection} type={type} role={role} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <BackToTopButton />
      </Container>
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
  return {
    favoritePlans,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
  };
})(CardExplorerPage));
