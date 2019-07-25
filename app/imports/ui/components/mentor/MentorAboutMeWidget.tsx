import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { SubmitField, TextField, LongTextField, AutoForm } from 'uniforms-semantic/';
import Swal from 'sweetalert2';
import { Segment, Grid, Button, Label, Icon, Header, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { setCloudinaryUrl, setIsCloudinaryUsed } from '../../../redux/mentor/home/actions';

interface IMentorAboutMeWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  setIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setCloudinaryUrl: (cloudinaryUrl: string) => any;
}

interface IMentorAboutMeWidgetState {
  isEditingProfile: boolean;
  pictureURL: string;
}

const mapDispatchToProps = (dispatch) => ({
  setIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(setIsCloudinaryUsed(isCloudinaryUsed)),
  setCloudinaryUrl: (cloudinaryUrl: string) => dispatch(setCloudinaryUrl(cloudinaryUrl)),
});

class MentorAboutMeWidget extends React.Component<IMentorAboutMeWidgetProps, IMentorAboutMeWidgetState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isEditingProfile: false,
      pictureURL: MentorProfiles.findOne({ userID: this.getUserIdFromRoute() }).picture,
    };
  }

  private handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      this.props.setIsCloudinaryUsed(true);
      this.props.setCloudinaryUrl(cloudinaryResult.info.url);
      this.setState({ pictureURL: cloudinaryResult.info.url });
    }
  }

  private getUsername = (): string => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private buildRouteName = (explorerType: string, slug: string): string => {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
    return `${baseRoute}/explorer/${explorerType}/${slug}`;
  }

  private slugName = (item) => Slugs.findDoc(item.slugID).name

  private career = () => {
    if (this.getUsername) {
      const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
      return profile.career;
    }
    return 'No career specified.';
  }

  private careerGoals = () => {
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      return _.map(user.careerGoalIDs, (id) => CareerGoals.findDoc(id));
    }
    return [];
  }

  private company = () => {
    if (this.getUsername()) {
      const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
      return profile.company;
    }
    return 'No company specified.';
  }

  private desiredDegree = () => {
    let ret = '';
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      if (user.desiredDegreeID) {
        ret = DesiredDegrees.findDoc(user.desiredDegreeID).name;
      }
    }
    return ret;
  }

  private email = () => {
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      return user.username;
    }
    return '';
  }

  private firstCareerGoal = () => {
    let ret;
    const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    if (careerGoals.length > 0) {
      ret = Slugs.findDoc(careerGoals[0].slugID).name;
    }
    return ret;
  }

  private firstDegree = () => {
    let ret;
    const degrees = DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
    if (degrees.length > 0) {
      ret = Slugs.findDoc(degrees[0].slugID).name;
    }
    return ret;
  }

  private firstInterest = () => {
    let ret;
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  }

  private goalName = (goal) => goal.name

  private interestName = (interest) => interest.name

  private interests = () => {
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      return _.map(profile.interestIDs, (id) => Interests.findDoc(id));
    }
    return [];
  }

  private linkedin = () => {
    const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
    if (profile.linkedin) {
      return profile.linkedin;
    }
    return 'No linkedin profile specified';
  }

  private location = () => {
    const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
    if (profile.location) {
      return profile.location;
    }
    return 'No location specified.';
  }

  private motivation = () => {
    const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
    if (profile.motivation) {
      return profile.motivation;
    }
    return 'No motivation specified.';
  }

  private name = () => {
    const user = Users.getProfile(this.getUsername());
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'No name specified';
  }

  private picture = () => {
    const user = Users.getProfile(this.getUsername());
    if (user.picture) {
      return user.picture;
    }
    return 'No picture';
  }

  private website = () => {
    const user = Users.getProfile(this.getUsername());
    if (user.website) {
      return user.website;
    }
    return 'No website';
  }

  private handleEdit = (event) => {
    event.preventDefault();
    this.setState({ isEditingProfile: true });
  }

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ isEditingProfile: false });
  }

  private handlePictureUrlChange = (value) => {
    this.setState({ pictureURL: value });
  }

  private handleSubmit = (doc: { [key: string]: any }): void => {
    const collectionName = MentorProfiles.getCollectionName();
    const mentorProfile = MentorProfiles.findOne({ userID: this.getUserIdFromRoute() });
    const updateData = doc;
    updateData.id = mentorProfile._id;
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
          text: 'Your profile was successfully updated',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
    this.setState({ isEditingProfile: false });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const name = this.name();
    const email = this.email();
    const website = this.website();
    const company = this.company();
    const career = this.career();
    const location = this.location();
    const linkedin = this.linkedin();
    const picture = this.picture();
    const motivation = this.motivation();
    const careerGoals = this.careerGoals();
    const firstCareerGoal = this.firstCareerGoal();
    const firstInterest = this.firstInterest();
    const interests = this.interests();
    const isEditingProfile = this.state.isEditingProfile;

    const marginStyle = {
      marginBottom: 0,
    };

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
        label: <React.Fragment>Picture (<a onClick={this.handleUpload}>Upload</a>)</React.Fragment>,
        defaultValue: picture,
      },
    });
    const { pictureURL } = this.state;

    return (
      <Segment padded>
        <Header as='h3' dividing textAlign='left'>PROFILE</Header>
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <b>Name</b>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <p>{name}</p>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <b>Email</b>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <p>{email}</p>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <b>Interests</b>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid>
                <Grid.Row divided textAlign='left'>
                  <Label.Group>
                    {
                      interests ?
                        <React.Fragment>
                          {
                            _.map(interests, (interest, index) => (
                              <Label size={'tiny'} key={index} as={Link}
                                     to={this.buildRouteName('interests', this.slugName(interest))}>
                                <Icon name='star'/>{this.goalName(interest)}
                              </Label>
                            ))
                          }
                        </React.Fragment>
                        : <p style={marginStyle}>No interests added yet.</p>
                    }
                  </Label.Group>
                </Grid.Row>
                <Link to={this.buildRouteName('interests', firstInterest)}>Edit in Interests Explorer</Link>
              </Grid>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <b>Career Goals</b>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid>
                <Grid.Row divided textAlign='left'>
                  <Label.Group>
                    {
                      careerGoals ?
                        <React.Fragment>
                          {
                            _.map(careerGoals, (goal, index) => (
                              <Label size={'tiny'} key={index} as={Link}
                                     to={this.buildRouteName('career-goals', this.slugName(goal))}>
                                <Icon name='suitcase'/>{this.goalName(goal)}
                              </Label>
                            ))
                          }
                        </React.Fragment>
                        : <p style={marginStyle}>No career goals added yet.</p>
                    }
                  </Label.Group>
                </Grid.Row>
                <Link to={this.buildRouteName('career-goals', firstCareerGoal)}>Edit in Career Goal Explorer</Link>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {
          isEditingProfile ?
            <AutoForm name={'mentorProfile'} schema={updateSchema} onSubmit={this.handleSubmit} ref={this.formRef}>
              <Form.Group widths={'equal'}>
                <TextField name='website'/>
                <TextField name='company'/>
              </Form.Group>

              <Form.Group widths={'equal'}>
                <TextField name='career'/>
                <TextField name='location'/>
              </Form.Group>

              <Form.Group widths={'equal'}>
                <TextField name='linkedin'/>
                <TextField name="picture" value={pictureURL} onChange={this.handlePictureUrlChange}/>
              </Form.Group>

              <LongTextField name='motivation'/>

              <SubmitField value='Save Profile'/>
              <Button basic color={'green'} onClick={this.handleCancel}>Cancel</Button>
            </AutoForm>
            :
            <React.Fragment>
              <Grid stackable={true}>
                <Grid.Row>
                  <Grid.Column floated='left' width={2}>
                    <b>Website URL</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={6}>
                    {website}
                  </Grid.Column>
                  <Grid.Column floated='left' width={2}>
                    <b>Company</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={6}>
                    <p>{company}</p>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column floated='left' width={2}>
                    <b>Title</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={6}>
                    <p>{career}</p>
                  </Grid.Column>
                  <Grid.Column floated='left' width={2}>
                    <b>Location</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={6}>
                    <p>{location}</p>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column floated='left' width={2}>
                    <b>LinkedIn Username</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={6}>
                    <p>{linkedin}</p>
                  </Grid.Column>
                  <Grid.Column floated='left' width={2}>
                    <b>Picture URL</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={6}>
                    <p>{picture}</p>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column floated='left' width={2}>
                    <b>Motivation</b>
                  </Grid.Column>
                  <Grid.Column floated='left' width={14}>
                    <p>{motivation}</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <br/>
              <Button basic color={'green'} onClick={this.handleEdit}>Edit Profile</Button>
            </React.Fragment>
        }
      </Segment>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(MentorAboutMeWidget));
