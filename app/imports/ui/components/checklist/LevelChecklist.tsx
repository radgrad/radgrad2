import React from 'react';
import { useParams } from 'react-router';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { LEVELS, URL_ROLES } from '../../layouts/utilities/route-constants';
import { ActionsBox } from './ActionsBox';
import { Checklist, CHECKSTATE } from './Checklist';
import { ChecklistButtonLink } from './ChecklistButtons';
import { DetailsBox } from './DetailsBox';

export class LevelChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Levels';
    this.profile = Users.getProfile(student);
    this.iconName = 'sort amount up';
    this.title[CHECKSTATE.OK] = 'Congrats! You recently achieved a new Level!';
    this.title[CHECKSTATE.REVIEW] = 'You have not achieved a new Level in a while';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `You recently achieved Level ${this.profile.level}. Keep up the good work!`;
    const lastLevelUpText = this.profile.lastLeveledUp ?
      `You have not achieved a new Level since ${this.profile.lastLeveledUp}` : 'Have you leveled up this semester?';
    this.description[CHECKSTATE.REVIEW] = `You can advance to a higher Level once per semester, 
      as long as you are regularly completing Courses and Opportunities. ${lastLevelUpText}`;

    this.updateState();
  }

  public updateState(): void {
    if (this.profile.lastLeveledUp) {
      if (this.isSixMonthsOld(this.profile.lastLeveledUp) && this.profile.level !== 6) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else {
      // no lastLeveledUp info
      this.state = CHECKSTATE.OK;
    }
  }

  public getDetails(): JSX.Element {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { username } = useParams();
    const profile = Users.getProfile(username) as StudentProfile;
    return (
      <DetailsBox description={`Your current Level: ${profile.level}`} />
    );
  }


  public getActions(): JSX.Element {
    const description = (CHECKSTATE.REVIEW) ?
      'Learn about your Level and how to achieve the next one on the Levels page.' :
      'For more details about your Level please go to:';
    const url = `/${URL_ROLES.STUDENT}/${this.profile.username}/${LEVELS}`;
    return (
      <ActionsBox description={description}>
        <ChecklistButtonLink url={url} label='Levels Page' />
      </ActionsBox>
    );
  }
}
