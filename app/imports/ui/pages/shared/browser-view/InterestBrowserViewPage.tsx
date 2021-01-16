import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { HelpMessage, Interest } from '../../../../typings/radgrad';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import InterestBrowserViewContainer from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { getMenuWidget } from '../utilities/getMenuWidget';

interface InterestBrowserViewPageProps {
  favoriteInterests: Interest[];
  favoriteCareerGoalInterests: Interest[];
  interests: Interest[];
  helpMessages: HelpMessage[];
}

const InterestBrowserViewPage: React.FC<InterestBrowserViewPageProps> = ({ favoriteInterests, favoriteCareerGoalInterests, interests, helpMessages }) => {
  const match = useRouteMatch();
  const menuAddedItems = _.map(favoriteInterests, (doc) => ({ item: doc, count: 1 }));
  const menuCareerList = _.map(favoriteCareerGoalInterests, (doc) => ({ item: doc, count: 1 }));
  return (
    <div id="interest-browser-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu
                menuAddedList={menuAddedItems}
                type={EXPLORER_TYPE.INTERESTS as IExplorerTypes}
                menuCareerList={menuCareerList}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <InterestBrowserViewContainer
                favoriteInterests={favoriteInterests}
                favoriteCareerGoalInterests={favoriteCareerGoalInterests}
                interests={interests}
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
  const allInterests = Users.getInterestIDsByType(profile.userID);
  const favoriteInterests = _.map(allInterests[0], (id) => Interests.findDoc(id));
  const favoriteCareerGoalInterests = _.map(allInterests[1], (id) => Interests.findDoc(id));
  const interests = Interests.findNonRetired({}); // TODO should we filter out the favorited ones?
  const helpMessages = HelpMessages.findNonRetired({});

  return {
    favoriteCareerGoalInterests,
    favoriteInterests,
    helpMessages,
    interests,
  };
})(InterestBrowserViewPage);