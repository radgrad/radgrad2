/**
 * qauchida
 * 05/20/19
 * Faculty Widget that shows About Me information
 */
import * as React from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Container, Grid, Header, Label, Icon, Form, Segment } from 'semantic-ui-react';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

/* global alert */

/**
 * The Faculty
 */
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

/**
 * The Faculty About Me Widget should show basic information of the specified user.
 */
class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps, { id: string; website: string; picture: string; }> {
  // call the props constructor
  constructor(props: any) {
    super(props);
  }

  /**
   * Changes state based on user input.
   * @param event Details of the Event
   * @param name Name of the Event
   * @param value User input
   */
  private handleChange = (event, { name, value }) => {
    console.log('handle change', event, { name, value });
    const change = {};
    change[name] = value;
    this.setState(change);
  };

  /**
   * Updates the website of specified user to match the current state.
   * @param event Details of the event
   */
  private handleSubmitWebsite = (event) => {
    const username = this.props.match.params.username;
    // gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    console.log('handle Submit Website');
    this.setState({ id: 'changed' });
    console.log(this.state);
    console.log(FacultyProfiles.findDoc(this.props.match.params.username).website);
    // updates faculty profile's website entry
    FacultyProfiles.update(facultyDoc._id, this.state);
    console.log(Users.getProfile(facultyDoc.userID));
    // need to alert userif their update was sucessful
    // also need to update the placeholder text
    console.log(event);
    // create an update data object examples:
  };

  /**
   * Updates the photo of specified user to match current state.
   * @param event Details of the event
   */
  private handleSubmitPhoto = (event) => {
    const username = this.props.match.params.username;
    // gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    console.log('handle Submit Photo');
    this.setState({ id: 'changed' });
    console.log(this.state);
    console.log(FacultyProfiles.findDoc(this.props.match.params.username).picture);
    // updates faculty profile's website entry
    FacultyProfiles.update(facultyDoc._id, this.state);
    console.log(Users.getProfile(facultyDoc.userID));
    // need to alert userif their update was sucessful
    // also need to update the placeholder text
    alert(event); // eslint-disable-line no-alert
  };

  /**
   * Calls the built in file handler.
   * @param event Details of the event
   */
  private fileSelectedHandler = (event) => {
    console.log(event.target.files[0]);
  };

  /**
   * Generates the slug for given interest
   * @param label The interest name of selected interest
   * @returns string Slug of specified interest
   */
  private generateInterestRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(this.props.match.params.username);
    const facultyUserID = facultyDoc.userID;
    const facultyUserProfile = Users.getProfile(facultyUserID);
    const facultyUserUsername = facultyUserProfile.username;
    label = label.toString().toLowerCase().split(' ').join('-'); // eslint-disable-line no-param-reassign
    // example url /faculty/binsted@hawaii.edu/explorer/interests/artificial-intelligence
    const explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername,
      'explorer', 'interests', label];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;
    return (exploreRoute);
  };

  /**
   * Generates the slug for the given career goal
   * @param label The name of the selected career goal
   * @returns string Slug of specified career goal
   */
  private generateCareerGoalsRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(this.props.match.params.username);
    const facultyUserID = facultyDoc.userID;
    const facultyUserProfile = Users.getProfile(facultyUserID);
    const facultyUserUsername = facultyUserProfile.username;
    label = label.toString().toLowerCase().split(' ').join('-'); // eslint-disable-line no-param-reassign
    // example url /faculty/binsted@hawaii.edu/explorer/interests/mobile-app-developer
    const explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername,
      'explorer', 'career-goals', label];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;
    return (exploreRoute);
  };

  /**
   * Renders all components
   */
  public render() {
    const username = this.props.match.params.username;
    // gets the doc object containing information on desired profile based on username
    const facultyDoc = FacultyProfiles.findDoc(username);
    // gets the user ID based on the username
    const facultyUserID = facultyDoc.userID;
    // gets the user profile based on the user ID
    const facultyUserProfile = Users.getProfile(facultyUserID);
    // gets the username based on the user ID
    const facultyUserUsername = facultyUserProfile.username;
    // gets the faculty website address
    const facultyWebsite = facultyUserProfile.website;
    // get the career goal IDs based on the userID
    const facultyCareerGoalsIDs = facultyUserProfile.careerGoalIDs;
    // map the career goal IDs to their names
    const facultyCareerGoals = _.map(facultyCareerGoalsIDs, (id) => CareerGoals.findDoc(id).name);
    // get the interest goal IDs based on the User ID
    const facultyInterestIDs = facultyUserProfile.interestIDs;
    // map the interests IDs to their names
    const facultyInterests = _.map(facultyInterestIDs, (id) => Interests.findDoc(id).name);
    // M: should make it so that you reference the doc and then the name rather than the doc directly
    // gets the url from the faculty profile's information
    // url is made up of: role/username/explorer/CareerOrInterests
    const explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer', 'interests'];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;
    // url for career path explorer
    const careerPath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername, 'explorer', 'career-goals'];
    let careerRoute = careerPath.join('/');
    careerRoute = `/${careerRoute}`;

    return (
      <Segment>
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
                    {_.map(facultyInterests, (interests, index) => (
                      <Label size='small' key={index} as={NavLink} exact={true}
                             to={this.generateInterestRoute(interests)}><Icon
                        name='star'>{interests}</Icon></Label>
                    ))}
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
                    {_.map(facultyCareerGoals, (careerGoals, index) => (
                      <Label size='small' key={index} as={NavLink} exact={true}
                             to={this.generateCareerGoalsRoute(careerGoals)}><Icon
                        name='suitcase'>{careerGoals}</Icon></Label>
                    ))}
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
      </Segment>
    );

  }


}

export default withRouter(FacultyPageAboutMeWidget);

/**
 * Addtional Notes:
 * may have to make quality checks and what not
 * make alert to notify user that information has been updated sucessfully
 * conditional showing of interest and career goal labels: if user doesn't have any, text should say:
 * no career goals/ interests added yet
 */
