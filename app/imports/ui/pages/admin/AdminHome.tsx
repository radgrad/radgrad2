import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class AdminHome extends React.Component {
  public render() {
    return (
      <Grid verticalAlign="middle" textAlign="center" container={true}>

        <Grid.Column width={4}>
          <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
        </Grid.Column>

        <Grid.Column width={8}>
          <h1>Admin Home</h1>
        </Grid.Column>

      </Grid>
    );
  }
}

export default AdminHome;
