import React from 'react';
import { Grid } from 'semantic-ui-react';
import PageLayout from '../../PageLayout';
import Task1 from './Task1';
import Task2 from './Task2';
import Task3 from './Task3';
import Task4 from './Task4';
import Task5 from './Task5';
import Task6 from './Task6';

const headerPaneTitle = "Philip's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardPhilipPage: React.FC = () => (
  <PageLayout id="sandbox-onboard-philip" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Grid columns='equal'>
      <Grid.Row>
        <Grid.Column><Task6 /></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column><Task5 /></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column><Task4 /></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column><Task3 /></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column><Task1 /></Grid.Column>
        <Grid.Column><Task2 /></Grid.Column>
      </Grid.Row>
    </Grid>
  </PageLayout>
);

export default OnboardPhilipPage;
