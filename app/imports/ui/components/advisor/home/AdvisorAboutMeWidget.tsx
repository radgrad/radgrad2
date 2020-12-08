import React, { useState } from 'react';
import _ from 'lodash';
import { Form, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { IAdvisorOrFacultyProfile, IFavoriteCareerGoal, IFavoriteInterest } from '../../../../typings/radgrad';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';

interface IAdvisorAboutMeWidgetProps {
  profile: IAdvisorOrFacultyProfile;
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
}

const AdvisorAboutMeWidget: React.FC<IAdvisorAboutMeWidgetProps> = ({ profile, favoriteCareerGoals, favoriteInterests,
}) => {
  const [websiteState, setWebsite] = useState(profile.website);
  const [pictureState, setPicture] = useState(profile.picture);
  const [aboutMeState, setAboutMe] = useState(profile.aboutMe);
  const username = profile.username;

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

  const careerGoalNames = _.map(favoriteCareerGoals, (fav) => CareerGoals.findDoc(fav.careerGoalID).name);
  const interestNames = _.map(favoriteInterests, (fav) => Interests.findDoc(fav.interestID).name);

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
                    interestNames.length > 0 ? (
                        _.map(interestNames, (interests, index) => (
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
                    careerGoalNames.length > 0 ? (
                        _.map(careerGoalNames, (careerGoal, index) => (
                          <Label
                            size="small"
                            key={index}
                            as={NavLink}
                            exact
                            to={generateCareerGoalsRoute(careerGoal)}
                          >
                            <Icon name="suitcase" /> {careerGoal}
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

}

export default AdvisorAboutMeWidget;
