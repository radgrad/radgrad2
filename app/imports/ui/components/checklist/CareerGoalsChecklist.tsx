import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { EXPLORER, URL_ROLES } from '../../layouts/utilities/route-constants';
import ProfileCareerGoalList from '../shared/ProfileCareerGoalList';
import { Checklist } from './Checklist';


export class CareerGoalsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('CareerGoalsChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    const userID = this.profile.userID;
    const careerGoals = FavoriteCareerGoals.findNonRetired({ userID });
    if (careerGoals.length < 3) {
      // console.log('not enough careergoals');
      this.state = 'Improve';
    } else if (this.profile.lastVisitedCareerGoals) {
      const lastVisit = moment(this.profile.lastVisitedCareerGoals, 'YYYY-MM-DD', true);
      // console.log(this.profile.lastVisitedCareerGoals, PublicStats.getPublicStat(PublicStats.Career GoalsUpdateTime));
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.careerGoalsUpdateTime), 'YYYY-MM-DD-HH-mm-ss'))) {
        this.state = 'Review';
      } else if (this.isSixMonthsOld(this.profile.lastVisitedCareerGoals)) {
        this.state = 'Review';
      } else {
        this.state = 'OK';
      }
    } else {
      // console.log('no last visited page');
      this.state = 'Review';
    }
    // console.log('updatestate', this.state);
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'OK':
        return <Header>Your Career Goals appear to be OK.</Header>;
      case 'Review':
        return <Header>Please confirm that your current Career Goals are OK.</Header>;
      case 'Improve':
        return <Header>Please add at least three Career Goals to your profile.</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'OK':
        return <p>Congrats!  You have at least three Career Goals in your profile, and you&apos;ve reviewed them within the past six months to be sure they are up to date.</p>;
      case 'Review':
        if (this.isSixMonthsOld(this.profile.lastVisitedCareerGoals)) {
          return <p>You have at least three Career Goals in your profile, but it&apos;s been at least six months since you&apos;ve reviewed them. So, we want to check that they actually reflect your current Career Goals.</p>;
        }
        return <p>There are new Career Goals since you last reviewed your Career Goals. Perhaps you want to add them?</p>;
      case 'Improve':
        return <p>For RadGrad to provide you with useful recommendations for Courses and Opportunities, we need you to add at least three Career Goals to your profile.  Don&apos;t worry, you can (and should!) change them at any time in the future as you become interested in new things.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    const userID = this.profile.userID;
    const careerGoals = FavoriteCareerGoals.findNonRetired({ userID });
    if (careerGoals[0].length === 0) {
      return <p>You have not yet added any Career Goals to your profile</p>;
    }
    return <div><p>Here are your current Career Goals:&nbsp;</p><ProfileCareerGoalList profile={this.profile} size="medium" /></div>;
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(state: ChecklistState): JSX.Element {
    const handleVerification = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.lastVisitedCareerGoals = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedCareerGoals', error);
        }
      });
    };
    switch (state) {
      case 'OK':
        return <p>Click this button to go to the Career Goals Explorer if you want to look for new Career Goals anyway.&nbsp;
        <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`}>Go To Career Goals Explorer</Button> </p>;
      case 'Review':
        return <div>
          <p>Clicking either button sets the timestamp for the last time this item was reviewed, so it will
          move into the OK state and won&apos;t move back into the Review state for another six months.</p>
          <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`}>Go To Career Goals Explorer</Button>
          <Button onClick={handleVerification}>My Career Goals are OK</Button>
        </div>;
      case 'Improve':
        return <div><p>Click &quot;Go To Interest Explorer&quot; to search for the Career Goals and add at least three to
          your Profile.</p>
          <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`}>Go To Career Goals Explorer</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}
