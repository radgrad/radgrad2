import React from 'react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { FavoriteCareerGoals } from '../../../../api/favorite/FavoriteCareerGoalCollection';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal, HelpMessage } from '../../../../typings/radgrad';
import CareerGoalBrowserViewContainer from '../../../components/shared/explorer/browser-view/CareerGoalBrowserView';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { getMenuWidget } from '../utilities/getMenuWidget';

interface CareerGoalBrowserViewPageProps {
  favoriteCareerGoals: CareerGoal[];
  favoriteCombinedInterestIDs: string[];
  careerGoals: CareerGoal[];
  helpMessages: HelpMessage[];
}

const CareerGoalBrowserViewPage: React.FC<CareerGoalBrowserViewPageProps> = ({ favoriteCareerGoals, favoriteCombinedInterestIDs, careerGoals, helpMessages }) => {
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
