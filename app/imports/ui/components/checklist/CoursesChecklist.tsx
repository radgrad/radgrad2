import moment from 'moment';
import React from 'react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Ice, StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { DEGREEPLANNER, EXPLORER, ICE, URL_ROLES } from '../../layouts/utilities/route-constants';
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
      const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.coursesUpdateTime);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisitedCourses)) {
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
        <DetailsBox description='Note: You do not have any upcoming Courses in your Degree Plan. Are you graduating?'/> :
        <DetailsBox description='Here are your upcoming Courses:'>
          <ProfileFutureCoursesList profile={this.profile} size="medium" />
        </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
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
    switch (this.state) {
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Go to the Course Explorer to review available Courses and add interesting ones to your profile. Or, go to the Degree Planner to add courses from your profile to your degree plan.' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`} label='Courses Explorer'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description={`Go to the Course Explorer to review available Courses and add them to your profile. Or, go to the Degree Planner to add Course(s) from your profile to your degree plan, or to remove Courses from your degree plan that you no longer plan to take. 
      
You can go to the ICE Page to learn more about how Courses earn you Competency points. Finally, you can click "Courses are OK" to confirm that the courses in your Degree Plan are OK.`} >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`} label='Courses Explorer'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${ICE}`} label='ICE Page'/>
            <ChecklistButtonAction onClick={handleVerification} label='Courses are OK'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
