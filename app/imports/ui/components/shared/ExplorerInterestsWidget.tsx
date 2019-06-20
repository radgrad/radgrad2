import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Header, Button, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import Swal from 'sweetalert2';
import { IInterest, IProfile, IProfileUpdate } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { Interests } from '../../../api/interest/InterestCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
// import { Courses } from '../../../api/course/CourseCollection';
// import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
// import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
// import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';


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
  profile: IProfile;
  interest: IInterest;
}


class ExplorerInterestsWidget extends React.Component <IExplorerInterestsWidgetProps> {
  constructor(props: any) {
    super(props);
    console.log('Explorer props %o', props);
  }

  private getObjectsThatHaveInsterest = (profiles) => {
    const interested = [];
    _.map(profiles, (num) => {
      _.filter(num.interestIDs, (interests) => {
        if (interests === this.props.interest._id) {
          interested.push(num);
        }
      });
    });
    return interested;
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
        return this.getObjectsThatHaveInsterest(StudentProfiles.findNonRetired({ isAlumni: false }));
      case 'faculty':
        return this.getObjectsThatHaveInsterest(FacultyProfiles.findNonRetired());
      case 'mentor':
        return this.getObjectsThatHaveInsterest(MentorProfiles.findNonRetired());
      case 'alumni':
        return this.getObjectsThatHaveInsterest(StudentProfiles.findNonRetired({ isAlumni: true }));
      default:
        return interested;
    }
  };


  private GetRelatedCourses = () => this.getObjectsThatHaveInsterest(Courses.findNonRetired());


  /**
   *
   * @param courses
   * @constructor
   */
  private GetAssociationRelatedCourses = (courses) => {
    const inPlanInstance = CourseInstances.findNonRetired({
      studentID: this.props.profile.userID, verified: false,
    });
    const inPlanIDs = _.map(inPlanInstance, (value) => value.courseID);

    const completedInstance = CourseInstances.findNonRetired({
      studentID: this.props.profile.userID, verified: true,
    });
    const completedIDs = _.map(completedInstance, (value) => value.courseID);

    const relatedIDs = _.map(courses, (value) => value._id);
    const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
    const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
    const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

    const relatedCourses = {
      completed: relatedCompletedIDs,
      inPlan: relatedInPlanIDs,
      notInPlan: relatedNotInPlanIDs,
    };
    return relatedCourses;
  };

  private GetRelatedOpportunities = () => this.getObjectsThatHaveInsterest(Opportunities.findNonRetired());

  private GetAssociationRelatedOpportunities = (opportunities) => {
    const inPlanInstance = OpportunityInstances.findNonRetired({
      studentID: this.props.profile.userID, verified: false,
    });
    const inPlanIDs = _.map(inPlanInstance, (value) => value.courseID);

    const completedInstance = OpportunityInstances.findNonRetired({
      studentID: this.props.profile.userID, verified: true,
    });
    const completedIDs = _.map(completedInstance, (value) => value.courseID);

    const relatedIDs = _.map(opportunities, (value) => value._id);
    const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
    const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
    const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

    const relatedOpportunites = {
      completed: relatedCompletedIDs,
      inPlan: relatedInPlanIDs,
      notInPlan: relatedNotInPlanIDs,
    };
    return relatedOpportunites;
  };


  private GenerateCourseRoute = (document) => {
    // const variableSlug = Courses.findSlugByID(document._id);
    const variableSlug = Slugs.getNameFromID(document.slugID);
    const username = this.props.match.params.username;
    const role = this.getRoleByUrl();
    const partialSlug = [];
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
    const username = this.props.match.params.username;
    const role = this.props.match.url.split('/')[1];
    const partialSlug = [];
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
    // how do we know to add the interest or remove it.
    // get the user's interestIDs
    // if this.props.interest._id is in the interestIDs remove it.
    let interests = [];
    if (_.includes(this.props.profile.interestIDs, this.props.interest._id)) {
      // remove it.
      interests = _.difference(this.props.profile.interestIDs, [this.props.interest._id]);
    } else {
      // add it.
      interests = _.concat(this.props.profile.interestIDs, [this.props.interest._id]);
    }
    const role = this.getRoleByUrl();
    let collectionName;
    switch (role) {
      case 'faculty':
        collectionName = FacultyProfiles.getCollectionName();
        break;
      case 'mentor':
        collectionName = MentorProfiles.getCollectionName();
        break;
      case 'student':
        collectionName = StudentProfiles.getCollectionName();
        break;
      default:
        collectionName = StudentProfiles.getCollectionName();
    }
    const updateData: IProfileUpdate = {};
    updateData.id = this.props.profile._id;
    updateData.interests = interests;
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


  private checkInterestStatus = (): string => {
    if (_.includes(this.props.profile.interestIDs, this.props.interest._id)) {
      return 'remove from interests';
    }
    return 'add to interests';
  }

  public render() {
//     const interestDoc = this.getInterestDoc();
//     const interestName = interestDoc.name;
//     const interestDescription = interestDoc.description;
    const relatedCourses = this.GetAssociationRelatedCourses(this.GetRelatedCourses());
    const relatedOpportunities = this.GetAssociationRelatedOpportunities(this.GetRelatedOpportunities());
    const interestedStudents = this.participation('student');
    const interestedFaculty = this.participation('faculty');
    const interestedAlumni = this.participation('alumni');
    const interestedMentor = this.participation('mentor');

    console.log(relatedCourses, relatedOpportunities, interestedAlumni, interestedFaculty, interestedStudents, interestedMentor);
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
                   <Header>{this.props.interest.name}<Button
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
                     <Markdown escapeHtml={true} source={this.props.interest.description}/>
                   </div>
                 </Segment>
               </Container>
             </Grid.Column>
           </Grid.Row>
         </Grid>
      </Container>
//           <Grid.Row>
//             <Grid divided='vertically' stackable>
//               <Grid.Row>
//                 <Grid.Column width={8}>
//                   <Container fluid>
//                     <Grid padded='horizontally' columns={1} stackable>
//                       <Grid.Row>
//                         <Grid.Column>
//                           <Container>
//                             <Segment>
//                               <Header>Related Courses</Header>
//                               <Divider/>
//                               <Grid columns='equal'>
//                                 <Grid.Row columns={3} divided>
//                                   <Grid.Column>
//                                     <Container textAlign='center'>
//                                       <div>
//                                         <Header as='h4'><i className='green checkmark icon'/>Completed</Header>
//                                         {
//                                           _.map(relatedCourses.completed, (value, index) => <Container key={index}
//                                                                                                        textAlign='center'>
//                                             <Link
//                                               to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
//                                           </Container>)
//                                         }</div>
//                                     </Container>
//                                   </Grid.Column>
//                                   <Grid.Column>
//                                     <Container textAlign='center'>
//                                       <div>
//                                         <Header as='h4'><i className='yellow warning sign icon'/>In Plan</Header>
//                                         {
//                                           _.map(relatedCourses.inPlan, (value, index) => <Container key={index}
//                                                                                                     textAlign='center'>
//                                             <Link
//                                               to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
//                                           </Container>)
//                                         }</div>
//                                     </Container>
//                                   </Grid.Column>
//                                   <Grid.Column>
//                                     <Container textAlign='center'>
//                                       <div>
//                                         <Header as='h4'><i className='red warning circle icon'></i>Not In Plan</Header>
//                                         {
//                                           _.map(relatedCourses.notInPlan, (value, index) => <Container key={index}
//                                                                                                        textAlign='center'>
//                                             <Link
//                                               to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
//                                           </Container>)
//                                         }</div>
//                                     </Container>
//                                   </Grid.Column>
//                                 </Grid.Row>
//                               </Grid>
//                             </Segment>
//                           </Container>
//                         </Grid.Column>
//                       </Grid.Row>
//                       <Grid.Row>
//                         <Grid.Column>
//                           <Container fluid>
//                             <Segment>
//                               <Header>Related Opportunities</Header>
//                               <Divider/>
//                               <Grid padded columns='equal'>
//                                 <Grid.Row columns={3} divided>
//                                   <Grid.Column>
//                                     <Container textAlign='center'>
//                                       <div>
//                                         <Header as='h4'><i className='green checkmark icon'></i>Completed</Header>
//                                         {
//                                           _.map(relatedOpportunities.completed, (value, index) => <Container key={index}
//                                                                                                              textAlign='center'>
//                                             <Link
//                                               to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
//                                           </Container>)
//                                         }</div>
//                                     </Container>
//                                   </Grid.Column>
//                                   <Grid.Column>
//                                     <Container textAlign='center'>
//                                       <div>
//                                         <Header as='h4'><i className='yellow warning sign icon'></i>In Plan</Header>
//                                         {
//                                           _.map(relatedOpportunities.inPlan, (value, index) => <Container key={index}
//                                                                                                           textAlign='center'>
//                                             <Link
//                                               to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
//                                           </Container>)
//                                         }</div>
//                                     </Container>
//                                   </Grid.Column>
//                                   <Grid.Column>
//                                     <Container textAlign='center'>
//                                       <div>
//                                         <Header as='h4'><i className='red warning circle icon'></i>Not In Plan</Header>
//                                         {
//                                           _.map(relatedOpportunities.notInPlan, (value, index) => <Container key={index}
//                                                                                                              textAlign='center'>
//                                             <Link
//                                               to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
//                                           </Container>)
//                                         }</div>
//                                     </Container>
//                                   </Grid.Column>
//                                 </Grid.Row>
//                               </Grid>
//                             </Segment>
//                           </Container>
//                         </Grid.Column>
//                       </Grid.Row>
//                     </Grid>
//                   </Container>
//                 </Grid.Column>
//                 <Grid.Column width={4}>
//                   <Grid>
//                     <Grid.Row centered>
//                       <Grid.Column>
//                         <Container fluid>
//                           <Segment>
//                             <Header textAlign='center'>Students &middot;  <b>{this.participation('student').length}</b></Header>
//                             <Divider/>
//                             <Container textAlign='center'>
//                               <Image.Group size='mini'>
//                                 {interestedStudents.map((student, index) => <Popup
//                                   key={index}
//                                   trigger={<Image src={student.picture} circular size='mini'></Image>}
//                                   content='names'
//                                 />)
//                                 }
//                               </Image.Group>
//                             </Container>
//                           </Segment>
//                         </Container>
//                       </Grid.Column>
//                     </Grid.Row>
//                     <Grid.Row>
//                       <Grid.Column>
//                         <Container fluid>
//                           <Segment>
//                             <Header textAlign='center'>Faculty Members &middot;
//                               <b>{this.participation('faculty').length}</b>
//                             </Header>
//                             <Divider/>
//
//                             <Container textAlign='center'>
//                               <Image.Group size='mini'>
//                                 {interestedFaculty.map((faculty, index) => <Popup
//                                   key={index}
//                                   trigger={<Image src={faculty.picture} circular></Image>}
//                                   content={faculty.name}
//                                 />)
//                                 }
//                               </Image.Group>
//                             </Container>
//                           </Segment>
//                         </Container>
//                       </Grid.Column>
//                     </Grid.Row>
//                     <Grid.Row>
//                       <Grid.Column>
//                         <Container>
//                           <Segment>
//                             <Header textAlign='center'>Alumni &middot; <b>{this.participation('alumni').length}</b>
//                             </Header>
//                             <Divider/>
//                             <Container textAlign='center'>
//                               <Image.Group size='mini'>
//                                 {interestedAlumni.map((alumni, index) => <Popup
//                                   key={index}
//                                   trigger={<Image src={alumni.picture} circular></Image>}
//                                   content='names'
//                                 />)
//                                 }
//                               </Image.Group>
//                             </Container>
//                           </Segment>
//                         </Container>
//                       </Grid.Column>
//                     </Grid.Row>
//                     <Grid.Row>
//                       <Grid.Column>
//                         <Container>
//                           <Segment>
//                             <Header textAlign='center'>Mentors &middot;  <b>{this.participation('mentor').length}</b>
//                             </Header>
//                             <Divider/>
//                             <Container textAlign='center'>
//                               <Image.Group size='mini'>
//                                 {interestedMentor.map((mentors, index) => <Popup
//                                   key={index}
//                                   trigger={<Image src={mentors.picture} circular></Image>}
//                                   content='names'
//                                 />)
//                                 }
//                               </Image.Group>
//                             </Container>
//                           </Segment>
//                         </Container>
//                       </Grid.Column>
//                     </Grid.Row>
//                   </Grid>
//                 </Grid.Column>
//               </Grid.Row>
//               <Grid.Row>
//               </Grid.Row>
//               <Grid.Row>
//
//               </Grid.Row>
//
//             </Grid>
//           </Grid.Row>
//         </Grid>
//       </Container>
    );
  }
}

const ExplorerInterestsWidgetCon = withTracker(({ match }) => {
  const username = match.params.username;
  const profile = Users.getProfile(username);
  const interest = Interests.findDoc(match.params.interst);
  return {
    profile,
    interest,
  };
})(ExplorerInterestsWidget);

const ExplorerInterestsWidgetContainer = withRouter(ExplorerInterestsWidgetCon);

export default ExplorerInterestsWidgetContainer;
