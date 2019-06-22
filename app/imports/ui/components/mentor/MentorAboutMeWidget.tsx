import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { SubmitField, TextField, LongTextField, AutoForm } from 'uniforms-semantic/';
import Swal from 'sweetalert2';
import { Container, Segment, Grid, Button, Label, Icon, Header, Form } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

interface IMentorAboutMeWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

interface IMentorAboutMeWidgetState {
  isEditingProfile: boolean;
}

class MentorAboutMeWidget extends React.Component<IMentorAboutMeWidgetProps, IMentorAboutMeWidgetState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isEditingProfile: false,
    };
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
    if (this.getUsername()) {
      const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
      return profile.linkedin;
    }
    return 'No linkedin profile specified';
  }

  private location = () => {
    if (this.getUsername()) {
      const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
      return profile.location;
    }
    return 'No location specified.';
  }

  private motivation = () => {
    if (this.getUsername()) {
      const profile = MentorProfiles.findDoc({ userID: this.getUserIdFromRoute() });
      return profile.motivation;
    }
    return 'No motivation specified.';
  }

  private name = () => {
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  }

  private picture = () => {
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      return user.picture;
    }
    return 'No picture';
  }

  private studentPicture = () => {
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      return user.picture;
    }
    return 'No picture';
  }

  private website = () => {
    if (this.getUsername()) {
      const user = Users.getProfile(this.getUsername());
      return user.website;
    }
    return 'No website specified';
  }

  private handleEdit = (event) => {
    event.preventDefault();
    this.setState({ isEditingProfile: true });
  }

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ isEditingProfile: false });
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
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginStyle = {
      marginBottom: 0,
    };

    const updateSchema = new SimpleSchema({
      website: {
        type: String,
        optional: true,
        label: 'Website URL',
      },
      company: {
        type: String,
        optional: true,
      },
      career: {
        type: String,
        optional: true,
        label: 'Title',
      },
      location: {
        type: String,
        optional: true,
      },
      linkedin: {
        type: String,
        optional: true,
        label: 'LinkedIn Username'
      },
      motivation: {
        type: String,
        optional: true,
      },
      picture: {
        type: String,
        optional: true,
        label: 'Picture URL',
      },
    });

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

    return (
      <Container>
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
                                       to={this.buildRouteName('interest', this.slugName(interest))}>
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
                  <TextField name='picture'/>
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
                      {
                        website ?
                          <p>{website}</p>
                          : 'No website specified.'
                      }
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
      </Container>
    );
  }
}

export default withRouter(MentorAboutMeWidget);
