import React from 'react';
import { Card, Grid, Header, Icon, Image } from 'semantic-ui-react';
import styles from './utilities/landing-styles';

const paddingStyle = {
  paddingTop: '1.2rem',
};
const noBoxShadowStyle = {
  boxShadow: 'none',
};

const LandingSection9: React.FC = () => (
  <div id="landing-section-9" style={styles['inverted-section-green']}>
    <Grid stackable container>
      <Grid.Column textAlign="center">
        <Header as="h1" style={styles['inverted-header2']}>Ready to get started?</Header>
        <Grid>
          <Card.Group stackable itemsPerRow={4} style={paddingStyle}>
            <Card style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/students.jpg" />
              </div>
              <a id="landing-guided-tour-students-link" className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/student">
                STUDENTS
                <Icon name="chevron right" />
              </a>
            </Card>
            <Card style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/advisor.png" />
              </div>
              <a id="landing-guided-tour-advisors-link" className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/advisor">
                ADVISORS
                <Icon name="chevron right" />
              </a>
            </Card>
            <Card style={noBoxShadowStyle}>
              <div className="image">
                <Image src="/images/landing/ics-faculty-group.png" />
              </div>
              <a id="landing-guided-tour-faculty-link" className="ui bottom attached button" aria-current="false" role="button" href="#/guidedtour/faculty">
                FACULTY
                <Icon name="chevron right" />
              </a>
            </Card>
          </Card.Group>
        </Grid>
      </Grid.Column>
    </Grid>
  </div>
);

export default LandingSection9;