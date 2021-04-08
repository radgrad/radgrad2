import React from 'react';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react';
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
          <Segment>
            <Header dividing><Icon name="graduation cap" /> RADGRAD STUDENTS</Header>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Grid.Column width={10}>
        <Segment>
          <Header dividing><Icon name="calendar alternate outline" /> UPCOMING EVENTS</Header>
        </Segment>
        <Segment>
          <Header dividing><Icon name="user" />TOP LEVEL STUDENTS</Header>
        </Segment>
      </Grid.Column>
      <Grid.Column width={6}>
        <Segment>
          <Header dividing><Icon className='calendar alternate outline' /> COMMUNITY ACTIVITY</Header>
        </Segment>
        <Segment>
          <Header dividing><Icon name="lightbulb outline" /> TOP 5 INTERESTS</Header>
        </Segment>
        <Segment>
          <Header dividing><Icon name="briefcase" />TOP 5 CAREER GOALS</Header>
        </Segment>
      </Grid.Column>
    </Grid>
  </PageLayout>
);

export default CommunityPage;
