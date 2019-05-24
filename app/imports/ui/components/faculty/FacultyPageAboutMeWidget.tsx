/**@qauchida
 * 05/20/19
 * Faculty Widget that shows About Me information
 */
import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {_} from 'meteor/erasaur:meteor-lodash';
import {Container, Grid, Header, Label, Icon, Form} from 'semantic-ui-react';
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {Users} from "../../../api/user/UserCollection";
import {Interests} from "../../../api/interest/InterestCollection";
import {CareerGoals} from "../../../api/career/CareerGoalCollection";

interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      username: string;
      url: string;
    },
    state: {
      website: string;
      submittedWebsite: string;
      photo: string;
      submittedPhoto: string;
    }
  }
}

class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  //call the props constructor
  constructor(props) {
    super(props);
  }

  //react.sematic-ui.com
  private handleChange = (event, {name, value}) => {
    console.log('handle change');
    console.log(event);
    this.setState({[name]: value});
    console.log(this.state);
  };

  private handleSubmit = () => {
    console.log('handle submit');

    const {website, photo} = this.state;
    this.setState({submittedWebsite: website, submittedPhoto: photo});
    console.log(this.state);

    switch (this.state) {
      case 'website':
        Users.getProfile(this.props.match.params.username).website = this.state;
        console.log(Users.getProfile(this.props.match.params.username).website);
        console.log('handle submit website')
        break;
      case 'photo':
        Users.getProfile(this.props.match.params.username).photo = this.state;
        console.log(Users.getProfile(this.props.match.params.username).photo);
        console.log('handle submit photo');
        break;
    }
  };

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
//gets the faculty website address
    const facultyWebsite = facultyUserProfile.website;
    //get the career goal IDs based on the userID
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
    let explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer', 'interests'];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;

    let careerPath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer', 'career-goals'];
    let careerRoute = careerPath.join('/');
    careerRoute = `/${careerRoute}`;
//handles the submit for website changes

// for the picture upload, reference https://cloudinary.com/documentation/upload_widget from RadGrad1
// here is the react way: https://www.npmjs.com/package/react-images-upload

// React Image Uploader https://www.npmjs.com/package/react-images-upload

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
                      <Label size='small' key={index} as='a'><Icon name='star'>{interests}</Icon></Label>
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
              <Form onSubmit={this.handleSubmit} success>
                <Form.Group>
                  <Form.Input width={10}
                              name='website'
                              onChange={this.handleChange}
                              placeholder={facultyWebsite}/>
                  <Form.Button content='Update'/>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Picture(<a id="image-upload-widget">Upload</a>)</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form onSubmit={this.handleSubmit} className='uploadPicture' success>
                <Form.Group>
                  <Form.Input onChange={this.handleChange} width={10}
                              name='photo'
                              placeholder={facultyUserProfile.picture}/>
                  <Form.Button content='Update'/>
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

//update button on click should update the appropriate field with information inputted from the user
// may have to make quality checks and what not

