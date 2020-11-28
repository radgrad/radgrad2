import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import BaseCollection from '../../../api/base/BaseCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import { IExplorerTypes } from '../../components/shared/explorer/utilities/explorer';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import CardExplorerWidget from '../../components/shared/explorer/multiple-items/ExplorerMultipleItemsWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import ExplorerMultipleItemsMenu, { IExplorerMenuItem } from '../../components/shared/explorer/multiple-items/ExplorerMultipleItemsMenu';
import {
  IFavoriteAcademicPlan,
  IFavoriteCareerGoal,
  IFavoriteCourse,
  IFavoriteInterest,
  IFavoriteOpportunity,
  IHelpMessage,
  IInterest,
} from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/utilities/router';
import { EXPLORER_TYPE, URL_ROLES } from '../../layouts/utilities/route-constants';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';

interface ICardExplorerPageProps {
  favoritePlans: IFavoriteAcademicPlan[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
  favoriteCourses: IFavoriteCourse[];
  favoriteInterests: IFavoriteInterest[];
  favoriteOpportunities: IFavoriteOpportunity[];
  helpMessages: IHelpMessage[];
}

const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  // console.log('ExplorerMultipleItemsPage.getMenuWidget', role);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget />;
    case URL_ROLES.ADVISOR:
      return <AdvisorPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};

const getCollection = (match): BaseCollection => {
  const type = Router.getLastUrlParam(match);
  // console.log('ExplorerMultipleItemsPage.getCollection', type);
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
      return null;
  }
};

const addedPlans = ({ favoritePlans }): IExplorerMenuItem[] => _.map(favoritePlans, (f: IFavoriteAcademicPlan) => ({
  item: AcademicPlans.findDoc(f.academicPlanID),
  count: 1,
}));

const addedCareerGoals = ({ favoriteCareerGoals }): IExplorerMenuItem[] => _.map(favoriteCareerGoals, (f: IFavoriteCareerGoal) => ({
  item: CareerGoals.findDoc(f.careerGoalID),
  count: 1,
}));

const addedCourses = ({ favoriteCourses }): IExplorerMenuItem[] => _.map(favoriteCourses, (f: IFavoriteCourse) => ({
  item: Courses.findDoc(f.courseID),
  count: 1,
}));

const addedInterests = ({ favoriteInterests }): IExplorerMenuItem[] => _.map(favoriteInterests, (f: IFavoriteInterest) => ({
  item: Interests.findDoc(f.interestID),
  count: 1,
}));

const addedCareerInterests = (match): { item: IInterest, count: number}[] => {
  if (Router.getUserIdFromRoute(match)) {
    const profile = Users.getProfile(Router.getUserIdFromRoute(match));
    const allInterests = Users.getInterestIDsByType(profile.userID);
    return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
  }
  return [];
};

// TODO why is this here don't we have a different Opportunities explorer?
const addedOpportunities = ({ favoriteOpportunities }): IExplorerMenuItem[] => _.map(favoriteOpportunities, (f: IFavoriteOpportunity) => ({
  item: Opportunities.findDoc(f.opportunityID),
  count: 1,
}));

const getAddedList = (props: ICardExplorerPageProps, match): IExplorerMenuItem[] => {
  const type = Router.getLastUrlParam(match);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return addedPlans(props);
    case EXPLORER_TYPE.CAREERGOALS:
      return addedCareerGoals(props);
    case EXPLORER_TYPE.COURSES:
      return addedCourses(props);
    case EXPLORER_TYPE.INTERESTS:
      return addedInterests(props);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return addedOpportunities(props);
    default:
      return [];
  }
};

const ExplorerMultipleItemsPage: React.FC<ICardExplorerPageProps> = (props) => {
  const match = useRouteMatch();
  const menuWidget = getMenuWidget(match);
  const addedList = getAddedList(props, match);
  const isTypeInterest = Router.getLastUrlParam(match) === EXPLORER_TYPE.INTERESTS; // Only Interests takes in Career List for ExplorerMultipleItemsMenu
  const role = Router.getRoleByUrl(match);
  const collection = getCollection(match);
  const type = Router.getLastUrlParam(match) as IExplorerTypes;

  return (
    <div id={`${type}-explorer-page`}>
      {menuWidget}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={props.helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu
                menuAddedList={addedList}
                type={type}
                menuCareerList={isTypeInterest ? addedCareerInterests(match) : undefined}
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

// TODO: why are we getting all of this info when we only need some of it for any given page? Because, we didn't want to create an ExplorerMultipleItemsPage for each type.
export default withTracker((props) => {
  const { username } = useParams();
  const studentID = Users.getProfile(username).userID;
  const favoritePlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: studentID });
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ userID: studentID });
  const favoriteOpportunities = FavoriteOpportunities.findNonRetired({ studentID });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    favoritePlans,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
    helpMessages,
  };
})(ExplorerMultipleItemsPage);
