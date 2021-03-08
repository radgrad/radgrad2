import moment from 'moment';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../api/interest/InterestCollection';
import { ROLE } from '../../../../api/role/Role';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interest, StudentProfileUpdate } from '../../../../typings/radgrad';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import InterestBrowserViewContainer from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import PageLayout from '../../PageLayout';

interface InterestBrowserViewPageProps {
  profileInterests: Interest[];
  interests: Interest[];
}

const headerPaneTitle = 'Find your interests';
const headerPaneBody = `
Interests specify disciplinary areas as well as other areas with a strong overlap.

Specify at least three interests so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a disciplinary area of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'header-interests.png';


const InterestBrowserViewPage: React.FC<InterestBrowserViewPageProps> = ({ profileInterests, interests }) => {
  const menuAddedItems = _.map(profileInterests, (doc) => ({ item: doc, count: 1 }));
  return (
    <PageLayout id="interest-browser-view-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid stackable>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu menuAddedList={menuAddedItems} type={EXPLORER_TYPE.INTERESTS as IExplorerTypes} />
            </Grid.Column>
            <Grid.Column width={12}>
              <InterestBrowserViewContainer profileInterests={profileInterests} interests={interests} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  if (profile.role === ROLE.STUDENT) {
    const lastVisited = moment().format('YYYY-MM-DD');
    if (lastVisited !== profile.lastVisitedInterests) {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = profile._id;
      updateData.lastVisitedInterests = lastVisited;
      updateMethod.call({ collectionName, updateData }, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  }
  const allInterests = Users.getInterestIDs(profile.userID);
  const profileInterests = allInterests.map((id) => Interests.findDoc(id));
  const interests = Interests.findNonRetired({}); // TODO should we filter out the ones in the profile?
  return {
    profileInterests,
    interests,
  };
})(InterestBrowserViewPage);
