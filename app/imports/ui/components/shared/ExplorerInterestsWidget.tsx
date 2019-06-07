import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {Container, Header, Button, Grid} from 'semantic-ui-react';
import {Interests} from "../../../api/interest/InterestCollection";
import * as _ from 'lodash';
import {StudentProfiles} from "../../../api/user/StudentProfileCollection";
import {CourseInstances} from "../../../api/course/CourseInstanceCollection";
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";
import {MentorProfiles} from "../../../api/user/MentorProfileCollection";

interface IExplorerInterestsWidgetProps {
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
    let instances;
    let howManyInterested = 0;
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
       console.log(students);
       console.log(students.length);
        for(let a = 0; a < students.length; a++){
          console.log(students[a].interestIDs);
         for(let i = 0; i< students[a].interestIDs.length; i++){
            //if(students[a].interestIDs[i] === this.GetInterestDoc()._id){
              //interested.push(students[a]);
            //}
          }

        }

       console.log(interested);
        return howManyInterested;
      case 'faculty':
        const faculty = FacultyProfiles.findNonRetired();
        console.log(faculty);
        return 'faculty count';
      case 'mentor':
        const mentor = MentorProfiles.findNonRetired();
        console.log(mentor);
        return 'mentor count';
      case 'alumni':
        return 'alumni count';
    }


    return 'a number';
  };

  public render() {
    const interestDoc = this.GetInterestDoc();
    const interestName = interestDoc.name;
    const interestDescription = interestDoc.description;
    const interestID = interestDoc._id;
    console.log(interestID);
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
            <ul>
              <li>Completed</li>
              <li>In Plan</li>
              <li>Not In Plan</li>
            </ul>
          </div>
          <div className='ui padded segment container'>
            <Header>Related Opportunities</Header>
            <ul>
              <li>Completed</li>
              <li>In Plan</li>
              <li>Not In Plan</li>
            </ul>
          </div>
          <div className='ui padded segment container'>
            Students participating <b>{this.Participation('student')}</b>
          </div>
          <div className='ui padded segment container'>
            Faculty participating <b>{this.Participation('faculty')}</b>
          </div>
          <div className='ui padded segment container'>
            Alumni participating <b>{this.Participation('alumni')}</b>
          </div>
          <div className='ui padded segment container'>
            Mentors participating <b>{this.Participation('mentor')}</b>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ExplorerInterestsWidget);
