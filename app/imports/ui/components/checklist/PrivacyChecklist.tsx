import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { PRIVACY, URL_ROLES } from '../../layouts/utilities/route-constants';
import StudentPrivacySettingList from '../student/StudentPrivacySettingList';
import { Checklist } from './Checklist';
import '../../../../client/style.css';

export class PrivacyChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('PrivacyChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    if (this.profile.lastVisitedPrivacy) {
      if (this.isSixMonthsOld(this.profile.lastVisitedPrivacy)) {
        this.state = 'Review';
      } else {
        this.state = 'OK';
      }
    } else {
      // no lastLeveledUp info
      this.state = 'Review';
    }
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <Header as='h1'>We notice you have not reviewed your <strong>Privacy Settings</strong> recently</Header>;
      case 'OK':
        return <Header as='h1'>You recently reviewed your <strong>Privacy Settings</strong></Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <p>RadGrad is designed to support community building by helping you to find other students with similar
          interests and goals. However, we don&apos;t want to share your information without your consent. The more
          information that you choose to share, the easier it is for RadGrad to help connect you with other
          students.</p>;
      case 'OK':
        return <p>Thanks for reviewing your privacy settings.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <div className='highlightBox'><p>Your current privacy settings are:</p>
          <StudentPrivacySettingList profile={this.profile} size="medium" /></div>;
      case 'OK':
        return <div className='centeredBox'><p>The Privacy page allows you to change your privacy settings </p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${PRIVACY}`}>Go To Privacy Page</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }

  public getActions(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <div className='centeredBox'><p>Click &quot;Go to Privacy Page&quot; to go to the privacy page.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${PRIVACY}`}>Go To Privacy Page</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }

}
