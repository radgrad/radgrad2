import moment from 'moment';
import React from 'react';
import {updateMethod} from '../../../api/base/BaseCollection.methods';
import {ProfileCareerGoals} from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import {PublicStats} from '../../../api/public-stats/PublicStatsCollection';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {Users} from '../../../api/user/UserCollection';
import {StudentProfile, StudentProfileUpdate} from '../../../typings/radgrad';
import {EXPLORER, URL_ROLES} from '../../layouts/utilities/route-constants';
import ProfileCareerGoalList from '../shared/ProfileCareerGoalList';
import {Checklist, CHECKSTATE} from './Checklist';
import {DetailsBox} from './DetailsBox';
import {ActionsBox} from './ActionsBox';
import {ChecklistButtonAction, ChecklistButtonLink} from './ChecklistButtons';

export class CareerGoalsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Career Goals';
    this.profile = Users.getProfile(student);
    this.iconName = 'briefcase';
    // Specify title for each state.
    this.title[CHECKSTATE.OK] = 'Your Career Goals appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please confirm that your current Career Goals are OK';
    this.title[CHECKSTATE.IMPROVE] = 'Please add at least three Career Goals to your profile';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats!  You have at least three Career Goals in your profile, 
      and you've reviewed them within the past six months to be sure they are up to date.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisitedCareerGoals)) ?
      `You have at least three Career Goals in your profile, but it's been at least six months 
      since you've reviewed them. So, we want to check that they actually reflect your current Career Goals.` :

      'There are new Career Goals since you last reviewed your Career Goals. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `For RadGrad to provide you with useful recommendations for Courses and Opportunities, 
      we need you to add at least three Career Goals to your profile.  Don't worry, you can (and should!) change them at any time 
      in the future as you become interested in new things.`;
    this.updateState();
  }

  public updateState(): void {
    const userID = this.profile.userID;
    const careerGoals = ProfileCareerGoals.findNonRetired({userID});
    if (careerGoals.length < 3) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisitedCareerGoals) {
      const lastVisit = moment(this.profile.lastVisitedCareerGoals, 'YYYY-MM-DD', true);
      const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.careerGoalsUpdateTime);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisitedCareerGoals)) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else { // No record of last visit.
      this.state = CHECKSTATE.REVIEW;
    }
  }

  public getDetails(state: CHECKSTATE): JSX.Element {
    const userID = this.profile.userID;
    const careerGoals = ProfileCareerGoals.findNonRetired({userID});
    return ((careerGoals.length === 0) ?
        <DetailsBox description='Note: There are no Career Goals to your profile. You probably want to add some!'/> :
        <DetailsBox description='Here are your current Career Goals:'>
          <ProfileCareerGoalList profile={this.profile} size="medium"/>
        </DetailsBox>
    );
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(state: CHECKSTATE): JSX.Element {
    const handleVerification = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.lastVisitedCareerGoals = moment().format('YYYY-MM-DD');
      updateMethod.call({collectionName, updateData}, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedCareerGoals', error);
        }
      });
    };
    switch (state) {
      case CHECKSTATE.OK:
        return (
          <ActionsBox description='Go to the Career Goals Explorer to search for more Career Goals to add to your profile:'>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Career Goals Explorer'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description='Go to the Career Goals Explorer to search for more Career Goals to add to your profile. Or, click "My Career Goals are OK" if they are fine as is:' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Career Goals Explorer'/>
            <ChecklistButtonAction onClick={handleVerification} label='My Career Goals are OK'/>
          </ActionsBox>
        );
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Go to the Career Goals Explorer to add at least 3 Career Goals to your profile:' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Career Goals Explorer'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
