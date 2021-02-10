import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../guidedtour-style';

const DegreePlanPane: React.FC = () => (
  <div>
    <Grid container stackable>
      <Grid.Row centered>
        <Grid.Column width={5}>
          <Image rounded size="large" src="/images/help/degree-planner-plan2.png" />
        </Grid.Column>
        <Grid.Column width={11}>
          <Header style={styles.h1}>Degree Plan Pane</Header>
          <p style={styles.p}>
            The degree plan pane shows you your courses and opportunities on a semester-by-semester basis.
            <br />
            For past semesters, courses and opportunities are listed in light grey and are read-only. To modify the contents of your degree plan for previous semesters, please see an ICS advisor. You will generally want to ask them to
            update your historical data from your STAR data after each semester.
            <br />
            For current and future semesters, you can freely add and delete courses and opportunities according to your preferences.
            <br />
            <br />
            Clicking on a course or opportunity will display details about it in the Favorites/Details pane.
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default DegreePlanPane;
