import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Ice, StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { DEGREEPLANNER, EXPLORER, ICE, URL_ROLES } from '../../layouts/utilities/route-constants';
import ProfileFutureCoursesList from '../shared/ProfileFutureCoursesList';
import {Checklist, CHECKSTATE} from './Checklist';
import '../../../../client/style.css';
import {DetailsBox} from './DetailsBox';

export class CoursesChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Courses';
    this.profile = Users.getProfile(student);
    this.iconName = 'book';
    // Specify title for each state.
    this.title[CHECKSTATE.OK] = 'The Courses in your Degree Plan appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please confirm that the Courses in your Degree Plan are OK';
    this.title[CHECKSTATE.IMPROVE] = 'Please add Courses to your Degree Plan so that you are on track to earn 100 Competency points';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats! Your Degree Plan contains Courses that should eventually earn you at least 100
      Competency points, and you've reviewed your Degree Plan within the past six months to be sure it is up to date.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisitedCourses)) ?
      `You have enough Courses added to your Degree Plan to eventually earn 100 Competency points, but it's
       been at least six months since you've reviewed your Degree Plan. So, we want to check that the Degree
       Planner reflects your future Course plans.`
      :
      'There are new Courses since you last reviewed your Degree Plan. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `Specifying the Courses you plan to take in the future helps you in several ways. 
      First, it helps you balance your curricular and extracurricular activities each semester. Second, it tells RadGrad what
      interests you are developing skills in, which helps RadGrad to provide recommendations.`;
    this.updateState();
  }

  public updateState(): void {
    const username = this.profile.username;
    const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
    if (projectedICE.c < 100) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisitedCourses) {
      const lastVisit = moment(this.profile.lastVisitedCourses, 'YYYY-MM-DD', true);
      // console.log(this.profile.lastVisitedInterests, PublicStats.getPublicStat(PublicStats.interestsUpdateTime));
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.coursesUpdateTime), 'YYYY-MM-DD-HH-mm-ss'))) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisitedCourses)) {
        this.state = CHECKSTATE.REVIEW;
        // TODO check for new course reviews for future course instances.
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else {
      // console.log('no last visited page');
      this.state = CHECKSTATE.REVIEW;
    }
    // console.log(this.state);
  }

  public getDetails(state: CHECKSTATE): JSX.Element {
    const upcomingCourses = CourseInstances.findNonRetired({ studentID: this.profile.userID, verified: false });
    return ((upcomingCourses.length === 0) ?
        <DetailsBox description='Note: You do not have any upcoming Courses in your Degree Plan. Are you graduating?'/> :
        <DetailsBox description='Here are your upcoming Courses:'>
          <ProfileFutureCoursesList profile={this.profile} size="medium" />
        </DetailsBox>
    );
  }

  public getActions(state: CHECKSTATE): JSX.Element {
    const handleVerification = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.lastVisitedCourses = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedCourses', error);
        }
      });
    };
    switch (state) {
      case CHECKSTATE.OK:
        return <div className='centeredBox'>
          <p>Click &quot;Go To Degree Planner&quot; if you still want to see the courses in your Degree Plan, or
          click &quot;Go to Course Explorer&quot; if you still want to search for additional Courses to include in your
          Degree Plan.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`}>Go To Degree Planner</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`}>Go To Course Explorer</Button>
        </div>;
      case CHECKSTATE.IMPROVE:
        return <div className='centeredBox'><p>Click &quot;Go To Course Explorer&quot; to review the available Courses in RadGrad and add interesting ones to your profile. Or, click &quot;Go To Degree Planner&quot; to go directly to the Degree Planner page to add courses from your profile to a future semester in your degree plan</p>
          <Button size='huge' color='teal'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`}>Go To Course Explorer</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`}>Go To Degree Planner</Button>
        </div>;
      case CHECKSTATE.REVIEW:
        return <div className='centeredBox'>
          <p>Click &quot;Go To Course Explorer&quot; to search for courses and add new ones to your profile, or to see new reviews. Click &quot;Go To Degree Planner&quot; to review your degree plan and potentially move or remove Courses. Click &quot;Go To ICE page&quot; to learn more about Competency points.  Click &quot;My Courses are OK&quot; to confirm that your current Degree Plan is correct.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`}>Go To Degree Planner</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`}>Go To Course Explorer</Button><br/><br/>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${ICE}`}>Go To ICE</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' onClick={handleVerification}>My Courses are OK</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}
