import React from 'react';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Users } from '../../../api/user/UserCollection';
import { AdvisorOrFacultyProfile } from '../../../typings/radgrad';
import { MANAGE } from '../../layouts/utilities/route-constants';
import { Checklist, CHECKSTATE } from './Checklist';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class ManageReviewsChecklist extends Checklist {
  private profile: AdvisorOrFacultyProfile;

  constructor(username: string) {
    super();
    this.name = 'Manage Reviews';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'star half';
    this.title[CHECKSTATE.OK] = 'Thanks! There are no pending reviews';
    this.title[CHECKSTATE.IMPROVE] = 'Please process the pending reviews';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks, for processing the pending reviews.';
    this.description[CHECKSTATE.IMPROVE] = `RadGrad is designed to support well rounded students. 
    Part of that is offering extracurricular opportunities and verifying participation.
    There are pending reviews.`;

    this.updateState();
  }

  public updateState(): void {
    const unverified = Reviews.findNonRetired({ moderated: false });
    if (unverified.length > 0) {
      this.state = CHECKSTATE.IMPROVE;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }
  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Manage Review page to process pending reviews:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${MANAGE.REVIEWS}`} label='Manage Reviews Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
