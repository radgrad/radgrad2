import React from 'react';
import { Grid } from 'semantic-ui-react';
import CommunityActivity from '../../components/shared/community/CommunityActivity';
import LevelDistribution from '../../components/shared/community/LevelDistribution';
import MostPopular, { MOSTPOPULAR } from '../../components/shared/community/MostPopular';
import UpcomingEvents from '../../components/shared/community/UpcomingEvents';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'What\'s happening in RadGrad?';
const headerPaneBody = `
Here are the latest updates in RadGrad, plus overviews of the RadGrad community.
`;
const headerPaneImage = 'header-community.png';

const CommunityPage: React.FC = () => (
  <PageLayout id="community-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={16}>
          <LevelDistribution/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Column width={10}>
        <UpcomingEvents/>
      </Grid.Column>
      <Grid.Column width={6}>
        <CommunityActivity/>
        <MostPopular type={MOSTPOPULAR.CAREERGOAL}/>
        <MostPopular type={MOSTPOPULAR.INTEREST}/>
      </Grid.Column>
    </Grid>
  </PageLayout>
);

export default CommunityPage;
