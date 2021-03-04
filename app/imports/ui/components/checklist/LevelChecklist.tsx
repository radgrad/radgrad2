import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { LEVELS, URL_ROLES } from '../../layouts/utilities/route-constants';
import RadGradMenuLevel from '../shared/RadGradMenuLevel';
import { Checklist } from './Checklist';
import '../../../../client/style.css';

export class LevelChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('LevelChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    if (this.profile.lastLeveledUp) {
      if (this.isSixMonthsOld(this.profile.lastLeveledUp)) {
        this.state = 'Review';
      } else {
        this.state = 'Awesome';
      }
    } else {
      // no lastLeveledUp info
      this.state = 'Review';
    }
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <Header as='h1'>We notice you have not achieved a <strong>New Level</strong> in a while</Header>;
      case 'Awesome':
        return <Header as='h1'>You recently achieved a <strong>New Level</strong></Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    const levelUpDate = this.profile.lastLeveledUp ? this.profile.lastLeveledUp : 'we have no record.';
    switch (state) {
      case 'Review':
        return <p>RadGrad is designed to enable you to advance to a higher Level once per semester, as long as you are regularly completing Courses and Opportunities. We notice that you have not achieved a new Level since {`${levelUpDate}`}.</p>;
      case 'Awesome':
        return <div>Congrats!  You recently achieved Level {this.profile.level}. <RadGradMenuLevel level={this.profile.level} />  Keep up the good work!</div>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <div className='centeredBox'>
          <p>The Level page contains more information about your current Level and how to achieve the next one.</p>
          <Button size='huge' color='teal'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${LEVELS}`}>Go To Levels Page</Button></div>;
      case 'Awesome':
        return <div className='centeredBox'><p>For more details about your Level please go to </p>
          <Button size='huge' color='teal'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${LEVELS}`}>Go To Levels Page</Button></div>;
      default:
        return <React.Fragment />;
    }
  }

}
