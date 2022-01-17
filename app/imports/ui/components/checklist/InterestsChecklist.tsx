import moment from 'moment';
import React from 'react';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { updateLastVisited } from '../../../api/user/BaseProfileCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { Profile } from '../../../typings/radgrad';
import { EXPLORER } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import ProfileInterestList from '../shared/ProfileInterestList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonAction, ChecklistButtonLink } from './ChecklistButtons';

export class InterestsChecklist extends Checklist {
  private profile: Profile;

  constructor(username: string) {
    super();
    this.name = 'Interests';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'heart';
    // Specify title for each state
    this.title[CHECKSTATE.OK] = 'Your Interests appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please review your Interests';
    this.title[CHECKSTATE.IMPROVE] = 'Please add at least 3 Interests to your profile';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats!  You have at least 3 Interests in your profile, and you've reviewed 
      them within the past six months.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.INTEREST_BROWSER])) ?
      `You have at least 3 Interests in your profile, but it's been at least 6 months since you've reviewed them. 
      Please check that they reflect your current Interests.`
      :
      'There are new Interests since you last reviewed your Interests. Please review them.';

    this.description[CHECKSTATE.IMPROVE] = "RadGrad needs at least 3 Interests in your profile in order to provide you with useful recommendations. Don't worry, you can change them later.";
    this.updateState();
  }

  public updateState(): void {
    const interests = Users.getInterestIDs(this.profile.userID);
    if (interests.length < 3) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisited[PAGEIDS.INTEREST_BROWSER]) {
      const lastVisit = moment(this.profile.lastVisited[PAGEIDS.INTEREST_BROWSER], 'YYYY-MM-DD', true);
      const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.interestsUpdateTime);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.INTEREST_BROWSER])) {
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
      <DetailsBox description='You have not yet added any Interests to your profile.'/> :
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
      updateLastVisited.callPromise({ pageID: PAGEIDS.INTEREST_BROWSER });
    };
    switch (this.state) {
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Interests Explorer to search for Interests to add to your profile. You should have at least 3.'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${EXPLORER.INTERESTS}`} label='Interests Explorer'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description='Use the Interests Explorer to search for Interests to add to your profile. Click "My Interests are OK if you think they are fine as is:' >
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${EXPLORER.INTERESTS}`} label='Interests Explorer'/>
            <ChecklistButtonAction onClick={handleVerification} label='My Interests are OK' id='interests-are-ok'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
