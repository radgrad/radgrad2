import React from 'react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { FavoriteCareerGoals } from '../../../../api/favorite/FavoriteCareerGoalCollection';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Users } from '../../../../api/user/UserCollection';
import { ICareerGoal, IHelpMessage } from '../../../../typings/radgrad';
import AdvisorPageMenuWidget from '../../../components/advisor/AdvisorPageMenuWidget';
import FacultyPageMenuWidget from '../../../components/faculty/FacultyPageMenuWidget';
import CareerGoalBrowserViewContainer from '../../../components/shared/explorer/browser-view/CareerGoalBrowserView';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import * as Router from '../../../components/shared/utilities/router';
import StudentPageMenuWidget from '../../../components/student/StudentPageMenuWidget';
import { EXPLORER_TYPE, URL_ROLES } from '../../../layouts/utilities/route-constants';

interface ICareerGoalBrowserViewPageProps {
  favoriteCareerGoals: ICareerGoal[];
  favoriteCombinedInterestIDs: string[];
  careerGoals: ICareerGoal[];
  helpMessages: IHelpMessage[];
}

const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
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

const CareerGoalBrowserViewPage: React.FC<ICareerGoalBrowserViewPageProps> = ({ favoriteCareerGoals, favoriteCombinedInterestIDs, careerGoals, helpMessages }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteCareerGoals, (f) => ({ item: f, count: 1 }));
  return (
    <div id="career-goal-browser-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu
                menuAddedList={menuAddedList}
                type={EXPLORER_TYPE.CAREERGOALS as IExplorerTypes}
                menuCareerList={undefined}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <CareerGoalBrowserViewContainer
                favoriteCareerGoals={favoriteCareerGoals}
                favoriteCombinedInterestIDs={favoriteCombinedInterestIDs}
                careerGoals={careerGoals}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const favCar = FavoriteCareerGoals.findNonRetired({ userID: profile.userID });
  const favoriteCareerGoals = _.map(favCar, (f) => CareerGoals.findDoc(f.careerGoalID));
  const favoriteCombinedInterestIDs = Users.getInterestIDs(username);
  const careerGoals = CareerGoals.findNonRetired({});
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    careerGoals,
    favoriteCareerGoals,
    favoriteCombinedInterestIDs,
    helpMessages,
  };
})(CareerGoalBrowserViewPage);
