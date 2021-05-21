import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Trey's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTreyPage: React.FC = () => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  return (
    <PageLayout id={PAGEIDS.ONBOARD_TREY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas' dividing />}>Hello World</RadGradSegment>
          </Grid.Column>
          <Grid.Column>
            <RadGradSegment header={<RadGradHeader title='TASK 2: WHO IS THE USER?' icon='user graduate' dividing />}><p>The currently logged in user is: {currentUser}.</p><p>The username appearing in the URL is: {username}.</p><p>In RadGrad, these are not necessarily the same!</p></RadGradSegment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default OnboardTreyPage;
