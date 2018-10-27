import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import NavBar from '../../components/NavBar';

/** A simple static component to render some text for the landing page. */
class AdvisorHome extends React.Component {
  public render() {
    return (
      <div>
        <NavBar/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/meteor-logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Advisor Home</h1>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

export default AdvisorHome;
