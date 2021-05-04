import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { VISIBILITY } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import VisibilitySettingList from '../shared/VisibilitySettingList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class VisibilityChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(username: string) {
    super();
    this.name = 'Visibility';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'privacy';
    this.title[CHECKSTATE.OK] = 'Thanks! You recently reviewed your Visibility settings';
    this.title[CHECKSTATE.REVIEW] = 'Please review your Visibility settings';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks for reviewing your visibility settings.';
    this.description[CHECKSTATE.REVIEW] = `RadGrad is designed to support community building by helping you to find other students
      with similar interests and career goals. Sharing this information enables RadGrad to help connect you with other students.`;

    this.updateState();
  }

  public updateState(): void {
    // console.log(this.profile.lastVisited);
    const lastVisited = this.profile.lastVisited[PAGEIDS.VISIBILITY] || this.profile.lastVisited[PAGEIDS.STUDENT_VISIBILITY];
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

  public getDetails(): JSX.Element {
    return (
      <DetailsBox description='Your visibility settings are:'>
        <VisibilitySettingList profile={this.profile} size="medium" />
      </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Use the Visibility page to review and adjust the your public profile:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${VISIBILITY}`} label='Visibility Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
