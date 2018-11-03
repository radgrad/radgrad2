import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, Container, Grid, Header, Icon, Image, Label, Loader, Segment } from 'semantic-ui-react';
import styles from './landing-styles';

const paddingStyle = {
  paddingTop: '1.2rem',
};
const noBoxShadowStyle = {
  boxShadow: 'none',
};

interface ILandingSection9Props {
  ref: any;
}
class LandingSection9 extends React.Component<ILandingSection9Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (

      <div id="landing-section-9" style={styles['inverted-section']} ref={this.props.ref}>

        <Grid stackable={true} container={true}>

          <Grid.Column textAlign={'center'}>
            <Header as="h1" style={styles['inverted-header']}>Ready to get started?</Header>
            <p style={styles['inverted-description']}>Take a guided tour!</p>

            <Grid>
              <Card.Group stackable={true} itemsPerRow={4} style={paddingStyle}>
                <Card style={noBoxShadowStyle}>
                  <Image src="/images/landing/students.jpg"/>
                  <Button attached="bottom" className="ui bottom attached button"
                          href="{{pathFor studentGuidedTourPageRouteName}}">
                    Students
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>

                <Card style={noBoxShadowStyle}>
                  <div className="image">
                    <Image src="/images/landing/advisor.png"/>
                  </div>
                  <Button attached="bottom" href="{{pathFor advisorGuidedTourPageRouteName}}">
                    Advisors
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>

                <Card style={noBoxShadowStyle}>
                  <div className="image">
                    <Image src="/images/landing/ics-faculty-group.png"/>
                  </div>
                  <Button attached="bottom" className="ui bottom attached button"
                          href="{{pathFor facultyGuidedTourPageRouteName}}">
                    Faculty
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>

                <Card className="ui card" style={noBoxShadowStyle}>
                  <div className="image">
                    <Image src="/images/landing/nagashima.jpg"/>
                  </div>
                  <Button attached="bottom" className="ui bottom attached button"
                          href="{{pathFor mentorGuidedTourPageRouteName}}">
                    Mentors
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>
              </Card.Group>
            </Grid>

          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

export default LandingSection9;
