import React from 'react';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import StudentPageMenu from '../../../app/imports/ui/components/student/StudentPageMenu';
import FacultyPageMenuWidget from '../../../app/imports/ui/components/faculty/FacultyPageMenuWidget';
import CardExplorerWidget from '../../../app/imports/ui/components/shared/explorer/browser-view/ExplorerMultipleItemsWidget';
import { AcademicPlans } from '../../../app/imports/api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../app/imports/api/career/CareerGoalCollection';
import { Courses } from '../../../app/imports/api/course/CourseCollection';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import { Opportunities } from '../../../app/imports/api/opportunity/OpportunityCollection';
import { Users } from '../../../app/imports/api/user/UserCollection';
import ExplorerMultipleItemsMenu from '../../../app/imports/ui/components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import {
  AcademicPlan,
  CareerGoal,
  Course,
  Interest,
  Opportunity,
} from '../../../app/imports/typings/radgrad';
import HelpPanelWidget from '../../../app/imports/ui/components/shared/HelpPanelWidget';
import * as Router from '../../../app/imports/ui/components/shared/utilities/router';
import { EXPLORER_TYPE, URL_ROLES } from '../../../app/imports/ui/layouts/utilities/route-constants';
import BackToTopButton from '../../../app/imports/ui/components/shared/BackToTopButton';
import { FavoriteCareerGoals } from '../../../app/imports/api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../app/imports/api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCourses } from '../../../app/imports/api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../app/imports/api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../app/imports/api/favorite/FavoriteOpportunityCollection';

interface ICardExplorerPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  /* eslint-disable react/no-unused-prop-types */
  favoritePlans: AcademicPlan[];
  favoriteCareerGoals: CareerGoal[];
  favoriteCourses: Course[];
  favoriteInterests: Interest[];
  favoriteOpportunities: Opportunity[];
  /* eslint-enable */
}

const getMenuWidget = (props: ICardExplorerPageProps): JSX.Element => {
  const role = Router.getRoleByUrl(props.match);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenu />;
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
    // case EXPLORER_TYPE.USERS:
    //   return Users;
    default:
      return {};
  }
};

const addedPlans = (props: ICardExplorerPageProps): { item: AcademicPlan, count: number }[] => _.map(props.favoritePlans, (f: any) => ({ item: AcademicPlans.findDoc(f.academicPlanID), count: 1 }));

const addedCareerGoals = (props: ICardExplorerPageProps): { item: CareerGoal, count: number }[] => _.map(props.favoriteCareerGoals, (f: any) => ({ item: CareerGoals.findDoc(f.careerGoalID), count: 1 }));

const addedCourses = (props: ICardExplorerPageProps): { item: Course, count: number }[] => _.map(props.favoriteCourses, (f: any) => ({ item: Courses.findDoc(f.courseID), count: 1 }));

const addedInterests = (props: ICardExplorerPageProps): { item: Interest, count: number }[] => _.map(props.favoriteInterests, (f: any) => ({ item: Interests.findDoc(f.interestID), count: 1 }));

const addedCareerInterests = (props: ICardExplorerPageProps): { item: Interest, count: number }[] => {
  if (Router.getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    const allInterests = Users.getInterestIDsByType(profile.userID);
    return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
  }
  return [];
};

const addedOpportunities = (props: ICardExplorerPageProps): { item: Opportunity, count: number }[] => _.map(props.favoriteOpportunities, (f: any) => ({ item: Opportunities.findDoc(f.opportunityID), count: 1 }));

const getAddedList = (props: ICardExplorerPageProps): { item: AcademicPlan | CareerGoal | Course | Interest | Opportunity, count: number }[] => {
  const type = Router.getLastUrlParam(props.match);
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
    // case EXPLORER_TYPE.USERS: // do nothing
    //   return [];
    default:
      return [];
  }
};

const CardExplorerPage = (props: ICardExplorerPageProps) => {
  const menuWidget = getMenuWidget(props);

  const addedList = getAddedList(props);
  const isTypeInterest = Router.getLastUrlParam(props.match) === EXPLORER_TYPE.INTERESTS; // Only Interests takes in Career List for ExplorerMultipleItemsMenu
  const role = Router.getRoleByUrl(props.match);
  const collection = getCollection(props);
  const type = Router.getLastUrlParam(props.match);

    return (
      <div>
        {menuWidget}

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={3}>
              <ExplorerMultipleItemsMenu
                menuAddedList={addedList}
                type={type}
                role={role}
                menuCareerList={isTypeInterest ? addedCareerInterests(props) : undefined}
              />
            </Grid.Column>

            <Grid.Column width={11}>
              <CardExplorerWidget collection={collection} type={type} role={role} />
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
        </Grid>
        <BackToTopButton />
      </div>
  );
};

export default withRouter(withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favoritePlans = FavoriteAcademicPlans.find({ studentID }).fetch();
  const favoriteCareerGoals = FavoriteCareerGoals.find({ userID: studentID }).fetch();
  const favoriteCourses = FavoriteCourses.find({ studentID }).fetch();
  const favoriteInterests = FavoriteInterests.find({ userID: studentID }).fetch();
  const favoriteOpportunities = FavoriteOpportunities.find({ studentID }).fetch();
  return {
    favoritePlans,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
  };
})(CardExplorerPage));
