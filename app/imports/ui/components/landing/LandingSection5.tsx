import * as React from 'react';
import { Card, Container, Grid, Header, Icon, Image, Label, Segment } from 'semantic-ui-react';
import styles from './landing-styles';

class LandingSection5 extends React.Component {
  public render() {
    return (
      <div id="landing-section-5" style={styles['inverted-section']}>
        <Container>
          <Grid columns={2} centered={true} padded={true} stackable={true} style={styles['landing-section-3 .grid, landing-section-4 .grid, landing-section-5 .grid, landing-section-6 .container, landing-section-7 .grid, landing-section-8 .container, landing-section-9 .container']}>
            <Grid.Column>
              <Image rounded={true} src="/images/landing/abi-home-ice.png"/>
            </Grid.Column>

            <Grid.Column>
              <Header as="h1" style={styles['inverted-header']}>Measure your progress with ICE</Header>
              <p style={styles['inverted-description']}>A decent GPA is only one piece of the puzzle for a well-rounded
                computer science degree experience. RadGrad
                provides a self-assessment tool called "ICE", which stands for <span className="ice-innovation-proj-color"><b>Innovation</b></span>,
                <span className="ice-competency-proj-color"><b>Competency</b></span>, and <span className="ice-experience-proj-color"><b>Experience</b></span>.
              </p>

              <p style={styles['inverted-description']}>To be competitive in the high tech job market, you want to demonstrate
                competency (through good grades in CS course
                work), innovation (through participation in research, hackathons, and the like), and real-world
                experience
                (through participation in internships and other professional experiences).
              </p>

              <p style={styles['inverted-description']}>
                How do you know when you're well-rounded? Just accumulate 100 points in each of the three categories by
                the
                time you graduate.
              </p>
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default LandingSection5;
