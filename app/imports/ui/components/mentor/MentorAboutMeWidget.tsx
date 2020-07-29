import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SubmitField, TextField, LongTextField, AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import Swal from 'sweetalert2';
import { Segment, Grid, Button, Label, Icon, Header, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { cloudinaryActions } from '../../../redux/shared/cloudinary';
import * as Router from '../shared/RouterHelperFunctions';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { RootState } from '../../../redux/types';
import { getUserIdFromRoute, getUsername } from '../shared/RouterHelperFunctions';
import { IFavoriteCareerGoal, IFavoriteInterest, IMentorProfile } from '../../../typings/radgrad';

interface IMentorAboutMeWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
  setIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setCloudinaryUrl: (cloudinaryUrl: string) => any;
  profile: IMentorProfile;
  favoriteInterests: IFavoriteInterest[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
}

const mapStateToProps = (state: RootState): object => ({
  isCloudinaryUsed: state.shared.cloudinary.mentorHome.isCloudinaryUsed,
  cloudinaryUrl: state.shared.cloudinary.mentorHome.cloudinaryUrl,
});

const mapDispatchToProps = (dispatch: any): object => ({
  setIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setMentorHomeIsCloudinaryUsed(isCloudinaryUsed)),
  setCloudinaryUrl: (cloudinaryUrl: string) => dispatch(cloudinaryActions.setMentorHomeCloudinaryUrl(cloudinaryUrl)),
});

const MentorAboutMeWidget = (props: IMentorAboutMeWidgetProps) => {
  const formRef = React.createRef();
  const userID = Router.getUserIdFromRoute(props.match);
  const [isEditingProfileState, setIsEditingProfile] = useState(false);
  const p = MentorProfiles.findOne({ userID }).picture;
  const [pictureURLState, setPictureURL] = useState(p);

  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        props.setIsCloudinaryUsed(true);
        props.setCloudinaryUrl(cloudinaryResult.info.url);
        setPictureURL(cloudinaryResult.info.url);
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

  const buildRouteName = (explorerType: string, slug: string): string => {
    const username = props.match.params.username;
    const baseUrl = props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
    return `${baseRoute}/explorer/${explorerType}/${slug}`;
  };

  const slugName = (item) => Slugs.findDoc(item.slugID).name;

  const career = () => {
    if (Router.getUsername(props.match)) {
      return props.profile.career;
    }
    return 'No career specified.';
  };

  const getCareerGoals = () => {
    if (Router.getUsername(props.match)) {
      return _.map(props.favoriteCareerGoals, (fav) => CareerGoals.findDoc(fav.careerGoalID));
    }
    return [];
  };

  const company = () => {
    if (Router.getUsername(props.match)) {
      return props.profile.company;
    }
    return 'No company specified.';
  };

  // const desiredDegree = () => {
  //   let ret = '';
  //   if (Router.getUsername(props.match)) {
  //     const user = Users.getProfile(Router.getUsername(props.match));
  //     if (user.desiredDegreeID) {
  //       ret = DesiredDegrees.findDoc(user.desiredDegreeID).name;
  //     }
  //   }
  //   return ret;
  // };

  const email = () => {
    if (Router.getUsername(props.match)) {
      const user = Users.getProfile(Router.getUsername(props.match));
      return user.username;
    }
    return '';
  };

  const firstCareerGoal = () => {
    let ret;
    const allCareerGoals = CareerGoals.findNonRetired({}, { sort: { name: 1 } });
    if (allCareerGoals.length > 0) {
      ret = Slugs.findDoc(allCareerGoals[0].slugID).name;
    }
    return ret;
  };

  // const firstDegree = () => {
  //   let ret;
  //   const degrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
  //   if (degrees.length > 0) {
  //     ret = Slugs.findDoc(degrees[0].slugID).name;
  //   }
  //   return ret;
  // };

  const firstInterest = () => {
    let ret;
    const interests = Interests.findNonRetired({}, { sort: { name: 1 } });
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  };

  const goalName = (goal) => goal.name;

  // const interestName = (interest) => interest.name;

  const getInterests = () => {
    if (Router.getUsername(props.match)) {
      return _.map(props.favoriteInterests, (fav) => Interests.findDoc(fav.interestID));
    }
    return [];
  };

  const linkedin = () => {
    if (props.profile.linkedin) {
      return props.profile.linkedin;
    }
    return 'No linkedin profile specified';
  };

  const location = () => {
    if (props.profile.location) {
      return props.profile.location;
    }
    return 'No location specified.';
  };

  const motivation = () => {
    if (props.profile.motivation) {
      return props.profile.motivation;
    }
    return 'No motivation specified.';
  };

  const name = () => {
    const user = Users.getProfile(Router.getUsername(props.match));
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'No name specified';
  };

  const picture = () => {
    const user = Users.getProfile(Router.getUsername(props.match));
    if (user.picture) {
      return user.picture;
    }
    return 'No picture';
  };

  const website = () => {
    const user = Users.getProfile(Router.getUsername(props.match));
    if (user.website) {
      return user.website;
    }
    return 'No website';
  };

  const handleEdit = (event) => {
    event.preventDefault();
    setIsEditingProfile(true);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setIsEditingProfile(false);
  };

  const handleSubmit = (doc: { [key: string]: any }): void => {
    const collectionName = MentorProfiles.getCollectionName();
    const mentorProfile = MentorProfiles.findOne({ userID });
    const updateData = doc;
    updateData.id = mentorProfile._id;
    const { isCloudinaryUsed, cloudinaryUrl } = props;
    if (isCloudinaryUsed) {
      updateData.picture = cloudinaryUrl;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          icon: 'error',
        });
        // @ts-ignore
        formRef.current.reset();
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          icon: 'success',
          text: 'Your profile was successfully updated',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
    setIsEditingProfile(false);
  };

  const marginStyle = {
    marginBottom: 0,
  };

  const model = MentorProfiles.findDoc({ userID });
  const updateSchema = new SimpleSchema({
    website: {
      type: String,
      optional: true,
      label: 'Website URL',
      defaultValue: website,
    },
    company: {
      type: String,
      optional: true,
      defaultValue: company,
    },
    career: {
      type: String,
      optional: true,
      label: 'Title',
      defaultValue: career,
    },
    location: {
      type: String,
      optional: true,
      defaultValue: location,
    },
    linkedin: {
      type: String,
      optional: true,
      label: 'LinkedIn Username',
      defaultValue: linkedin,
    },
    motivation: {
      type: String,
      optional: true,
      defaultValue: motivation,
    },
    picture: {
      type: String,
      optional: true,
      label:
  <React.Fragment>
    Picture (<button type="button" onClick={handleUpload}>Upload</button>)
  </React.Fragment>,
      defaultValue: picture(),
    },
  });
  const formSchema = new SimpleSchema2Bridge(updateSchema);
  const careerGoals = getCareerGoals();
  const interests = getInterests();
  return (
    <Segment padded>
      <Header as="h3" dividing textAlign="left">PROFILE</Header>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column floated="left" width={2}>
            <b>Name</b>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <p>{name()}</p>
          </Grid.Column>
          <Grid.Column floated="left" width={2}>
            <b>Email</b>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <p>{email()}</p>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column floated="left" width={2}>
            <b>Interests</b>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Grid>
              <Grid.Row divided textAlign="left">
                <Label.Group>
                  {
                    interests.length > 0 ? (
                      <React.Fragment>
                        {
                          _.map(interests, (interest, index) => (
                            <Label
                              size="tiny"
                              key={index}
                              as={Link}
                              to={buildRouteName('interests', slugName(interest))}
                            >
                              <Icon name="star" />
                              {goalName(interest)}
                            </Label>
                          ))
                        }
                      </React.Fragment>
                      )
                      : <p style={marginStyle}>No interests favorited yet.</p>
                  }
                </Label.Group>
              </Grid.Row>
              <Link to={buildRouteName('interests', firstInterest())}>Edit in Interests Explorer</Link>
            </Grid>
          </Grid.Column>
          <Grid.Column floated="left" width={2}>
            <b>Career Goals</b>
          </Grid.Column>
          <Grid.Column floated="left" width={6}>
            <Grid>
              <Grid.Row divided textAlign="left">
                <Label.Group>
                  {
                    careerGoals.length > 0 ? (
                      <React.Fragment>
                        {
                          _.map(careerGoals, (goal, index) => (
                            <Label
                              size="tiny"
                              key={index}
                              as={Link}
                              to={buildRouteName('career-goals', slugName(goal))}
                            >
                              <Icon name="suitcase" />
                              {goalName(goal)}
                            </Label>
                          ))
                        }
                      </React.Fragment>
                      )
                      : <p style={marginStyle}>No career goals favorited yet.</p>
                  }
                </Label.Group>
              </Grid.Row>
              <Link to={buildRouteName('career-goals', firstCareerGoal())}>Edit in Career Goal Explorer</Link>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {
        isEditingProfileState ? (
          <AutoForm model={model} schema={formSchema} onSubmit={handleSubmit} ref={formRef}>
            <Form.Group widths="equal">
              <TextField name="website" />
              <TextField name="company" />
            </Form.Group>
            <Form.Group widths="equal">
              <TextField name="career" />
              <TextField name="location" />
            </Form.Group>

            <Form.Group widths="equal">
              <TextField name="linkedin" />
              <TextField name="picture" value={pictureURLState} />
            </Form.Group>

            <LongTextField name="motivation" />

            <SubmitField value="Save Profile" className="" disabled={false} inputRef={undefined} />
            <Button basic color="green" onClick={handleCancel}>Cancel</Button>
          </AutoForm>
          )
          : (
            <React.Fragment>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column floated="left" width={2}>
                    <b>Website URL</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={6}>
                    {website()}
                  </Grid.Column>
                  <Grid.Column floated="left" width={2}>
                    <b>Company</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={6}>
                    <p>{company()}</p>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column floated="left" width={2}>
                    <b>Title</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={6}>
                    <p>{career()}</p>
                  </Grid.Column>
                  <Grid.Column floated="left" width={2}>
                    <b>Location</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={6}>
                    <p>{location()}</p>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column floated="left" width={2}>
                    <b>LinkedIn Username</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={6}>
                    <p>{linkedin()}</p>
                  </Grid.Column>
                  <Grid.Column floated="left" width={2}>
                    <b>Picture URL</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={6}>
                    <p>{picture()}</p>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column floated="left" width={2}>
                    <b>Motivation</b>
                  </Grid.Column>
                  <Grid.Column floated="left" width={14}>
                    <p>{motivation()}</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <br />
              <Button basic color="green" onClick={handleEdit}>Edit Profile</Button>
            </React.Fragment>
          )
      }
    </Segment>
  );
};

const MentorAboutMeWidgetCon = connect(mapStateToProps, mapDispatchToProps)(MentorAboutMeWidget);
const MentorAboutMeWidgetCont = withTracker(({ match }) => {
  const username = getUsername(match);
  const profile: IMentorProfile = Users.getProfile(username);
  const userID = getUserIdFromRoute(match);
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID });
  const favoriteCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID });

  return {
    profile,
    favoriteInterests,
    favoriteCareerGoals,
  };
})(MentorAboutMeWidgetCon);
const MentorAboutMeWidgetContainer = withRouter(MentorAboutMeWidgetCont);

export default MentorAboutMeWidgetContainer;
