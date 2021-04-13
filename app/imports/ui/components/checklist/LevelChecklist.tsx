import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { LEVELS, URL_ROLES } from '../../layouts/utilities/route-constants';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class LevelChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Levels';
    this.profile = Users.getProfile(student);
    this.iconName = 'sort amount up';
    this.title[CHECKSTATE.OK] = 'Congrats! You recently achieved a new Level!';
    this.title[CHECKSTATE.REVIEW] = 'We notice that you have not achieved a new Level in a while';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `We see that you recently achieved Level ${this.profile.level}. Keep up the good work!`;
    const lastLevelUpText = this.profile.lastLeveledUp ?
      `We notice that you have not achieved a new Level since ${this.profile.lastLeveledUp}` : 'Have you leveled up this semester?';
    this.description[CHECKSTATE.REVIEW] = `RadGrad is designed to enable you to advance to a higher Level once per semester, 
      as long as you are regularly completing Courses and Opportunities. ${lastLevelUpText}`;

    this.updateState();
  }

  public updateState(): void {
    if (this.profile.lastLeveledUp) {
      if (this.isSixMonthsOld(this.profile.lastLeveledUp)) {
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
    const description = (CHECKSTATE.REVIEW) ?
      'The Levels page contains information about your Level and how to achieve the next one.' :
      'For more details about your Level please go to:';
    const url = `/${URL_ROLES.STUDENT}/${this.profile.username}/${LEVELS}`;
    return (
      <DetailsBox description={description}>
        <ChecklistButtonLink url={url} label='Levels Page'/>
      </DetailsBox>
    );
  }
}
