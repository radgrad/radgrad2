/**@qauchida
 * 05/20/19
 * Faculty Widget that shows About Me information
 */
import * as React from 'react';
import {withRouter, Link, NavLink} from 'react-router-dom';
import {_} from 'meteor/erasaur:meteor-lodash';
import {Container, Grid, Header, Label, Icon, Form} from 'semantic-ui-react';
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {Users} from "../../../api/user/UserCollection";
import {Interests} from "../../../api/interest/InterestCollection";
import {CareerGoals} from "../../../api/career/CareerGoalCollection";
//import slugify from "../../../api/slug/SlugCollection.ts";
interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      username: string;
      url: string;
    },
    state: {
      id: 'not changed';
      website: string;
      picture: string;
    }
  }
}

class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  //call the props constructor
  constructor(props: any) {
    super(props);
  }

  //react.sematic-ui.com
  private handleChange = (event, {name, value}) => {
    console.log('handle change');
    console.log(event, {name, value});
    this.setState({[name]: value});
  };

  private handleSubmitWebsite = (event) => {
    const username = this.props.match.params.username;
//gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    console.log('handle Submit Website');
    this.setState({id: 'changed'});
    console.log(this.state);
    console.log(FacultyProfiles.findDoc(this.props.match.params.username).website);
    //updates faculty profile's website entry
    FacultyProfiles.update(facultyDoc._id, this.state);
    console.log(Users.getProfile(facultyDoc.userID));
    //need to alert userif their update was sucessful
    //also need to update the placeholder text
    alert(event);

// I want to assign this.state.websiteInput to the
  };

  private handleSubmitPhoto = (event) => {
    const username = this.props.match.params.username;
//gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    console.log('handle Submit Photo');
    this.setState({id: 'changed'});
    console.log(this.state);
    console.log(FacultyProfiles.findDoc(this.props.match.params.username).picture);
    //updates faculty profile's website entry
    FacultyProfiles.update(facultyDoc._id, this.state);
    console.log(Users.getProfile(facultyDoc.userID));
    //need to alert userif their update was sucessful
    //also need to update the placeholder text
    alert(event);
  };

  //private method to call the picture uploader
  private fileSelectedHandler = (event) => {
    console.log(event.target.files[0]);
  };
  private generateInterestRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(this.props.match.params.username);
    const facultyUserID = facultyDoc.userID;
    const facultyUserProfile = Users.getProfile(facultyUserID);
    const facultyUserUsername = facultyUserProfile.username;
    label = label.toString().toLowerCase().replace(' ', '-');
    console.log(label);
    //example url /faculty/binsted@hawaii.edu/explorer/interests/artificial-intelligence
    let explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername,
      'explorer', 'interests', label];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;
    return(exploreRoute);
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
    //url for career path explorer
    let careerPath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer', 'career-goals'];
    let careerRoute = careerPath.join('/');
    careerRoute = `/${careerRoute}`;
//handles the submit for website changes

// for the picture upload, reference https://cloudinary.com/documentation/upload_widget from RadGrad1
// here is the react way: https://www.npmjs.com/package/react-images-upload

// React Image Uploader https://www.npmjs.com/package/react-images-upload

    return (
      <Container>
        <div className="ui padded container segment">
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
                <Header as='h5' textAlign='left'>{Users.getFullName(facultyDoc)}</Header>
              </Grid.Column>
              <Grid.Column floated='left' width={2}>
                <Header as='h5' textAlign='left'>Email</Header>
              </Grid.Column>
              <Grid.Column floated='left' width={6}>
                <Header as='h5' textAlign='left'>{facultyUserUsername}</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column floated='left' width={2}>
                <Header as='h5' textAlign='left'>Interests</Header>
              </Grid.Column>
              <Grid.Column floated='left' width={6}>
                <Grid>
                  <Grid.Row divided textAlign='left'>
                    <Label.Group>
                      {_.map(facultyInterests, (interests, index) =>
                        <Label size='small' key={index} as={NavLink} exact={true} to={this.generateInterestRoute(interests)}><Icon
                          name='star'>{interests}</Icon></Label>
                          )}
                    </Label.Group>
                  </Grid.Row>
                  <Link to={exploreRoute}>Edit in Interest Explorer</Link>
                </Grid>
              </Grid.Column>
              <Grid.Column floated='left' width={2}>
                <Header as='h5' textAlign='left'>Career Goals</Header>
              </Grid.Column>
              <Grid.Column floated='left' width={6}>
                <Grid>
                  <Grid.Row divided textAlign='left'>
                    <Label.Group>
                      {_.map(facultyCareerGoals, (careerGoals, index) =>
                        <Label size='small' key={index} as='a' href='Career Goals Route'><Icon
                          name='suitcase'>{careerGoals}</Icon></Label>
                      )}
                    </Label.Group>
                  </Grid.Row>
                  <Link to={careerRoute}>Edit in Career Goal Explorer</Link>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column floated='left' width={2}>
                <Header as='h5' textAlign='left'>Website</Header>
              </Grid.Column>
              <Grid.Column floated='left' width={6}>
                <Form onSubmit={this.handleSubmitWebsite} success>
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
                <Header as='h5' textAlign='left'>Picture</Header>
              </Grid.Column>
              <Grid.Column floated='left' width={6}>
                <Form onSubmit={this.handleSubmitPhoto} success>
                  <Form.Group>
                    <Form.Input
                      onChange={this.handleChange} width={10}
                      name='picture'
                      placeholder={facultyUserProfile.picture}/>
                    <Form.Button content='Update'/>
                  </Form.Group>
                </Form>
                <input type='file' onChange={this.fileSelectedHandler}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Container>
    );

  }


}

export default withRouter(FacultyPageAboutMeWidget);

//update button on click should update the appropriate field with information inputted from the user
// may have to make quality checks and what not

