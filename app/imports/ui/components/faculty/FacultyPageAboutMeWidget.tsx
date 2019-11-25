/**
 * qauchida
 * 05/20/19
 * Faculty Widget that shows About Me information
 */
import * as React from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Header, Label, Icon, Form, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { withTracker } from 'meteor/react-meteor-data';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IFacultyProfile } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';

/**
 * The Faculty
 */
interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      username: string;
      url: string;
    },
  }
  profile: IFacultyProfile;
}

interface IFacultyPageAboutMeWidgetState {
  website: string;
  picture: string;
}

/**
 * The Faculty About Me Widget should show basic information of the specified user.
 */
class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps, IFacultyPageAboutMeWidgetState> {
  // call the props constructor
  constructor(props: any) {
    super(props);
    this.state = {
      website: this.props.profile.website,
      picture: this.props.profile.picture,
    };
  }

  /**
   * Changes state based on user input.
   * @param event Details of the Event
   * @param name Name of the Event
   * @param value User input
   */
  private handleChange = (event, { name, value }) => {
    const newState = {
      ...this.state,
      [name]: value,
    };
    this.setState(newState);
  };

  /**
   * Updates the website of specified user to match the current state.
   * @param event Details of the event
   */
  private handleSubmitWebsite = (event): void => {
    event.preventDefault();
    const username = this.props.match.params.username;
    const profile = Users.getProfile(username);
    const collectionName = FacultyProfiles.getCollectionName();
    const updateData: { id: string; website: string } = { id: profile._id, website: this.state.website };
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          type: 'success',
          text: 'Your website link has been successfully updated.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
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

  private handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    const collectionName = FacultyProfiles.getCollectionName();
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      const profile = Users.getProfile(this.props.match.params.username);
      const updateData: { id: string; picture: string; } = { id: profile._id, picture: cloudinaryResult.info.url };
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          Swal.fire({
            title: 'Update Failed',
            text: error.message,
            type: 'error',
          });
        } else {
          this.setState({ picture: cloudinaryResult.info.url });
          Swal.fire({
            title: 'Update Succeeded',
            type: 'success',
            text: 'Your picture has been successfully updated.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
        }
      });
    }
  }

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
    // get the career goal IDs based on the userID
    const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID: facultyUserID });
    const facultyCareerGoalsIDs = _.map(favCareerGoals, (fav) => fav.careerGoalID);
    // map the career goal IDs to their names
    const facultyCareerGoals = _.map(facultyCareerGoalsIDs, (id) => CareerGoals.findDoc(id).name);
    // get the interest goal IDs based on the User ID
    const favInterests = FavoriteInterests.findNonRetired({ userID: facultyUserID });
    const facultyInterestIDs = _.map(favInterests, (fav) => fav.interestID);
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

    const { picture, website } = this.state;

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
                        name='star'/>{interests}</Label>
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
                        name='suitcase'/>{careerGoals}</Label>
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
              <Form onSubmit={this.handleSubmitWebsite}>
                <Form.Group>
                  <Form.Input name='website'
                              onChange={this.handleChange}
                              value={website}/>
                  <Form.Button basic={true} color="green">Update</Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5' textAlign='left'>Picture</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form onSubmit={this.handleUploadPicture}>
                <Form.Group>
                  <Form.Input name='picture'
                              onChange={this.handleChange}
                              value={picture}/>
                  <Form.Button basic={true} color="green">Upload</Form.Button>
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default withRouter(withTracker((props) => ({
  profile: Users.getProfile(props.match.params.username),
}))(FacultyPageAboutMeWidget));

/**
 * Addtional Notes:
 * may have to make quality checks and what not
 * make alert to notify user that information has been updated sucessfully
 * conditional showing of interest and career goal labels: if user doesn't have any, text should say:
 * no career goals/ interests added yet
 */
