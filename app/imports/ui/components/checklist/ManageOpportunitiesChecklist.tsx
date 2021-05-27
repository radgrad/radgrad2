import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';
import { MANAGE } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import { Checklist, CHECKSTATE } from './Checklist';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class ManageOpportunitiesChecklist extends Checklist {
  private profile: AdvisorOrFacultyProfile;

  constructor(username: string) {
    super();
    this.name = 'Manage Opportunities';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'lightbulb';
    this.title[CHECKSTATE.OK] = 'Thanks! You recently reviewed your sponsored opportunities';
    this.title[CHECKSTATE.REVIEW] = 'Please review your sponsored opportunities';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks for reviewing your sponsored opportunities.';
    this.description[CHECKSTATE.REVIEW] = `RadGrad is designed to support well rounded students. 
    Part of that is offering extracurricular opportunities.`;

    this.updateState();
  }

  public updateState(): void {
    const lastVisited = this.profile.lastVisited[PAGEIDS.MANAGE_OPPORTUNITIES];
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

  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Manage Opportunities page to review and adjust your sponsored opportunities:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${MANAGE.OPPORTUNITIES}`} label='Manage Opportunities Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
