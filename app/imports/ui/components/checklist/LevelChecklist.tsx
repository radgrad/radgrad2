import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { LEVELS, URL_ROLES } from '../../layouts/utilities/route-constants';
import RadGradMenuLevel from '../shared/RadGradMenuLevel';
import {Checklist, CHECKSTATE} from './Checklist';
import '../../../../client/style.css';

export class LevelChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Levels';
    this.profile = Users.getProfile(student);
    this.iconName = 'sort amount up';
    this.title[CHECKSTATE.OK] = 'Congrats! You recently achieved a new Level!';
    this.title[CHECKSTATE.REVIEW] = 'We notice you have not achieved a new Level in a while';
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

  public getDescription(state: CHECKSTATE): JSX.Element {
    const levelUpDate = this.profile.lastLeveledUp ? this.profile.lastLeveledUp : 'we have no record.';
    switch (state) {
      case CHECKSTATE.REVIEW:
        return <p>RadGrad is designed to enable you to advance to a higher Level once per semester, as long as you are regularly completing Courses and Opportunities. We notice that you have not achieved a new Level since {`${levelUpDate}`}.</p>;
      case CHECKSTATE.OK:
        return <div>Congrats!  You recently achieved Level {this.profile.level}. <RadGradMenuLevel level={this.profile.level} />  Keep up the good work!</div>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: CHECKSTATE): JSX.Element {
    switch (state) {
      case CHECKSTATE.REVIEW:
        return <div className='centeredBox'>
          <p>The Level page contains more information about your current Level and how to achieve the next one.</p>
          <Button size='huge' color='teal'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${LEVELS}`}>Go To Levels Page</Button></div>;
      case CHECKSTATE.OK:
        return <div className='centeredBox'><p>For more details about your Level please go to </p>
          <Button size='huge' color='teal'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${LEVELS}`}>Go To Levels Page</Button></div>;
      default:
        return <React.Fragment />;
    }
  }

}
