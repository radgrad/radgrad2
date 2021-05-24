import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import Task1Segment from './Task1Segment';
import Task2Segment from './Task2Segment';
import Task3Segment from './Task3Segment';
import Task4Segment from './Task4Segment';
import Task5Segment from './Task5Segment';

const headerPaneTitle = "Andre's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardAndrePage: React.FC = () => (
    <PageLayout id={PAGEIDS.ONBOARD_ANDRE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid>
        <Grid.Row columns={1}>
          <GridColumn>
            <Task5Segment/>
          </GridColumn>
        </Grid.Row>
        <Grid.Row columns={1}>
          <GridColumn>
            <Task4Segment/>
          </GridColumn>
        </Grid.Row>  
        <Grid.Row columns={1}>
          <GridColumn>
            <Task3Segment/>
          </GridColumn>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Task1Segment/>
          </Grid.Column>
          <GridColumn>
            <Task2Segment/>
          </GridColumn>
        </Grid.Row>
      </Grid>
    </PageLayout>
);

export default OnboardAndrePage;
