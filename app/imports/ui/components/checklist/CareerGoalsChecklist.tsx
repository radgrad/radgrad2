import moment from 'moment';
import React from 'react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { updateLastVisited } from '../../../api/user/BaseProfileCollection.methods';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { EXPLORER } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import ProfileCareerGoalList from '../shared/ProfileCareerGoalList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonAction, ChecklistButtonLink } from './ChecklistButtons';

export class CareerGoalsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(username: string) {
    super();
    this.name = 'Career Goals';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'briefcase';
    // Specify title for each state.
    this.title[CHECKSTATE.OK] = 'Your Career Goals appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please review your Career Goals';
    this.title[CHECKSTATE.IMPROVE] = 'Please add at least three Career Goals to your profile';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats!  You have at least three Career Goals in your profile, 
      and you've reviewed them within the past six months.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.CAREER_GOAL_BROWSER])) ?
      `You have at least 3 Career Goals in your profile, but it's been at least 6 months 
      since you've reviewed them. Please check that they are current.` :

      'There are new Career Goals. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `For RadGrad to provide you with useful recommendations, 
      you need to add at least 3 Career Goals to your profile.  Don't worry, you can always change them.`;
    this.updateState();
  }

  public updateState(): void {
    const userID = this.profile.userID;
    const careerGoals = ProfileCareerGoals.findNonRetired({ userID });
    if (careerGoals.length < 3) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisited[PAGEIDS.CAREER_GOAL_BROWSER]) {
      const lastVisit = moment(this.profile.lastVisited[PAGEIDS.CAREER_GOAL_BROWSER], 'YYYY-MM-DD', true);
      const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.careerGoalsUpdateTime);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.CAREER_GOAL_BROWSER])) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else { // No record of last visit.
      this.state = CHECKSTATE.REVIEW;
    }
  }

  public getDetails(): JSX.Element {
    const userID = this.profile.userID;
    const careerGoals = ProfileCareerGoals.findNonRetired({ userID });
    return ((careerGoals.length === 0) ?
      <DetailsBox description='You have 0 Career Goals in your profile. Please add some!'/> :
      <DetailsBox description='Your current Career Goals:'>
        <ProfileCareerGoalList profile={this.profile} size="medium" careerGoals={careerGoals.map((p) => CareerGoals.findDoc(p.careerGoalID))}/>
      </DetailsBox>
    );
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(): JSX.Element {
    const handleVerification = () => {
      updateLastVisited.callPromise({ pageID: PAGEIDS.CAREER_GOAL_BROWSER });
    };

    switch (this.state) {
      case CHECKSTATE.OK:
        return (
          <ActionsBox description='Use the Career Goals Explorer to add them to your profile:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Career Goals Explorer'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description='Use the Career Goals Explorer to add them to your profile. Or, click "My Career Goals are OK" if they are OK:' >
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Career Goals Explorer'/>
            <ChecklistButtonAction onClick={handleVerification} label='Career Goals are OK' id='career-goals-ok'/>
          </ActionsBox>
        );
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Career Goals Explorer to add at least 3 Career Goals to your profile:' >
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Career Goals Explorer'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
