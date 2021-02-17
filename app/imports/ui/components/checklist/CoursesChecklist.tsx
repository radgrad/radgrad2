import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Ice, StudentProfile } from '../../../typings/radgrad';
import ProfileInterestList from '../shared/ProfileInterestList';
import { Checklist } from './Checklist';

export class CoursesChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('CoursesChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    const username = this.profile.username;
    const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
    if (projectedICE.c < 100) {
      this.state = 'Improve';
    } else if (this.profile.lastVisitedCourses) {
      const lastVisit = moment(this.profile.lastVisitedCourses, 'YYYY-MM-DD', true);
      // console.log(this.profile.lastVisitedInterests, PublicStats.getPublicStat(PublicStats.interestsUpdateTime));
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.coursesUpdateTime), 'YYYY-MM-DD-HH-mm-ss'))) {
        this.state = 'Review';
      } else if (this.isSixMonthsOld(this.profile.lastVisitedCourses)) {
        this.state = 'Review';
        // TODO check for new course reviews for future course instances.
      } else {
        this.state = 'OK';
      }
    } else {
      // console.log('no last visited page');
      this.state = 'Review';
    }
    console.log(this.state);
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'OK':
        return <Header>The Courses in your Degree Plan appear to be OK.</Header>;
      case 'Review':
        return <Header>Please confirm that the courses in your Degree Plan are correct.</Header>;
      case 'Improve':
        return <Header>Please add more future Courses to your degree plan so that you are on track to earn 100
          Competency points.</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'OK':
        return <p>Congrats! Your Degree Plan contains Courses that should eventually earn you at least 100 Competency
          points, and you&apos;ve reviewed your Degree Plan within the past six months to be sure it is up to date.</p>;
      case 'Review':
        if (this.isSixMonthsOld(this.profile.lastVisitedCourses)) {
          return <p>You have enough Courses added to your Degree Plan to eventually earn 100 Competency points, but it&apos;s
            been at least six months since you&apos;ve reviewed your Degree Plan. So, we want to check that the Degree
            Planner reflects your future Course plans. </p>;
        }
        return <p>There are new Courses since you last reviewed your Degree Plan. Perhaps you want to add them?</p>;
      // TODO add case for new reviews.
      case 'Improve':
        return <p>Specifying the Courses you plan to take in the future helps you in several ways. First, it helps you balance your curricular and extracurricular activities each semester. Second, it tells RadGrad what interests you are developing skills in, which helps RadGrad to provide recommendations.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    const interests = Users.getInterestIDsByType(this.profile.userID);
    if (interests[0].length === 0) {
      return <p>You have not yet added any Interests to your profile</p>;
    }
    return <div><p>Here are your current interests:&nbsp;</p><ProfileInterestList profile={this.profile}
                                                                                  size="medium" /></div>;
  }


}
