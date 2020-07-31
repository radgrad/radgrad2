import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/guidedtour-style';

const FavoriteAcademicPlans = () => (
  <div>
    <Grid container stackable>
      <Grid.Row centered>
        <Grid.Column width={5}>
          <Image rounded size="large" src="/images/help/academic-plan.png" />
        </Grid.Column>
        <Grid.Column width={11}>
          <Header style={styles.h1}>Favorite Academic Plans</Header>
          <p style={styles.p}>
            The Favorite Academic Plan tab shows you the academic plans that you have favorited. When you choose one of your favorite plans the tab provides you with the requirements for graduating with any of the degree programs in eight semesters. You are eligible to select any degree plan available during the year you declare yourself as an ICS major, and you can switch to any future degree plan if you prefer.
            <br /><br />
            Once you have selected an Academic Plan, RadGrad will indicate which requirements you have and have not satisfied in this degree plan: requirements you have satisfied are listed in green, and those you have not are listed in red.
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default FavoriteAcademicPlans;
