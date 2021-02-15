import moment from 'moment';
import React from 'react';
import { Header } from 'semantic-ui-react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import ProfileInterestList from '../shared/ProfileInterestList';
import { Checklist } from './Checklist';


export class InterestsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    this.updateState();
  }

  public updateState(): void {
    const interests = Users.getInterestIDsByType(this.profile.userID);
    if (interests[0].length < 3) {
      this.state = 'Improve';
    } else if (this.profile.lastVisitedInterests) {
      const lastVisit = moment(this.profile.lastVisitedInterests);
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.interestsUpdateTime)))) {
        this.state = 'Review';
      } else if (this.isSixMonthsOld()) {
        this.state = 'Review';
      } else {
        this.state = 'OK';
      }
    } else {
      this.state = 'Review';
    }
  }

  public getTitle(): JSX.Element {
    switch (this.state) {
      case 'OK':
        return <Header>Your Interests appear to be OK.</Header>;
      case 'Review':
        return <Header>Please confirm that your current Interests are OK.</Header>;
      case 'Improve':
        return <Header>Please add at least three Interests to your profile.</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(): JSX.Element {
    switch (this.state) {
      case 'OK':
        return <p>Congrats!  You have at least three Interests in your profile, and you&apos;ve reviewed them within the past six months to be sure they are up to date.</p>;
      case 'Review':
        if (this.isSixMonthsOld()) {
          return <p>You have at least three Interests in your profile, but it&apos;s been at least six months since you&apos;ve reviewed them. So, we want to check that they actually reflect your current Interests.</p>;
        }
        return <p>There are new Interests since you last reviewed your Interests. Perhaps you want to add them?</p>;
      case 'Improve':
        return <p>For RadGrad to provide you with useful recommendations for Courses and Opportunities, we need you to add at least three Interests to your profile.  Don&apos;t worry, you can (and should!) change them at any time in the future as you become interested in new things.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(): JSX.Element {
    return <ProfileInterestList profile={this.profile} size="medium" />;
  }

  private isSixMonthsOld(): boolean {
    if (this.profile.lastVisitedInterests) {
      const lastVisit = moment(this.profile.lastVisitedInterests);
      return lastVisit.isBefore(moment().subtract('months', 6));
    }
    return true;
  }
}
