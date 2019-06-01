/**
 * @qauchida
 * 05/20/19
 * Faculty Widget that shows About Me information
 */
import * as React from 'react';
import { withRouter, Link, NavLink } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Container, Grid, Header, Label, Icon, Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      id: string;
      username: string;
      url: string;
    }

  }
}

interface IFacultyProfileState {
  id: string;
  website: string;
  picture: string;
}


class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps, IFacultyProfileState> {
  // call the props constructor
  constructor(props: any) {
    super(props);
    this.state = { id: '', website: '', picture: '' };
  }

  /**
   * Function to record the changes in the form.
   * @param event
   * @param name Name of the value being changed
   * @param value Value of the attribute
   */
  private handleChange = (event, { name, value }) => {
    console.log('handle change');
    console.log(event, { name, value });
    console.log(FacultyProfiles.findDoc(this.props.match.params.username).userID);
    const changeIntermediate = {};
    changeIntermediate[name] = value;
    this.setState(changeIntermediate);
  };

  /**
   * Function to handle the submission.
   */
  private handleSubmitWebsite = () => {
    const updateData: any = this.state;
    updateData.id = (FacultyProfiles.findDoc(this.props.match.params.username)._id);
    const collectionName = FacultyProfiles.getCollectionName();
    /**
     * borrowed from AdminDataModelUsersPage.tsx
     */

    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  /**
   * Function to handle picture uploads.
   * This is a placeholder until we get cloudniary working.
   * @param event (may delete later)
   */
  private fileSelectedHandler = (event) => {
    console.log(event.target.files[0]);
  };

  /**
   * Puts together the slug for specific interest route.
   * @param label
   */
  private generateInterestRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(this.props.match.params.username);
    const facultyUserID = facultyDoc.userID;
    const facultyUserProfile = Users.getProfile(facultyUserID);
    const facultyUserUsername = facultyUserProfile.username;
    const interestRouteSlug = label.toString().toLowerCase().split(' ').join('-');
    // example url /faculty/binsted@hawaii.edu/explorer/interests/artificial-intelligence
    const explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername,
      'explorer', 'interests', interestRouteSlug];
    const exploreRoute = `/${explorePath.join('/')}`;
    return (exploreRoute);
  };

  /**
   * Puts together the slug for the specific career goals route.
   * @param label
   */
  private generateCareerGoalsRoute = (label) => {
    const facultyDoc = FacultyProfiles.findDoc(this.props.match.params.username);
    const facultyUserID = facultyDoc.userID;
    const facultyUserProfile = Users.getProfile(facultyUserID);
    const facultyUserUsername = facultyUserProfile.username;
    // example url /faculty/binsted@hawaii.edu/explorer/interests/mobile-app-developer
    const careerGoalRouteSlug = label.toString().toLowerCase().split(' ').join('-');
    const explorePath = [facultyUserProfile.role.toLowerCase(), facultyUserUsername,
      'explorer', 'career-goals', careerGoalRouteSlug];
    const exploreRoute = `/${explorePath.join('/')}`;
    return (exploreRoute);
  };

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
    // handles the submit for website changes
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
                      {_.map(facultyInterests, (interests, index) => <Label size='small' key={index} as={NavLink} exact={true} to={this.generateInterestRoute(interests)}>
                          <Icon name='star'>{interests}</Icon>
                        </Label>)}
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
                      {_.map(facultyCareerGoals, (careerGoals, index) => <Label size='small' key={index} as={NavLink} exact={true}
                               to={this.generateCareerGoalsRoute(careerGoals)}><Icon
                          name='suitcase'>{careerGoals}</Icon></Label>)}
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
                <Form onSubmit={this.handleSubmitWebsite} success>
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
