import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Header, Button, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import Swal from 'sweetalert2';
import { IProfile } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';


interface IExplorerInterestsWidgetProps {
  type: string;
  match: {
    isExact: boolean,
    path: string,
    url: string,
    params: {
      username: string;
      interest: string;
    }
  }
  profile: object;
}


class ExplorerInterestsWidget extends React.Component <IExplorerInterestsWidgetProps, IProfile> {
  constructor(props: any) {
    super(props);
  }

  /**
   * returns the doc of interest based on url
   * @constructor
   */
  private getInterestDoc = () => {
    const splitUrl = this.props.match.url.split('/');
    const splitSlug = splitUrl[splitUrl.length - 1];
    return (Interests.findDocBySlug(splitSlug));
  };

  private getRoleByUrl = (): string => this.props.match.url.split('/')[1];


  /**
   * return how many users participate in interest based on role
   *  match the interest w/ the interest in a user profile
   */

  private participation = (role) => {
    const interested = [];
    switch (role) {
      case 'student':
        const students = StudentProfiles.findNonRetired();
        _.map(students, (num) => {
          _.filter(num.interestIDs, (interests) => {
            if (interests === this.getInterestDoc()._id) {
              interested.push(num);
            }
          });
        });
        return interested;
      case 'faculty':
        const faculty = FacultyProfiles.findNonRetired();
        _.map(faculty, (num) => {
          _.filter(num.interestIDs, (interests) => {
            if (interests === this.getInterestDoc()._id) {
              interested.push(num);
            }
          });
        });
        return interested;
      case 'mentor':
        const mentor = MentorProfiles.findNonRetired();
        _.map(mentor, (num) => {
          _.filter(num.interestIDs, (interests) => {
            if (interests == this.getInterestDoc()._id) {
              interested.push(num);
            }
          })
        });
        return interested;
      case 'alumni':
        const alumni = StudentProfiles.findNonRetired({ isAlumni: true });
        _.map(alumni, (num) => {
          _.filter(num.interestIDs, (interests) => {
            if (interests === this.getInterestDoc()._id) {
              interested.push(num);
            }
          });
        });
        return interested;
      default:
        return interested;
    }
  };


  private GetRelatedCourses = () => {
    const courses = [];
    const courseInstances = Courses.find().fetch();

    _.map(courseInstances, (num) => {
      _.filter(num.interestIDs, (interests) => {
        if (interests === this.getInterestDoc()._id) {
          courses.push(num);
        }
      });
    });
    return courses;
  };


  /**
   *
   * @param courses
   * @constructor
   */
  private GetAssociationRelatedCourses = (courses, role) => {
    const inPlanIDs = [];
    const completedIDs = [];
    if (role !== 'student') {

      let relatedCourses = {
        completed: ['none'],
        inPlan: ['none'],
        notInPlan: ['none'],
      };

      return relatedCourses;
    }
      const inPlanInstance = CourseInstances.findNonRetired({
        studentID:
        StudentProfiles.findDoc(this.props.match.params.username).userID, verified: false,
      });
      _.map(inPlanInstance, (value) => {
        inPlanIDs.push(value.courseID);
      });

      const completedInstance = CourseInstances.findNonRetired({
        studentID:
        StudentProfiles.findDoc(this.props.match.params.username).userID, verified: true,
      });
      _.map(completedInstance, (value) => {
        completedIDs.push(value.courseID);
      });

      const relatedIDs = [];
      _.map(courses, (value) => {
        relatedIDs.push(value._id);
      });
      const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
      const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
      const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

      let relatedCourses = {
        completed: relatedCompletedIDs,
        inPlan: relatedInPlanIDs,
        notInPlan: relatedNotInPlanIDs
      };
      return relatedCourses;

  };

  private GetRelatedOpportunities = () => {
    let opportunities = [];
    const opportunityInstances = Opportunities.find().fetch();
    for (let a = 0; a < opportunityInstances.length; a++) {
      for (let i = 0; i < opportunityInstances[a].interestIDs.length; i++) {
        if (opportunityInstances[a].interestIDs[i] === this.getInterestDoc()._id) {
          opportunities.push(opportunityInstances[a]);
        }
      }
    }
    return opportunities;
  };

  private GetAssociationRelatedOpportunities = (opportunities, role) => {
    let inPlanIDs = [];
    let completedIDs = [];

    if (role != 'student') {
      let relatedOpportunities = {
        completed: ['none'],
        inPlan: ['none'],
        notInPlan: ['none']
      };
      return relatedOpportunities;
    } else {
      const inPlanInstance = OpportunityInstances.findNonRetired({
        'studentID':
        StudentProfiles.findDoc(this.props.match.params.username).userID, 'verified': false,
      });
      _.map(inPlanInstance, (value) => {
        inPlanIDs.push(value.opportunityID);
      });

      const completedInstance = OpportunityInstances.findNonRetired({
        'studentID':
        StudentProfiles.findDoc(this.props.match.params.username).userID, 'verified': true
      });
      _.map(completedInstance, (value) => {
        completedIDs.push(value.opportunityID);
      });
      let relatedIDs = [];
      //shows all ids for related courses
      _.map(opportunities, (value) => {
        relatedIDs.push(value._id)
      });

      const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
      const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
      const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

      let relatedOpportunities = {
        completed: relatedCompletedIDs,
        inPlan: relatedInPlanIDs,
        notInPlan: relatedNotInPlanIDs
      };
      return relatedOpportunities;
    }
  };


  private GenerateCourseRoute = (document) => {
    const variableSlug = Courses.findSlugByID(document._id);
    let username = this.props.match.params.username;
    let role = this.props.match.url.split('/')[1];
    let partialSlug = [];
    partialSlug.push(role);
    partialSlug.push(username);
    partialSlug.push('explorer');
    partialSlug.push('courses');
    partialSlug.push(variableSlug);
    const fullSlug = `/${partialSlug.toString().split(',').join('/')}`;
    return fullSlug;
  };

  private GenerateOpportunityRoute = (document) => {
    const variableSlug = Opportunities.findSlugByID(document._id);
    let username = this.props.match.params.username;
    let role = this.props.match.url.split('/')[1];
    let partialSlug = [];
    partialSlug.push(role);
    partialSlug.push(username);
    partialSlug.push('explorer');
    partialSlug.push('opportunities');
    partialSlug.push(variableSlug);
    const fullSlug = `/${partialSlug.toString().split(',').join('/')}`;
    return fullSlug;
  };

  /**
   * ToDo ask Gian about this or Moore when he gets back
   */
  private handleClick = () => {

    switch (this.checkInterestStatus()) {
      case 'remove from interests':
        const newInterestsAfterRemove = this.removeInterest();
        const updateDataRemove: any = {
          id: Users.getProfile(this.props.match.params.username)._id,
          interests: newInterestsAfterRemove
        };
        const collectionNameRemove = this.getCollectionName();

        updateMethod.call({ collectionName: collectionNameRemove, updateData: updateDataRemove }, (error) => {
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
        break;
      case 'add to interests':
        const newInterestsAfterAdd = this.addInterest();
        const updateDataAdd: any = {
          id: Users.getProfile(this.props.match.params.username)._id,
          interests: newInterestsAfterAdd
        };
        const collectionNameAdd = this.getCollectionName();

        updateMethod.call({ collectionName: collectionNameAdd, updateData: updateDataAdd }, (error) => {
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
        break;
    }
  };


  private addInterest = () => {

    const user = Users.getProfile(this.props.match.params.username);
    const interestIDsOfUser = user.interestIDs;
    const interestID = this.getInterestDoc()._id;
    const currentInterestID = [interestID];
    let dataValue;
    let updateValue;
    dataValue = [interestIDsOfUser, currentInterestID];
    updateValue = _.flatten(dataValue);
    return updateValue;

  };


  private removeInterest = () => {
    const interestID = this.getInterestDoc()._id;
    let updateValue;
    switch (this.getRoleByUrl()) {
      case 'student':
        //specify the type of the profile
        const studentProfile: IProfile = StudentProfiles.findDoc(this.props.match.params.username);
        let interestIDsOfUser: string[] = studentProfile.interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
      case 'faculty':
        interestIDsOfUser = FacultyProfiles.findDoc(this.props.match.params.username).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
      case 'alumni':
        interestIDsOfUser = StudentProfiles.findDoc({
          username: this.props.match.params.username,
          isAlumni: true
        }).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
      case 'mentor':
        interestIDsOfUser = MentorProfiles.findDoc(this.props.match.params.username).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
    }
  };

  private getCollectionName = () => {
    switch (this.getRoleByUrl()) {
      case 'student':
        return StudentProfiles.getCollectionName();
      case 'faculty':
        return FacultyProfiles.getCollectionName();
      case 'alumni':
        return StudentProfiles.getCollectionName();
      case 'mentor':
        return MentorProfiles.getCollectionName();
    }
  };

  private checkInterestStatus = () => {
    //check if this interest is in student's interest's
    //get the interest ID
    let interestIDsofUser: string[];
    const currentInterest = this.getInterestDoc()._id;
    switch (this.getRoleByUrl()) {
      case 'student':
        const studentProfile: IProfile = StudentProfiles.findDoc(this.props.match.params.username);
        interestIDsofUser = studentProfile.interestIDs;
        let currentInterestIDStudent = [currentInterest];
        let iDsinCommonStudent = _.intersection(currentInterestIDStudent, interestIDsofUser);
        if (iDsinCommonStudent.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
      case 'faculty':
        const facultyProfile: IProfile = FacultyProfiles.findDoc(this.props.match.params.username);
        interestIDsofUser = facultyProfile.interestIDs;
        let currentInterestIDFaculty = [currentInterest];
        let iDsinCommonFaculty = _.intersection(currentInterestIDFaculty, interestIDsofUser);
        if (iDsinCommonFaculty.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
      case 'alumni':
        const alumniProfile: IProfile = StudentProfiles.findDoc({
          username: this.props.match.params.username,
          'isAlumni': true
        });
        interestIDsofUser = alumniProfile.interestIDs;
        let currentInterestIDAlumni = [currentInterest];
        let iDsinCommonAlumni = _.intersection(currentInterestIDAlumni, interestIDsofUser);
        if (iDsinCommonAlumni.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
      case 'mentor':
        const mentorProfile: IProfile = MentorProfiles.findDoc(this.props.match.params.username);
        interestIDsofUser = mentorProfile.interestIDs;
        let currentInterestIDMentor = [currentInterest];
        let iDsinCommonMentor = _.intersection(currentInterestIDMentor, interestIDsofUser);
        if (iDsinCommonMentor.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
    }
  };

  public render() {
    const interestDoc = this.getInterestDoc();
    const interestName = interestDoc.name;
    const interestDescription = interestDoc.description;
    const relatedCourses = this.GetAssociationRelatedCourses(this.GetRelatedCourses(), this.props.match.url.split('/')[1]);
    const relatedOpportunities = this.GetAssociationRelatedOpportunities(this.GetRelatedOpportunities(), this.props.match.url.split('/')[1]);
    const interestedStudents = this.participation('student');
    const interestedFaculty = this.participation('faculty');
    const interestedAlumni = this.participation('alumni');
    const interestedMentor = this.participation('mentor');

    /**
     * ToDo polish this UI
     * ToDo add functionality for button
     */
    return (
      <Container>
        <Grid padded stackable>
          <Grid.Row>
            <Grid.Column>
              <Container textAlign='left'>
                <Segment>
                  <Header>{interestName}<Button
                    attatched='top'
                    floated='right'
                    size='mini'
                    content={this.checkInterestStatus()}
                    onClick={this.handleClick}/></Header>
                  <Divider/>
                  <div>
                    <b>Description: </b>
                  </div>
                  <div>
                    <Markdown escapeHtml={true} source={interestDescription}/>
                  </div>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid divided='vertically' stackable>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Container fluid>
                    <Grid padded='horizontally' columns={1} stackable>
                      <Grid.Row>
                        <Grid.Column>
                          <Container>
                            <Segment>
                              <Header>Related Courses</Header>
                              <Divider/>
                              <Grid columns='equal'>
                                <Grid.Row columns={3} divided>
                                  <Grid.Column>
                                    <Container textAlign='center'>
                                      <div>
                                        <Header as='h4'><i className='green checkmark icon'></i>Completed</Header>
                                        {
                                          _.map(relatedCourses.completed, (value, index) =>
                                            <Container key={index} textAlign='center'>
                                              <Link
                                                to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
                                            </Container>)
                                        }</div>
                                    </Container>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Container textAlign='center'>
                                      <div>
                                        <Header as='h4'><i className='yellow warning sign icon'></i>In Plan</Header>
                                        {
                                          _.map(relatedCourses.inPlan, (value, index) =>
                                            <Container key={index} textAlign='center'>
                                              <Link
                                                to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
                                            </Container>)
                                        }</div>
                                    </Container>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Container textAlign='center'>
                                      <div>
                                        <Header as='h4'><i className='red warning circle icon'></i>Not In Plan</Header>
                                        {
                                          _.map(relatedCourses.notInPlan, (value, index) =>
                                            <Container key={index} textAlign='center'>
                                              <Link
                                                to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
                                            </Container>)
                                        }</div>
                                    </Container>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Segment>
                          </Container>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <Container fluid>
                            <Segment>
                              <Header>Related Opportunities</Header>
                              <Divider/>
                              <Grid padded columns='equal'>
                                <Grid.Row columns={3} divided>
                                  <Grid.Column>
                                    <Container textAlign='center'>
                                      <div>
                                        <Header as='h4'><i className='green checkmark icon'></i>Completed</Header>
                                        {
                                          _.map(relatedOpportunities.completed, (value, index) =>
                                            <Container key={index} textAlign='center'>
                                              <Link
                                                to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
                                            </Container>)
                                        }</div>
                                    </Container>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Container textAlign='center'>
                                      <div>
                                        <Header as='h4'><i className='yellow warning sign icon'></i>In Plan</Header>
                                        {
                                          _.map(relatedOpportunities.inPlan, (value, index) =>
                                            <Container key={index} textAlign='center'>
                                              <Link
                                                to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
                                            </Container>)
                                        }</div>
                                    </Container>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Container textAlign='center'>
                                      <div>
                                        <Header as='h4'><i className='red warning circle icon'></i>Not In Plan</Header>
                                        {
                                          _.map(relatedOpportunities.notInPlan, (value, index) =>
                                            <Container key={index} textAlign='center'>
                                              <Link
                                                to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
                                            </Container>)
                                        }</div>
                                    </Container>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Segment>
                          </Container>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Container>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Grid>
                    <Grid.Row centered>
                      <Grid.Column>
                        <Container fluid>
                          <Segment>
                            <Header textAlign='center'>Students &middot;  <b>{this.participation('student').length}</b></Header>
                            <Divider/>
                            <Container textAlign='center'>
                              <Image.Group size='mini'>
                                {interestedStudents.map((student, index) =>
                                  <Popup
                                    key={index}
                                    trigger={<Image src={student.picture} circular size='mini'></Image>}
                                    content='names'
                                  />)
                                }
                              </Image.Group>
                            </Container>
                          </Segment>
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Container fluid>
                          <Segment>
                            <Header textAlign='center'>Faculty Members &middot;
                              <b>{this.participation('faculty').length}</b>
                            </Header>
                            <Divider/>

                            <Container textAlign='center'>
                              <Image.Group size='mini'>
                                {interestedFaculty.map((faculty, index) => <Popup
                                  key={index}
                                  trigger={<Image src={faculty.picture} circular></Image>}
                                  content={faculty.name}
                                />)
                                }
                              </Image.Group>
                            </Container>
                          </Segment>
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Container>
                          <Segment>
                            <Header textAlign='center'>Alumni &middot; <b>{this.participation('alumni').length}</b>
                            </Header>
                            <Divider/>
                            <Container textAlign='center'>
                              <Image.Group size='mini'>
                                {interestedAlumni.map((alumni, index) => <Popup
                                  key={index}
                                  trigger={<Image src={alumni.picture} circular></Image>}
                                  content='names'
                                />)
                                }
                              </Image.Group>
                            </Container>
                          </Segment>
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Container>
                          <Segment>
                            <Header textAlign='center'>Mentors &middot;  <b>{this.participation('mentor').length}</b>
                            </Header>
                            <Divider/>
                            <Container textAlign='center'>
                              <Image.Group size='mini'>
                                {interestedMentor.map((mentors, index) => <Popup
                                  key={index}
                                  trigger={<Image src={mentors.picture} circular></Image>}
                                  content='names'
                                />)
                                }
                              </Image.Group>
                            </Container>
                          </Segment>
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
              </Grid.Row>
              <Grid.Row>

              </Grid.Row>

            </Grid>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const ExplorerInterestsWidgetCon = withTracker(({ match }) => {
  const username = match.params.username;
  const profile = Users.getProfile(username);

  return {
    profile,
  };
})(ExplorerInterestsWidget);

const ExplorerInterestsWidgetContainer = withRouter(ExplorerInterestsWidgetCon);

export default ExplorerInterestsWidgetContainer;
