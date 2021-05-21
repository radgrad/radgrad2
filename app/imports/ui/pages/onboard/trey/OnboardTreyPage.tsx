import React from 'react';
import { Grid } from 'semantic-ui-react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import Task1Component from './Task1Component';
import Task2Component from './Task2Component';
import Task3Component from './Task3Component';

const headerPaneTitle = "Trey's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTreyPage: React.FC = () => (
    <PageLayout id={PAGEIDS.ONBOARD_TREY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Task3Component/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Task1Component/>
          </Grid.Column>
          <Grid.Column>
            <Task2Component/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
);

export default OnboardTreyPage;
