import moment from 'moment';
import React from 'react';
import {Button, Grid, Icon} from 'semantic-ui-react';
// import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../api/interest/InterestCollection';
import { ROLE } from '../../../../api/role/Role';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interest, StudentProfileUpdate } from '../../../../typings/radgrad';
import InterestBrowserViewContainer from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import PageLayout from '../../PageLayout';
import WidgetHeaderNumber from '../../../components/shared/explorer/WidgetHeaderNumber';
import {RadGradProperties} from '../../../../api/radgrad/RadGradProperties';

interface InterestBrowserViewPageProps {
  profileInterests: Interest[];
  interests: Interest[];
  nonProfileInterests: Interest[];
}

const headerPaneTitle = 'Find your interests';
const headerPaneBody = `
Interests specify disciplinary areas as well as other areas with a strong overlap.

Specify at least three interests so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a disciplinary area of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'header-interests.png';
const adminEmail = RadGradProperties.getAdminEmail();

const InterestBrowserViewPage: React.FC<InterestBrowserViewPageProps> = ({ profileInterests, interests, nonProfileInterests }) => (
    <PageLayout id="interest-browser-view-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid>
        <Grid.Row>
            <p color='grey'><Icon name='heart' color='grey' size='large'/>
            INTERESTS IN MY PROFILE <WidgetHeaderNumber inputValue={profileInterests.length} /> </p>
          <InterestBrowserViewContainer profileInterests={profileInterests} interests={profileInterests} />
        </Grid.Row>
        <Grid.Row>
            <span color='grey'>INTERESTS NOT IN MY PROFILE <WidgetHeaderNumber inputValue={nonProfileInterests.length} /> </span>
            <Button floated='right' basic color='teal' href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>
              <Icon name='mail' />
              &nbsp;&nbsp;SUGGEST a NEW INTEREST
            </Button>
          <InterestBrowserViewContainer profileInterests={profileInterests} interests={nonProfileInterests} />
        </Grid.Row>
      </Grid>
    </PageLayout>
);

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
  const nonProfileInterests = _.filter(interests, md => profileInterests.every(fd => fd._id !== md._id));
  return {
    profileInterests,
    interests,
    nonProfileInterests,
  };
})(InterestBrowserViewPage);
