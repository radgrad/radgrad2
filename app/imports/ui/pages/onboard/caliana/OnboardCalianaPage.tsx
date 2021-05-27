import React from 'react';
import { Grid } from 'semantic-ui-react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import Task2 from './Task2';
import Task3 from './Task3';
import Task4 from './Task4';
import Task5 from './Task5';
import Task6 from './Task6';
import Task7 from './Task7';

const headerPaneTitle = "Caliana's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const headerTask1 = <RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas icon' dividing/>;

const OnboardCalianaPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_CALIANA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
              headerPaneImage={headerPaneImage}>
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Task7/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Task6/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Task5/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Task4/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Task3/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>
          <RadGradSegment header={headerTask1}>
            Hello World
          </RadGradSegment>
        </Grid.Column>
        <Grid.Column>
          <Task2/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </PageLayout>
);

export default OnboardCalianaPage;
