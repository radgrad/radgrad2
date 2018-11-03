import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Card, Container, Grid, Header, Icon, Image, Label, Loader, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
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
                  <Button as={NavLink} attached="bottom"
                          to="/guidedtour/student">
                    Students
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>

                <Card style={noBoxShadowStyle}>
                  <div className="image">
                    <Image src="/images/landing/advisor.png"/>
                  </div>
                  <Button as={NavLink} attached="bottom" to="/guidedtour/advisor">
                    Advisors
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>

                <Card style={noBoxShadowStyle}>
                  <div className="image">
                    <Image src="/images/landing/ics-faculty-group.png"/>
                  </div>
                  <Button as={NavLink} attached="bottom"
                          to="/guidedtour/faculty">
                    Faculty
                    <Icon name={'chevron right'}/>
                  </Button>
                </Card>

                <Card className="ui card" style={noBoxShadowStyle}>
                  <div className="image">
                    <Image src="/images/landing/nagashima.jpg"/>
                  </div>
                  <Button as={NavLink} attached="bottom"
                          to="/guidedtour/mentor">
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

const LandingSection9Container = withRouter(LandingSection9); // CAM: should this be LandingSection9Container?
export default LandingSection9Container;
