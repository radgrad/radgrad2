import moment from 'moment';
import React from 'react';
import {updateMethod} from '../../../api/base/BaseCollection.methods';
import {PublicStats} from '../../../api/public-stats/PublicStatsCollection';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {Users} from '../../../api/user/UserCollection';
import {StudentProfile, StudentProfileUpdate} from '../../../typings/radgrad';
import {EXPLORER, URL_ROLES} from '../../layouts/utilities/route-constants';
import ProfileInterestList from '../shared/ProfileInterestList';
import {Checklist, CHECKSTATE} from './Checklist';
import {DetailsBox} from './DetailsBox';
import {ActionsBox} from './ActionsBox';
import {ChecklistButtonAction, ChecklistButtonLink} from './ChecklistButtons';

export class InterestsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Interests';
    this.profile = Users.getProfile(student);
    this.iconName = 'star';
    // Specify title for each state
    this.title[CHECKSTATE.OK] = 'Your Interests appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please confirm that your Interests are OK';
    this.title[CHECKSTATE.IMPROVE] = 'Please add at least 3 Interests to your profile';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats!  You have at least three Interests in your profile, and you've reviewed 
      them within the past six months to be sure they are up to date.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisitedInterests)) ?
      `You have at least three Interests in your profile, but it's been at least six months since you've reviewed them. 
      So, we want to check that they actually reflect your current Interests.`
      :
      'There are new Interests since you last reviewed your Interests. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `For RadGrad to provide you with useful recommendations for Courses and Opportunities, 
      we need you to add at least three Interests to your profile.  Don't worry, you can (and should!) change them at any 
      time in the future as you become interested in new things.`;
    this.updateState();
  }

  public updateState(): void {
    const interests = Users.getInterestIDs(this.profile.userID);
    if (interests.length < 3) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisitedInterests) {
      const lastVisit = moment(this.profile.lastVisitedInterests, 'YYYY-MM-DD', true);
      const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.interestsUpdateTime);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisitedInterests)) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else { // No data on lastVisited
      this.state = CHECKSTATE.REVIEW;
    }
  }

  public getDetails(): JSX.Element {
    const interests = Users.getInterestIDs(this.profile.userID);
    return ((interests.length === 0) ?
        <DetailsBox description='Note: You have not yet added any Interests to your profile.'/> :
        <DetailsBox description='Here are your current Interests:'>
          <ProfileInterestList profile={this.profile} size="medium" />
        </DetailsBox>
    );
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(): JSX.Element {
    const handleVerification = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.lastVisitedInterests = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedInterests', error);
        }
      });
    };
    switch (this.state) {
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Go to the Interests Explorer to search for Interests to add to your profile. You should have at least three.'>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`} label='Interests Explorer'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description='Go to the Interests Explorer to search for Interests to add to your profile. Or, click "My Interests are OK if you think they are fine as is:' >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`} label='Interests Explorer'/>
            <ChecklistButtonAction onClick={handleVerification} label='My Interests are OK'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
