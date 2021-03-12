import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { PRIVACY, URL_ROLES } from '../../layouts/utilities/route-constants';
import StudentPrivacySettingList from '../student/StudentPrivacySettingList';
import {Checklist, CHECKSTATE} from './Checklist';
import '../../../../client/style.css';
import {DetailsBox} from "./DetailsBox";
import ProfileInterestList from "../shared/ProfileInterestList";

export class PrivacyChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Privacy';
    this.profile = Users.getProfile(student);
    this.iconName = 'privacy';
    this.title[CHECKSTATE.OK] = 'Thanks! You recently reviewed your Privacy settings';
    this.title[CHECKSTATE.REVIEW] = 'We notice you have not reviewed your Privacy settings recently';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks for reviewing your privacy settings.';
    this.description[CHECKSTATE.REVIEW] = `RadGrad is designed to support community building by helping you to find other students
      with similar interests and goals. However, we don't want to share your information without your consent. The more
      information that you choose to share, the easier it is for RadGrad to help connect you with other students.`;

    this.updateState();
  }

  public updateState(): void {
    if (this.profile.lastVisitedPrivacy) {
      if (this.isSixMonthsOld(this.profile.lastVisitedPrivacy)) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else {
      // no lastLeveledUp info
      this.state = CHECKSTATE.REVIEW;
    }
  }

  public getDetails(state: CHECKSTATE): JSX.Element {
    return (
      <DetailsBox description='Your privacy settings are:'>
        <StudentPrivacySettingList profile={this.profile} size="medium" />
      </DetailsBox>
    )
  }

  public getActions(state: CHECKSTATE): JSX.Element {
    switch (state) {
      case CHECKSTATE.REVIEW:
        return <div className='centeredBox'><p>Click &quot;Go to Privacy Page&quot; to go to the privacy page.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${PRIVACY}`}>Go To Privacy Page</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }

}
