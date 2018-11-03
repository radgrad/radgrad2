import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';

const GuidedTourMentor = () => (
  <div>
    <Grid verticalAlign="middle" textAlign="center" container={true}>

      <Grid.Column width={4}>
        <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
      </Grid.Column>

      <Grid.Column width={8}>
        <h1>Guided Tour Mentor</h1>
      </Grid.Column>

    </Grid>
  </div>

);

export default GuidedTourMentor;
