import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Container, Header, Button, Grid, Image, Popup} from 'semantic-ui-react';
import {Interests} from "../../../api/interest/InterestCollection";
import { _ } from 'meteor/erasaur:meteor-lodash';
import {StudentProfiles} from "../../../api/user/StudentProfileCollection";
import {CourseInstances} from "../../../api/course/CourseInstanceCollection";
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {MentorProfiles} from "../../../api/user/MentorProfileCollection";
import {Courses} from "../../../api/course/CourseCollection"
import {Opportunities} from "../../../api/opportunity/OpportunityCollection";
import {OpportunityInstances} from "../../../api/opportunity/OpportunityInstanceCollection";
import Swal from 'sweetalert2';
import {updateMethod} from '../../../api/base/BaseCollection.methods';
import {Users} from "../../../api/user/UserCollection";

//find and import simple schema

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
}

// don't know if we'll need this because state may not change
interface IExplorerInterestsWidgetState {
  id: string;
  interestIDs: [];
}

class ExplorerInterestsWidget extends React.Component <IExplorerInterestsWidgetProps, IExplorerInterestsWidgetState> {
  constructor(props: any) {
    super(props);
    this.state = {id: '', interestIDs: []}
  }

  /**
   * returns the doc of interest based on url
   * @constructor
   */
  private GetInterestDoc = () => {
    const splitUrl = this.props.match.url.split('/');
    const splitSlug = splitUrl[splitUrl.length - 1];
    return (Interests.findDocBySlug(splitSlug));
    //Interests.findIdBySlug(slug)
  };

  private getRoleByUrl = (): string => {
    const role = this.props.match.url.split('/')[1];
    return role;
  };
  /**
   * return how many users participate in interest based on role
   *  match the interest w/ the interest in a user profile
   */

  private Participation = (role) => {
    let interested = [];
    switch (role) {
      case 'student':
        const students = StudentProfiles.findNonRetired();
        for (let a = 0; a < students.length; a++) {
          for (let i = 0; i < students[a].interestIDs.length; i++) {
            if (students[a].interestIDs[i] === this.GetInterestDoc()._id) {
              interested.push(students[a]);
            }
          }
        }
        return interested;
      case 'faculty':
        const faculty = FacultyProfiles.findNonRetired();
        for (let a = 0; a < faculty.length; a++) {
          for (let i = 0; i < faculty[a].interestIDs.length; i++) {
            if (faculty[a].interestIDs[i] === this.GetInterestDoc()._id) {
              interested.push(faculty[a]);
            }
          }
        }
        return interested;
      case 'mentor':
        const mentor = MentorProfiles.findNonRetired();
        for (let a = 0; a < mentor.length; a++) {
          for (let i = 0; i < mentor[a].interestIDs.length; i++) {
            if (mentor[a].interestIDs[i] === this.GetInterestDoc()._id) {
              interested.push(mentor[a]);
            }
          }
        }
        return interested;
      case 'alumni':
        const alumni = StudentProfiles.findNonRetired({'isAlumni': true});
        for (let a = 0; a < alumni.length; a++) {
          for (let i = 0; i < alumni[a].interestIDs.length; i++) {
            if (alumni[a].interestIDs[i] === this.GetInterestDoc()._id) {
              interested.push(alumni[a]);
            }
          }
        }
        return interested;
    }
  };


  private GetRelatedCourses = () => {
    let courses = [];
    const courseInstances = Courses.find().fetch();
    for (let a = 0; a < courseInstances.length; a++) {
      for (let i = 0; i < courseInstances[a].interestIDs.length; i++) {
        if (courseInstances[a].interestIDs[i] === this.GetInterestDoc()._id) {
          courses.push(courseInstances[a]);
        }
      }
    }
    return courses;
  };


  /**
   *
   * @param courses
   * @constructor
   */
  private GetAssociationRelatedCourses = (courses, role) => {
    let inPlanIDs = [];
    let completedIDs = [];
    let relatedCourses: { completed: []; inPlan: []; notInPlan: []; } = {
      completed: [],
      inPlan: [],
      notInPlan: []
    };
    if (role != 'student') {
      return relatedCourses;
    } else {
      const inPlanInstance = CourseInstances.findNonRetired({
        'studentID':
        StudentProfiles.findDoc(this.props.match.params.username).userID, 'verified': false,
      });
      _.map(inPlanInstance, (value) => {
        inPlanIDs.push(value.courseID);
      });

      const completedInstance = CourseInstances.findNonRetired({
        'studentID':
        StudentProfiles.findDoc(this.props.match.params.username).userID, 'verified': true
      });
      _.map(completedInstance, (value) => {
        completedIDs.push(value.courseID);
      });

      let relatedIDs = [];
      //shows all ids for related courses
      _.map(courses, (value) => {
        relatedIDs.push(value._id)
      });
      const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
      const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
      const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

      relatedCourses = {
        completed: relatedCompletedIDs,
        inPlan: relatedInPlanIDs,
        notInPlan: relatedNotInPlanIDs
      };
      return relatedCourses;
    }
  };

  private GetRelatedOpportunities = () => {
    let opportunities = [];
    const opportunityInstances = Opportunities.find().fetch();
    for (let a = 0; a < opportunityInstances.length; a++) {
      for (let i = 0; i < opportunityInstances[a].interestIDs.length; i++) {
        if (opportunityInstances[a].interestIDs[i] === this.GetInterestDoc()._id) {
          opportunities.push(opportunityInstances[a]);
        }
      }
    }
    return opportunities;
  };

  private GetAssociationRelatedOpportunities = (opportunities, role) => {
    let inPlanIDs = [];
    let completedIDs = [];
    let relatedOpportunities: { completed: []; inPlan: []; notInPlan: []; } = {
      completed: [],
      inPlan: [],
      notInPlan: []
    };
    if (role != 'student') {
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

      relatedOpportunities = {
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

    console.log('handle click');
    console.log('find doc',StudentProfiles.findDoc(this.props.match.params.username));
    switch (this.checkInterestStatus()) {
      case 'remove from interests':
        const newInterestsAfterRemove = this.removeInterest();
        console.log('handle click remove', newInterestsAfterRemove);
        break;
      case 'add to interests':
        const newInterestsAfterAdd = this.addInterest();
        console.log('this is the state:' ,this.state);
        this.state = {id: Users.getProfile(this.props.match.params.username)._id, interestIDs: newInterestsAfterAdd}
        console.log('this is the state:' ,this.state);
        (this.setState({id: Users.getProfile(this.props.match.params.username)._id, interestIDs: newInterestsAfterAdd}));
        console.log('this is the state: ', this.state);
        console.log('handle click add', newInterestsAfterAdd);
        const updateData: any = this.state;
        console.log('this is the updateData',updateData);
        const collectionName = this.getCollectionName();
        console.log('this is the collection name: ', collectionName);
     /*   updateMethod.call({ collectionName, updateData }, (error) => {
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
         });*/
        break;
    }
  };


  private addInterest = () => {

    const user = Users.getProfile(this.props.match.params.username);
    const interestIDsOfUser: [] = user.interestIDs;
    const interestID = this.GetInterestDoc()._id;
    const currentInterestID = [interestID];
    let dataValue;
    let updateValue;
    dataValue = [interestIDsOfUser, currentInterestID];
    updateValue = _.flatten(dataValue);
    return updateValue;

  };


  private removeInterest = () => {
    let interestIDsOfUser: [];
    const interestID = this.GetInterestDoc()._id;
    const currentInterestID = [interestID];
    let dataValue;
    let updateValue;
    switch (this.getRoleByUrl()) {
      case 'student':
        console.log('remove interest student');
        interestIDsOfUser = StudentProfiles.findDoc(this.props.match.params.username).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
      case 'faculty':
        console.log('remove interest faculty');
        interestIDsOfUser = FacultyProfiles.findDoc(this.props.match.params.username).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        console.log(updateValue);
        return updateValue;
      case 'alumni':
        console.log('remove interest alumni');
        interestIDsOfUser = StudentProfiles.findDoc({
          username: this.props.match.params.username,
          isAlumni: true
        }).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
      case 'mentor':
        console.log('remove interest mentor');
        interestIDsOfUser = MentorProfiles.findDoc(this.props.match.params.username).interestIDs;
        updateValue = _.without(interestIDsOfUser, interestID);
        return updateValue;
    }
  };

  private getUpdateDataID = () => {
    switch (this.getRoleByUrl()) {
      case 'student':
        return StudentProfiles.findDoc(this.props.match.params.username)._id;
      case 'faculty':
        return FacultyProfiles.findDoc(this.props.match.params.username)._id;
      case 'alumni':
        return StudentProfiles.findDoc({
          username: this.props.match.params.username,
          isAlumni: true
        })._id;
      case 'mentor':
        return MentorProfiles.findDoc(this.props.match.params.username)._id;
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
    let interestIDsofUser: [];
    const currentInterest = this.GetInterestDoc()._id;
    switch (this.getRoleByUrl()) {
      case 'student':
        interestIDsofUser = StudentProfiles.findDoc(this.props.match.params.username).interestIDs;
        let currentInterestIDStudent = [currentInterest];
        let iDsinCommonStudent = _.intersection(currentInterestIDStudent, interestIDsofUser);
        if (iDsinCommonStudent.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
      case 'faculty':
        console.log(`this is a ${this.props.match.url.split('/')[1]}`);
        console.log(FacultyProfiles.findDoc(this.props.match.params.username));
        interestIDsofUser = FacultyProfiles.findDoc(this.props.match.params.username).interestIDs;
        let currentInterestIDFaculty = [currentInterest];
        let iDsinCommonFaculty = _.intersection(currentInterestIDFaculty, interestIDsofUser);
        if (iDsinCommonFaculty.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
        break;
      case 'alumni':
        console.log(`this is a ${this.props.match.url.split('/')[1]}`);
        interestIDsofUser = StudentProfiles.findDoc(this.props.match.params.username).interestIDs;
        let currentInterestIDAlumni = [currentInterest];
        let iDsinCommonAlumni = _.intersection(currentInterestIDAlumni, interestIDsofUser);
        if (iDsinCommonAlumni.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
        break;
      case 'mentor':
        console.log(`this is a ${this.props.match.url.split('/')[1]}`);
        interestIDsofUser = MentorProfiles.findDoc(this.props.match.params.username).interestIDs;
        let currentInterestIDMentor = [currentInterest];
        let iDsinCommonMentor = _.intersection(currentInterestIDMentor, interestIDsofUser);
        if (iDsinCommonMentor.length == 1) {
          return 'remove from interests';
        } else {
          return 'add to interests';
        }
        break;
    }
  };

  public render() {
    const interestDoc = this.GetInterestDoc();
    const interestName = interestDoc.name;
    const interestDescription = interestDoc.description;
    const relatedCourses = this.GetAssociationRelatedCourses(this.GetRelatedCourses(), this.props.match.url.split('/')[1]);
    const relatedOpportunities = this.GetAssociationRelatedOpportunities(this.GetRelatedOpportunities(), this.props.match.url.split('/')[1]);
    const interestedStudents = this.Participation('student');
    const interestedFaculty = this.Participation('faculty');
    const interestedAlumni = this.Participation('alumni');
    const interestedMentor = this.Participation('mentor');

    /**
     * ToDo polish this UI
     * ToDo add functionality for button
     */
    return (
      <div className='ui paded container'>
        <div className="ui segments">
          <div className='ui padded segment container'>
            <Grid padded>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Header>{interestName}</Header>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Button
                    attached='bottom'
                    content={this.checkInterestStatus()}
                    onClick={this.handleClick}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                {interestDescription}
              </Grid.Row>
            </Grid>
            <div>
            </div>
          </div>
          <div className='ui padded segment container'>
            <Header>Related Courses</Header>
            <Container>
              <div>
                <Header as='h4'>Completed</Header>
                {
                  _.map(relatedCourses.completed, (value, index) =>
                    <div key={index}>
                      <Link to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
                    </div>)
                }</div>
              <div>
                <Header as='h4'>In Plan</Header>
                {
                  _.map(relatedCourses.inPlan, (value, index) =>
                    <div key={index}>
                      <Link to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
                    </div>)
                }</div>
              <div>
                <Header as='h4'>Not In Plan</Header>
                {
                  _.map(relatedCourses.notInPlan, (value, index) =>
                    <div key={index}>
                      <Link to={this.GenerateCourseRoute(Courses.findDoc(value))}>{Courses.findDoc(value).name}</Link>
                    </div>)
                }</div>
            </Container>
          </div>
          <div className='ui padded segment container'>
            <Header>Related Opportunities</Header>
            <Container>
              <div>
                <Header as='h4'>Completed</Header>
                {
                  _.map(relatedOpportunities.completed, (value, index) =>
                    <div key={index}>
                      <Link
                        to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
                    </div>)
                }</div>
              <div>
                <Header as='h4'>In Plan</Header>
                {
                  _.map(relatedOpportunities.inPlan, (value, index) =>
                    <div key={index}>
                      <Link
                        to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
                    </div>)
                }</div>
              <div>
                <Header as='h4'>Not In Plan</Header>
                {
                  _.map(relatedOpportunities.notInPlan, (value, index) =>
                    <div key={index}>
                      <Link
                        to={this.GenerateOpportunityRoute(Opportunities.findDoc(value))}>{Opportunities.findDoc(value).name}</Link>
                    </div>)
                }</div>
            </Container>
          </div>
          <div className='ui padded segment container'>
            Students participating: <b>{this.Participation('student').length}</b>
            <div>
              <Image.Group size='mini'>
                {interestedStudents.map((student, index) =>
                  <Popup
                    key={index}
                    trigger={<Image src={student.picture} circular></Image>}
                    content='names'
                  />)
                }
              </Image.Group>
            </div>
          </div>
          <div className='ui padded segment container'>
            Faculty participating: <b>{this.Participation('faculty').length}</b>
            <div>
              <Image.Group size='mini'>
                {interestedFaculty.map((faculty, index) => <Popup
                  key={index}
                  trigger={<Image src={faculty.picture} circular></Image>}
                  content='names'
                />)
                }
              </Image.Group>
            </div>
          </div>
          <div className='ui padded segment container'>
            Alumni participating: <b>{this.Participation('alumni').length}</b>
            <div>
              <Image.Group size='mini'>
                {interestedAlumni.map((alumni, index) => <Popup
                  key={index}
                  trigger={<Image src={alumni.picture} circular></Image>}
                  content='names'
                />)
                }
              </Image.Group>
            </div>
          </div>
          <div className='ui padded segment container'>
            Mentors participating: <b>{this.Participation('mentor').length}</b>
            <div>
              <Image.Group size='mini'>
                {interestedMentor.map((mentors, index) => <Popup
                  key={index}
                  trigger={<Image src={mentors.picture} circular></Image>}
                  content='names'
                />)
                }
              </Image.Group>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ExplorerInterestsWidget);
