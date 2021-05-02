import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { Profile } from '../../../typings/radgrad';
import { EXPLORER } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import { Checklist, CHECKSTATE } from './Checklist';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class ReviewCareerGoalsChecklist extends Checklist {
  private profile: Profile;

  constructor(username: string) {
    super();
    this.name = 'Review Career Goals';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'briefcase';
    // Specify title for each state
    this.title[CHECKSTATE.OK] = 'Thanks! You&apos;ve recently reviewed the Career Goals';
    this.title[CHECKSTATE.REVIEW] = 'Please review the Career Goals';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks for reviewing the Career Goals.';
    this.description[CHECKSTATE.REVIEW] = 'Please review the Career Goals to ensure they are up to date.';

    this.updateState();
  }

  public updateState(): void {
    const lastVisited = this.profile.lastVisited[PAGEIDS.CAREER_GOAL_BROWSER] || this.profile.lastVisited[PAGEIDS.CAREER_GOAL];
    if (lastVisited) {
      if (this.isSixMonthsOld(lastVisited)) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else {
      // no lastLeveledUp info
      this.state = CHECKSTATE.REVIEW;
    }
  }

  // public getDetails(): JSX.Element {
  //   const interests = Users.getInterestIDs(this.profile.userID);
  //   return ((interests.length === 0) ?
  //       <DetailsBox description='You have not yet added any Interests to your profile.'/> :
  //       <DetailsBox description='Here are your current Interests:'>
  //         <ProfileInterestList profile={this.profile} size="medium" />
  //       </DetailsBox>
  //   );
  // }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Explore Career Goal page to review the Career Goals:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${EXPLORER.CAREERGOALS}`} label='Explore Career Goals Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
