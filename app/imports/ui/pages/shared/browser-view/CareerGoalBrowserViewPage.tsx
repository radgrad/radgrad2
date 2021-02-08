import React from 'react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { FavoriteCareerGoals } from '../../../../api/favorite/FavoriteCareerGoalCollection';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal } from '../../../../typings/radgrad';
import CareerGoalBrowserViewContainer from '../../../components/shared/explorer/browser-view/CareerGoalBrowserView';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { getMenuWidget } from '../utilities/getMenuWidget';
import HeaderPane from '../../../components/shared/HeaderPane';

interface CareerGoalBrowserViewPageProps {
  favoriteCareerGoals: CareerGoal[];
  favoriteCombinedInterestIDs: string[];
  careerGoals: CareerGoal[];
}

const headerPaneTitle = 'Find your career goals';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Specify at least three career goals so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a career goal of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;

const CareerGoalBrowserViewPage: React.FC<CareerGoalBrowserViewPageProps> = ({ favoriteCareerGoals, favoriteCombinedInterestIDs, careerGoals }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteCareerGoals, (f) => ({ item: f, count: 1 }));
  return (
    <div id="career-goal-browser-view-page">
      {getMenuWidget(match)}
      <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
      <Grid stackable style={{marginLeft: '10px', marginRight: '10px'}}>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu menuAddedList={menuAddedList} type={EXPLORER_TYPE.CAREERGOALS as IExplorerTypes} menuCareerList={undefined} />
            </Grid.Column>
            <Grid.Column width={12}>
              <CareerGoalBrowserViewContainer favoriteCareerGoals={favoriteCareerGoals} favoriteCombinedInterestIDs={favoriteCombinedInterestIDs} careerGoals={careerGoals} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
  return {
    careerGoals,
    favoriteCareerGoals,
    favoriteCombinedInterestIDs,
  };
})(CareerGoalBrowserViewPage);
