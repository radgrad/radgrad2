/**
 * qauchida
 * 05/20/19
 * Faculty Widget that shows About Me information
 */
import React, { useState } from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';
import _ from 'lodash';
import { Grid, Header, Label, Icon, Form, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { withTracker } from 'meteor/react-meteor-data';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IFacultyProfile, IFavoriteCareerGoal, IFavoriteInterest } from '../../../typings/radgrad';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { getUserIdFromRoute, getUsername } from '../shared/RouterHelperFunctions';

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
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
}

/**
 * The Faculty About Me Widget should show basic information of the specified user.
 */
const FacultyPageAboutMeWidget = (props: IFacultyPageAboutMeWidgetProps) => {
  // console.log('FacultyPageAboutMeWidget', props);
  const [websiteState, setWebsite] = useState(props.profile.website);
  const [pictureState, setPicture] = useState(props.profile.picture);

  /**
   * Changes state based on user input.
   * @param event Details of the Event
   * @param name Name of the Event
   * @param value User input
   */
  const handleChange = (event, { name, value }) => {
    switch (name) {
      case 'website':
        setWebsite(value);
        break;
      case 'picture':
        setPicture(value);
        break;
      default:
      // do nothing.
    }
  };

  /**
   * Updates the website of specified user to match the current state.
   * @param event Details of the event
   */
  const handleSubmitWebsite = (event): void => {
    event.preventDefault();
    const username = props.match.params.username;
    const profile = Users.getProfile(username);
    const collectionName = FacultyProfiles.getCollectionName();
    const updateData: { id: string; website: string } = { id: profile._id, website: websiteState };
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          icon: 'success',
          text: 'Your website link has been successfully updated.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
  };

  /**
   * Generates the slug for given interest
   * @param label The interest name of selected interest
   * @returns string Slug of specified interest
   */
  const generateInterestRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(props.match.params.username);
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
  const generateCareerGoalsRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(props.match.params.username);
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

  const handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    const collectionName = FacultyProfiles.getCollectionName();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        const profile = Users.getProfile(props.match.params.username);
        const updateData: { id: string; picture: string; } = { id: profile._id, picture: cloudinaryResult.info.url };
        updateMethod.call({ collectionName, updateData }, (error) => {
          if (error) {
            Swal.fire({
              title: 'Update Failed',
              text: error.message,
              icon: 'error',
            });
          } else {
            setPicture(cloudinaryResult.info.url);
            Swal.fire({
              title: 'Update Succeeded',
              icon: 'success',
              text: 'Your picture has been successfully updated.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            });
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed to Upload Photo',
        icon: 'error',
        text: error.statusText,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  const marginStyle = {
    marginBottom: 0,
  };

  const username = props.match.params.username;
  // gets the doc object containing information on desired profile based on username
  const facultyDoc = FacultyProfiles.findDoc(username);
  // gets the user ID based on the username
  const facultyUserID = facultyDoc.userID;
  // gets the user profile based on the user ID
  const facultyUserProfile = Users.getProfile(facultyUserID);
  // gets the username based on the user ID
  const facultyUserUsername = facultyUserProfile.username;
  // get the career goal IDs based on the userID
  const favCareerGoals = props.favoriteCareerGoals;
  const facultyCareerGoalsIDs = _.map(favCareerGoals, (fav) => fav.careerGoalID);
  // map the career goal IDs to their names
  const facultyCareerGoals = _.map(facultyCareerGoalsIDs, (id) => CareerGoals.findDoc(id).name);
  // get the interest goal IDs based on the User ID
  const favInterests = props.favoriteInterests;
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

  return (
    <Segment>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3" dividing textAlign="left">Profile</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Name</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Header as="h5" textAlign="left">{Users.getFullName(facultyDoc)}</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Email</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Header as="h5" textAlign="left">{facultyUserUsername}</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Interests</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Grid>
              <Grid.Row divided textAlign="left">
                <Label.Group>
                  {
                    facultyInterests.length > 0 ? (
                        _.map(facultyInterests, (interests, index) => (
                          <Label
                            size="small"
                            key={index}
                            as={NavLink}
                            exact
                            to={generateInterestRoute(interests)}
                          >
                            <Icon
                              name="star"
                            />
                            {interests}
                          </Label>
                        ))
                      )
                      : <p style={marginStyle}>No interests favorited yet.</p>
                  }
                </Label.Group>
              </Grid.Row>
              <Link to={exploreRoute}>Edit in Interest Explorer</Link>
            </Grid>
          </Grid.Column>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Career Goals</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Grid>
              <Grid.Row divided textAlign="left">
                <Label.Group>
                  {
                    facultyCareerGoals.length > 0 ? (
                        _.map(facultyCareerGoals, (careerGoals, index) => (
                          <Label
                            size="small"
                            key={index}
                            as={NavLink}
                            exact
                            to={generateCareerGoalsRoute(careerGoals)}
                          >
                            <Icon name="suitcase" /> {careerGoals}
                          </Label>
                        ))
                      )
                      : <p style={marginStyle}>No career goals favorited yet.</p>
                  }
                </Label.Group>
              </Grid.Row>
              <Link to={careerRoute}>Edit in Career Goal Explorer</Link>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Website</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Form onSubmit={handleSubmitWebsite}>
              <Form.Group>
                <Form.Input
                  name="website"
                  onChange={handleChange}
                  value={websiteState}
                />
                <Form.Button basic color="green">Update</Form.Button>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Picture</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Form onSubmit={handleUploadPicture}>
              <Form.Group>
                <Form.Input
                  name="picture"
                  onChange={handleChange}
                  value={pictureState}
                />
                <Form.Button basic color="green">Upload</Form.Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const FacultyPageAboutMeWidgetCon = withTracker(({ match }) => {
  const username = getUsername(match);
  const profile: IFacultyProfile = Users.getProfile(username);
  const userID = getUserIdFromRoute(match);
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });

  return {
    profile,
    favoriteInterests,
    favoriteCareerGoals,
  };
})(FacultyPageAboutMeWidget);
const FacultyPageAboutMeWidgetContainer = withRouter(FacultyPageAboutMeWidgetCon);

export default FacultyPageAboutMeWidgetContainer;
