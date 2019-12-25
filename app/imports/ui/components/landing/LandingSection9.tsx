import React from 'react';
import { Card, Grid, Header, Icon, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import styles from './landing-styles';

const paddingStyle = {
  paddingTop: '1.2rem',
};
const noBoxShadowStyle = {
  boxShadow: 'none',
};

const LandingSection9 = () => (
  <div id="landing-section-9" style={styles['inverted-section']}>
    <Grid stackable container>
      <Grid.Column textAlign="center">
        <Header as="h1" style={styles['inverted-header']}>Ready to get started?</Header>
        <p style={styles['inverted-description']}>Take a guided tour!</p>
        <Grid>
          <Card.Group stackable itemsPerRow={4} style={paddingStyle}>
            <Card style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/students.jpg" />
              </div>
              <a className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/student">
Students
                <Icon name="chevron right" />
              </a>
            </Card>
            <Card style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/advisor.png" />
              </div>
              <a className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/advisor">
                Advisors
                <Icon name="chevron right" />
              </a>
            </Card>
            <Card style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/ics-faculty-group.png" />
              </div>
              <a className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/faculty">
                Faculty
                <Icon name="chevron right" />
              </a>
            </Card>
            <Card className="ui card" style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/nagashima.jpg" />
              </div>
              <a className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/mentor">
                Mentors
                <Icon name="chevron right" />
              </a>
            </Card>
          </Card.Group>
        </Grid>
      </Grid.Column>
    </Grid>
  </div>
);

const LandingSection9Container = withRouter(LandingSection9);
export default LandingSection9Container;
// export default LandingSection9;
