import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Container, Header, Button, Grid, Image, Popup} from 'semantic-ui-react';
import {Interests} from "../../../api/interest/InterestCollection";
import * as _ from 'lodash';
import {StudentProfiles} from "../../../api/user/StudentProfileCollection";
import {CourseInstances} from "../../../api/course/CourseInstanceCollection";
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {MentorProfiles} from "../../../api/user/MentorProfileCollection";
import {Doughnut} from 'react-chartjs-2';
import {Courses} from "../../../api/course/CourseCollection"
import {Opportunities} from "../../../api/opportunity/OpportunityCollection";

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
};

// don't know if we'll need this because state may not change
interface IExplorerInterestsWidgetState {

}

class ExplorerInterestsWidget extends React.Component <IExplorerInterestsWidgetProps, IExplorerInterestsWidgetState> {
  constructor(props: any) {
    super(props);
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

  /**
   * return how many users participate in interest based on role
   *  match the interest w/ the interest in a user profile
   */

  private Participation = (role) => {
    let interested = [];
    switch (role) {
      case 'student':
        //StudentProfiles.getInterestIDs(all the students);
        // use _.map?
        // need to return all students who have this interest in their profiles
        // call this.GetInterestDoc().ID to get the interest ID
        // go through the StudentProfiles Collection and compare the interest IDs to this.GetInterestDoc().interestID
        // if there is a match, interested.push(theStudent);
        // then assign howManyInterested = interested.length+1 to get the amount of students interested
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

  private GetUserPictureUrls = (role) => {
    const users = this.Participation(role);
    let pictureUrl = [];
    switch (role) {
      case 'student':
        _.map(users, (value) => {
          pictureUrl.push(value.picture)
        });
        console.log(pictureUrl);
        return pictureUrl;
      case 'faculty' :
        return pictureUrl;
      case 'mentor' :
        return pictureUrl;
      case 'alumni':
        return pictureUrl;

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


  private GetAssociationRelatedCourses = (courses) => {
    let inPlanIDs = [];
    let completedIDs = [];
    const inPlanInstance = CourseInstances.findNonRetired({
      'studentID':
      StudentProfiles.findDoc(this.props.match.params.username).userID, 'verified': false,
    });
    _.map(inPlanInstance, (value) => {
      inPlanIDs.push(value.courseID);
    });
    console.log(inPlanIDs);

    const completedInstance = CourseInstances.findNonRetired({
      'studentID':
      StudentProfiles.findDoc(this.props.match.params.username).userID, 'verified': true
    });
    _.map(completedInstance, (value) => {
      completedIDs.push(value.courseID);
    });
    console.log(completedIDs);

    console.log(courses);
    let relatedIDs = [];
    //shows all ids for related courses
    _.map(courses, (value) => {
      relatedIDs.push(value._id)
    });
    console.log(relatedIDs);

    const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
    const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
    const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);
        console.log('completed instances', relatedCompletedIDs, 'in plan instances', relatedInPlanIDs, 'not in plan', relatedNotInPlanIDs);

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

  private GetRelatedOpportunityNames = () => {
    let relatedOpportunityNames = [];
    const relatedOpportunities = this.GetRelatedOpportunities();
    _.map(relatedOpportunities, (related) => relatedOpportunityNames.push(related.name, '\n'));
    return relatedOpportunityNames;
  };


  public render() {
    const interestDoc = this.GetInterestDoc();
    const interestName = interestDoc.name;
    const interestDescription = interestDoc.description;
    const relatedCourses = this.GetAssociationRelatedCourses(this.GetRelatedCourses());
    const relatedOpportunityNames = this.GetRelatedOpportunityNames();
    const interestedStudents = this.Participation('student');
    const interestedFaculty = this.Participation('faculty');
    const interestedAlumni = this.Participation('alumni');
    const interestedMentor = this.Participation('mentor');

    //const interestID = interestDoc._id;

    /** data for doughnut charts*/
    const coursesData = {
      labels: ['not in plan', 'in plan', 'completed'],
      datasets: [{
        data: this.GetRelatedCourses(),
        backgroundColor: [
          '#ff925b',
          '#ffe45b',
          '#745bff',
        ],
        text: 'Related Courses'
      }]
    };

    const opportunitiesData = {
      labels: ['not in plan', 'in plan', 'completed'],
      datasets: [{
        data: this.GetRelatedOpportunities(),
        backgroundColor: [
          '#ff925b',
          '#ffe45b',
          '#745bff',
        ],
        text: 'Related Opportunities'
      }]
    };

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
                  <Button fluid floated='right'>
                    <Button.Content>
                      Add To Interests
                    </Button.Content>
                  </Button>
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
              Course Names should go here
            </Container>
          </div>
          <div className='ui padded segment container'>
            <Header>Related Opportunities</Header>
            <Container>
              {relatedOpportunityNames}
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
