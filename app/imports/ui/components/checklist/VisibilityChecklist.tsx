import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { VISIBILITY, URL_ROLES } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import StudentVisibilitySettingList from '../student/StudentVisibilitySettingList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class VisibilityChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Visibility';
    this.profile = Users.getProfile(student);
    this.iconName = 'privacy';
    this.title[CHECKSTATE.OK] = 'Thanks! You recently reviewed your Visibility settings';
    this.title[CHECKSTATE.REVIEW] = 'We notice you have not reviewed your Visibility settings recently';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks for reviewing your visibility settings.';
    this.description[CHECKSTATE.REVIEW] = `RadGrad is designed to support community building by helping you to find other students
      with similar interests and goals. However, we don't want to share your information without your consent. The more
      information that you choose to share, the easier it is for RadGrad to help connect you with other students.`;

    this.updateState();
  }

  public updateState(): void {
    if (this.profile.lastVisited[PAGEIDS.STUDENT_VISIBILITY]) {
      if (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.STUDENT_VISIBILITY])) {
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
        <StudentVisibilitySettingList profile={this.profile} size="medium" />
      </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Go to the Visibility page to review and adjust the contents of your public profile:'>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${VISIBILITY}`} label='Visibility Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
