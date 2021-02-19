import moment from 'moment';
import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { DEGREEPLANNER, TERMS_AND_CONDITIONS, URL_ROLES } from '../../layouts/utilities/route-constants';
import { Checklist } from './Checklist';


export class TermsAndConditionsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('TermsAndConditionsChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    if (this.profile.acceptedTermsAndConditions) {
      this.state = 'OK';
    } else {
      this.state = 'Improve';
    }
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'OK':
        return <Header>Thanks for having approved the terms and conditions</Header>;
      case 'Improve':
        return <Header>Please approve the terms and conditions</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    const adminEmail = Meteor.settings.public.adminProfile.username;
    switch (state) {
      case 'OK':
        return <p>Congrats!  You&apos;ve approved the terms and conditions. To see a copy of the terms and conditions, please go to <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${TERMS_AND_CONDITIONS}`}>Go To
          Terms and Conditions</Button>.  If you no longer approve of the Terms and Conditions and wish to be removed from the system, please contact a RadGrad administrator at <a href={`mailto:${adminEmail}?subject=Remove student from RadGrad`}>Remove me from RadGrad</a> and request removal from the system.</p>;
      case 'Improve':
        return <p>Use of RadGrad requires your consent to the following Terms and Conditions. Please read them and indicate whether you approve or not.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    if (this.state === 'Improve') {
      return <p><Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${TERMS_AND_CONDITIONS}`}>View the Terms and Conditions</Button></p>;
    }
    return <React.Fragment />;
  }

  public getActions(state: ChecklistState): JSX.Element {
    const adminEmail = Meteor.settings.public.adminProfile.username;
    const handleAccept = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.acceptedTermsAndConditions = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update acceptedTermsAndConditions', error);
        }
      });
    };
    const handleReject = () => {
      console.log('signout');
      // what do we do here?
      return <Redirect to={{ pathname: '/signout' }} />;
    };
    switch (state) {
      case 'OK':
        return <a href={`mailto:${adminEmail}?subject=Remove student from RadGrad`}>Remove me from RadGrad</a>;
      case 'Improve':
        return <div>
          <p>Click &quot;I approve&quot; to indicate your consent.  Click &quot;I do not approve&quot; to initiate your removal from RadGrad.
        </p>
          <Button onClick={handleAccept}>I approve</Button>
          <Button onClick={handleReject}>I do not approve</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }

}
