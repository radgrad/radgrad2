import React, { useState } from 'react';
import _ from 'lodash';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Grid, Header, Label, Icon, Form, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { Users } from '../../../../api/user/UserCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { openCloudinaryWidget } from '../../shared/OpenCloudinaryWidget';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { AdvisorOrFacultyProfile, FavoriteCareerGoal, FavoriteInterest } from '../../../../typings/radgrad';
import { AdvisorProfiles } from '../../../../api/user/AdvisorProfileCollection';

interface FacultyPageAboutMeWidgetProps {
  profile: AdvisorOrFacultyProfile;
  favoriteInterests: FavoriteInterest[];
  favoriteCareerGoals: FavoriteCareerGoal[];
}

/** The Faculty About Me Widget shows basic information of the specified user. */
const FacultyAboutMeWidget: React.FC<FacultyPageAboutMeWidgetProps> = ({ profile, favoriteCareerGoals, favoriteInterests }) => {
  const [websiteState, setWebsite] = useState(profile.website);
  const [pictureState, setPicture] = useState(profile.picture);
  const [aboutMeState, setAboutMe] = useState(profile.aboutMe);
  const { username } = useParams();

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
      case 'aboutMe':
        setAboutMe(value);
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
    const collectionName = AdvisorProfiles.getCollectionName();
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

  const handleSubmitAboutMe = (event): void => {
    event.preventDefault();
    const collectionName = AdvisorProfiles.getCollectionName();
    const updateData: { id: string; aboutMe: string } = { id: profile._id, aboutMe: aboutMeState };
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
          text: 'Your about me has been successfully updated.',
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
    label = label.toString().toLowerCase().split(' ').join('-'); // eslint-disable-line no-param-reassign
    // example url /advisor/binsted@hawaii.edu/explorer/interests/artificial-intelligence
    const explorePath = [profile.role.toLowerCase(), username,
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
    label = label.toString().toLowerCase().split(' ').join('-'); // eslint-disable-line no-param-reassign
    // example url /faculty/binsted@hawaii.edu/explorer/interests/mobile-app-developer
    const explorePath = [profile.role.toLowerCase(), username,
      'explorer', 'career-goals', label];
    let exploreRoute = explorePath.join('/');
    exploreRoute = `/${exploreRoute}`;
    return (exploreRoute);
  };

  const handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    const collectionName = AdvisorProfiles.getCollectionName();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
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

  // get the career goal IDs based on the userID
  const advisorCareerGoalsIDs = _.map(favoriteCareerGoals, (fav) => fav.careerGoalID);
  // map the career goal IDs to their names
  const advisorCareerGoals = _.map(advisorCareerGoalsIDs, (id) => CareerGoals.findDoc(id).name);
  // get the interest goal IDs based on the User ID
  const advisorInterestIDs = _.map(favoriteInterests, (fav) => fav.interestID);
  // map the interests IDs to their names
  const advisorInterests = _.map(advisorInterestIDs, (id) => Interests.findDoc(id).name);
  // M: should make it so that you reference the doc and then the name rather than the doc directly
  // gets the url from the faculty profile's information
  // url is made up of: role/username/explorer/CareerOrInterests
  const explorePath = [profile.role.toLowerCase(), username, 'explorer', 'interests'];
  let exploreRoute = explorePath.join('/');
  exploreRoute = `/${exploreRoute}`;
  // url for career path explorer
  const careerPath = [profile.role.toLowerCase(), username, 'explorer', 'career-goals'];
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
            <Header as="h5" textAlign="left">{Users.getFullName(profile.userID)}</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={2}>
            <Header as="h5" textAlign="left">Email</Header>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Header as="h5" textAlign="left">{username}</Header>
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
                    advisorInterests.length > 0 ? (
                      _.map(advisorInterests, (interests, index) => (
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
                    advisorCareerGoals.length > 0 ? (
                      _.map(advisorCareerGoals, (careerGoals, index) => (
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
        <Grid.Column floated="left" width={2}>
          <Header as="h5" textAlign="left">About Me</Header>
        </Grid.Column>
        <Grid.Column floated="left" width={14}>
          <Form onSubmit={handleSubmitAboutMe}>
            <Form.Group>
              <Form.TextArea
                name="aboutMe"
                onChange={handleChange}
                value={aboutMeState}
              />
              <Form.Button basic color="green">Update</Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
        <Grid.Row />
      </Grid>
    </Segment>
  );
};

export default FacultyAboutMeWidget;
