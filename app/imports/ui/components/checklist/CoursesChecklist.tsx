import moment from 'moment';
import React from 'react';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { updateLastVisited } from '../../../api/user/BaseProfileCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Ice, StudentProfile } from '../../../typings/radgrad';
import { DEGREEPLANNER, EXPLORER, ICE, URL_ROLES } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import ProfileFutureCoursesList from '../shared/ProfileFutureCoursesList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonAction, ChecklistButtonLink } from './ChecklistButtons';

export class CoursesChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Courses';
    this.profile = Users.getProfile(student);
    this.iconName = 'book';
    // Specify title for each state.
    this.title[CHECKSTATE.OK] = 'The Courses in your Degree Plan appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please review Courses in your Degree Plan';
    this.title[CHECKSTATE.IMPROVE] = 'Please add Courses to your Degree Plan so that you are on track to earn 100 Competency points';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats! Your Degree Plan contains Courses that should eventually earn you at least 100
      Competency points, and you've reviewed your Degree Plan within the past six months.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.COURSE_BROWSER])) ?
      `You have enough Courses added to your Degree Plan to eventually earn 100 Competency points, but it's
       been at least six months since you've reviewed your Degree Plan. Please check that the Degree
       Planner reflects your future Course plans.`
      :
      'There are new Courses since you last reviewed your Degree Plan. Please review them.';

    this.description[CHECKSTATE.IMPROVE] = 'Specifying the Courses you plan to take helps you balance your curricular and extracurricular activities each semester. It also helps RadGrad recommend Opportunities and Internships.';
    this.updateState();
  }

  public updateState(): void {
    const username = this.profile.username;
    const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
    if (projectedICE.c < 100) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisited[PAGEIDS.COURSE_BROWSER]) {
      const lastVisit = moment(this.profile.lastVisited[PAGEIDS.COURSE_BROWSER], 'YYYY-MM-DD', true);
      const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.coursesUpdateTime);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.COURSE_BROWSER])) {
        this.state = CHECKSTATE.REVIEW;
        // TODO check for new course reviews for future course instances.
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else { // No last visited timestamp
      this.state = CHECKSTATE.REVIEW;
    }
  }

  public getDetails(): JSX.Element {
    const upcomingCourses = CourseInstances.findNonRetired({ studentID: this.profile.userID, verified: false });
    return ((upcomingCourses.length === 0) ?
      <DetailsBox description='You do not have any upcoming Courses in your Degree Plan. Are you graduating?'/> :
      <DetailsBox description='Here are your upcoming Courses:'>
        <ProfileFutureCoursesList profile={this.profile} size="medium" />
      </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
    const handleVerification = () => {
      updateLastVisited.callPromise({ pageID: PAGEIDS.COURSE_BROWSER });
    };
    switch (this.state) {
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Course Explorer to review available Courses and add interesting ones to your profile. Or, use the Degree Planner to add courses from your profile to your degree plan.' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`} label='Courses Explorer'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description={`Use the Course Explorer to review available Courses and add them to your profile. Or, use the Degree Planner to add Course(s) from your profile to your degree plan, or to remove Courses from your degree plan. 
      
Use the myICE Page to learn how Courses earn you Competency points. Click "Courses are OK" to confirm that your courses in your Degree Plan are OK.`} >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`} label='Courses Explorer'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${ICE}`} label='ICE Page'/>
            <ChecklistButtonAction onClick={handleVerification} label='Courses are OK' id='courses-are-ok'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
