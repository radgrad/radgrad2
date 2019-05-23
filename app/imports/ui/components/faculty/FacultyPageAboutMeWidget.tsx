//@qauchida
//05/20/19
//Faculty Widget that shows About Me information
import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {_} from 'meteor/erasaur:meteor-lodash';
import {Container, Grid, Header, Label, Icon, Form, Button} from 'semantic-ui-react';
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {Users} from "../../../api/user/UserCollection";
import {Interests} from "../../../api/interest/InterestCollection";
import {CareerGoals} from "../../../api/career/CareerGoalCollection";
import SlugCollection, {Slugs} from "../../../api/slug/SlugCollection";
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import roles = Meteor.roles;
import slugify from "../../../api/slug/SlugCollection";

interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      username: string;
      url: string;
    }
  }
}



class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  //call the props constructor
  constructor(props) {
    super(props);
  }
  /**Written by Gian Paolo
  private interestsRouteName = (interest) => {
    const url = this.props.match.url;
    const splitUrl = url.split('/');
    const group = splitUrl[1];
    const interestName = this.interestSlug(interest);
    switch (group) {
      case 'student':
        return `/student/${this.getUsername()}/explorer/interests/${interestName}`;
      case 'faculty':
        return `/faculty/${this.getUsername()}/explorer/interests/${interestName}`;
      default:
        return `/mentor/${this.getUsername()}/explorer/interests/${interestName}`;
    }
  }
*/
  public render() {
    const username = this.props.match.params.username;
    //gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    //gets the user ID based on the username
    const facultyUserID = facultyDoc.userID;
    //gets the user profile based on the user ID
    const facultyUserProfile = Users.getProfile(facultyUserID);
    //gets the username based on the user ID
    const facultyUserUsername = facultyUserProfile.username;
    //get the career goal IDs based on the user ID
    const facultyWebsite = facultyUserProfile.website;
    const facultyCareerGoalsIDs = facultyUserProfile.careerGoalIDs;
    //map the career goal IDs to their names
    const facultyCareerGoals = _.map(facultyCareerGoalsIDs, (id) => CareerGoals.findDoc(id).name);
    //get the interest goal IDs based on the User ID
    const facultyInterestIDs = facultyUserProfile.interestIDs;
    //map the interests IDs to their names
    const facultyInterests = _.map(facultyInterestIDs, (id) => Interests.findDoc(id).name);
    //M: should make it so that you reference the doc and then the name rather than the doc directly

    //gets the url from the faculty profile's information
    //url is made up of: role/username/explorer/CareerOrInterests
    let explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer','interests'];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;
    console.log(exploreRoute);


    let careerPath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer','career-goals'];
    let careerRoute = careerPath.join('/');
    careerRoute =`/${careerRoute}`;
    console.log(careerRoute);

    // for the picture upload, reference https://cloudinary.com/documentation/upload_widget

    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as='h3' dividing textAlign='left'>Profile</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Name</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              {Users.getFullName(facultyDoc)}
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Email</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              {facultyUserUsername}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Interests</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid>
                <Grid.Row textAlign='left'>
                  <Label.Group>
                  {_.map(facultyInterests, (interests, index) =>
                    <Label size='small'key={index} as='a'><Icon name='star'>{interests}</Icon></Label>
                  )}
                  </Label.Group>
                </Grid.Row>
                <Grid.Row>
                  <Link to={exploreRoute}>Edit in Interest Explorer</Link>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Career Goals</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid>
                <Grid.Row>
                  <Label.Group>
                  {_.map(facultyCareerGoals, (careerGoals, index) =>
                    <Label size='small' key={index} as='a'><Icon name='suitcase'>{careerGoals}</Icon></Label>
                  )}
                  </Label.Group>
                </Grid.Row>
                <Grid.Row>
                  <Link to={careerRoute}>Edit in Career Goal Explorer</Link>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Website</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form>
                <Form.Group>
                  <Input width={10} placeholder={facultyWebsite}/><Form.Button>Update</Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Picture(<a href={facultyUserUsername}>Upload</a>)</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form>
                <Form.Group>
                  <Input width={10} placeholder={facultyUserProfile.picture}/><Form.Button>Update</Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    );
  }

}

export default withRouter(FacultyPageAboutMeWidget);
