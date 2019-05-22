//@qauchida
//05/20/19
//Faculty Widget that shows About Me information
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {_} from 'meteor/erasaur:meteor-lodash';
import {Container, Grid, Header, Label, Icon, Form, Button} from 'semantic-ui-react';
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {Users} from "../../../api/user/UserCollection";
import {Interests} from "../../../api/interest/InterestCollection";
import {CareerGoals} from "../../../api/career/CareerGoalCollection";

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
    //gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    //gets the user ID based on the username
    const facultyUserID = facultyDoc.userID;
    //gets the user profile based on the user ID
    const facultyUserProfile = Users.getProfile(facultyUserID);
    //gets the username based on the user ID
    const facultyUserUsername = facultyUserProfile.username;
    //get the career goal IDs based on the user ID
    const facultyCareerGoalsIDs = facultyUserProfile.careerGoalIDs;
    //map the career goal IDs to their names
    const facultyCareerGoals = _.map(facultyCareerGoalsIDs, (id) => CareerGoals.findDoc(id).name);
    //get the interest goal IDs based on the User ID
    const facultyInterestIDs = facultyUserProfile.interestIDs;
    //map the interests IDs to their names
    const facultyInterests = _.map(facultyInterestIDs, (id) => Interests.findDoc(id).name);

    //shows full doc object and all attributes
    console.log(Users.getProfile(facultyDoc));
    //shows the full name (first + last) of specific user
    console.log(Users.getFullName(facultyDoc));
    //shows boolean if the user is defined
    console.log(Users.isDefined(facultyUserID));
    //shows the User profile
    console.log(facultyUserProfile);
    //shows the User username
    console.log(facultyUserUsername);
    //shows the career goal IDs
    console.log(facultyCareerGoalsIDs);
    //shows the career goal names
    console.log(facultyCareerGoals);
    _.each(facultyCareerGoals, (careerGoals)=> console.log(careerGoals));
    //shows the interest goal IDs
    console.log(facultyInterestIDs);
    //shows the interest names array
    console.log(facultyInterests);
    _.each(facultyInterests, (interests)=>console.log(interests));


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
                    <Icon name='star'> {facultyInterests}</Icon>
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
