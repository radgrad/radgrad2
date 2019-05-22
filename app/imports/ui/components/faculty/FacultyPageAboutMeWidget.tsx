//@qauchida
//05/20/19
//Faculty Widget that shows About Me information
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {_} from 'meteor/erasaur:meteor-lodash';
import {Container, Grid, Header, Label, Icon, Form, Button} from 'semantic-ui-react';
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {Users} from "../../../api/user/UserCollection";
import {$} from "meteor/jquery";

interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      username: string;
    }
  }
}

class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  //call the props constructor
  constructor(props) {
    super(props);
  }

  public render() {
    const username = this.props.match.params.username;
    const facultyDoc = FacultyProfiles.findDoc(username);

    //gets the user ID based on the username
    const facultyUserID = facultyDoc.userID;
    //gets the user profile based on the user ID
    const facultyUserProfile = Users.getProfile(facultyUserID);
    //gets the username based on the user ID
    const facultyUserUsername = facultyUserProfile.username;
    //shows full doc object and all attributes
    console.log(Users.getProfile(facultyDoc));
    //shows the full name (first + last) of specific user
    console.log(Users.getFullName(facultyDoc));
    console.log(Users.isDefined(facultyUserID));
    console.log(facultyUserProfile);
    console.log(facultyUserUsername);

    //console.log(facultyInterestsIDs);
    //console.log(facultyCareerGoalsIDs);


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
                <Grid.Row>
                  <Label as='a'>
                    <Icon name='star'> Interests</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='star'> Interests</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='star'> Interests</Icon>
                  </Label>
                </Grid.Row>
                <Grid.Row>
                  <a>Edit in Interest Explorer</a>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Career Goals</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid>
                <Grid.Row>
                  <Label as='a'>
                    <Icon name='suitcase'> Career Goals</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='suitcase'> Career Goals</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='suitcase'> Career Goals</Icon>
                  </Label>
                </Grid.Row>
                <Grid.Row>
                  <a>Edit in Career Goal Explorer</a>
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
                  <Form.Input width={8}/><Form.Button>Update</Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Picture(<a>Upload</a>)</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form>
                <Form.Group>
                  <Form.Input width={8}/><Form.Button>Update</Form.Button>
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
