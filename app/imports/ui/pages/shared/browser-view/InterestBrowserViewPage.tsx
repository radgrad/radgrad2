import React from 'react';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {useRouteMatch} from 'react-router';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interest } from '../../../../typings/radgrad';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import InterestBrowserViewContainer from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import HeaderPane from '../../../components/shared/HeaderPane';
import {getMenuWidget} from '../utilities/getMenuWidget';

interface InterestBrowserViewPageProps {
  favoriteInterests: Interest[];
  favoriteCareerGoalInterests: Interest[];
  interests: Interest[];
}

const InterestBrowserViewPage: React.FC<InterestBrowserViewPageProps> = ({ favoriteInterests, favoriteCareerGoalInterests, interests }) => {
  const menuAddedItems = _.map(favoriteInterests, (doc) => ({ item: doc, count: 1 }));
  const menuCareerList = _.map(favoriteCareerGoalInterests, (doc) => ({ item: doc, count: 1 }));
  const match = useRouteMatch();
  return (
    <div id="interest-browser-view-page">
      {getMenuWidget(match)}
      <HeaderPane
        title="Interest Explorer"
        line1="Interests specify disciplinary areas of computer science (AI, Software Engineering) as well as other areas with a strong overlap (Entrepreneurship, Sustainability)."
        line2="Specify at least three interests so RadGrad can recommend related courses, opportunities, and community members."
      />
        <Grid stackable style={{marginLeft: '10px', marginRight: '10px'}}>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu menuAddedList={menuAddedItems} type={EXPLORER_TYPE.INTERESTS as IExplorerTypes} menuCareerList={menuCareerList} />
            </Grid.Column>
            <Grid.Column width={12}>
              <InterestBrowserViewContainer favoriteInterests={favoriteInterests} favoriteCareerGoalInterests={favoriteCareerGoalInterests} interests={interests} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
  return {
    favoriteCareerGoalInterests,
    favoriteInterests,
    interests,
  };
})(InterestBrowserViewPage);
