import moment from 'moment';
import React from 'react';
import { Redirect } from 'react-router';
import Swal from 'sweetalert2';
import { sendRefusedTermsEmailMethod } from '../../../api/email/Email.methods';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { TERMS_AND_CONDITIONS } from '../../layouts/utilities/route-constants';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ChecklistButtonAction, ChecklistButtonLink } from './ChecklistButtons';
import { ActionsBox } from './ActionsBox';

export class TermsAndConditionsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(username: string) {
    super();
    this.name = 'Terms & Conditions';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'file alternate';
    this.title[CHECKSTATE.OK] = 'Thanks for approving RadGrad\'s Terms and Conditions';
    this.title[CHECKSTATE.IMPROVE] = 'Please approve RadGrad\'s Terms and Conditions';
    // Specify the description for each state.
    const adminURL = `mailto:${Meteor.settings.public.adminProfile.username}`;
    this.description[CHECKSTATE.OK] = `Congrats! You've approved our Terms and Conditions. If you no longer approve of the 
      Terms and Conditions and wish to be removed from the system, please email the [RadGrad Administrator](${adminURL}).`;
    this.description[CHECKSTATE.IMPROVE] = `Use of RadGrad requires your consent to our Terms and Conditions. 
      Please read them and indicate whether you approve or not.`;

    this.updateState();
  }

  public updateState(): void {
    if (this.profile.acceptedTermsAndConditions || this.profile.refusedTermsAndConditions) {
      this.state = CHECKSTATE.OK;
    } else {
      this.state = CHECKSTATE.IMPROVE;
    }
  }

  public getDetails(): JSX.Element {
    const url = `/${this.role.toLowerCase()}/${this.profile.username}/${TERMS_AND_CONDITIONS}`;
    return (
      <DetailsBox description='To review Terms and Conditions:'>
        <ChecklistButtonLink url={url} label='Terms and Conditions Page' />
      </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
    const handleAccept = () => {
      const collectionName = StudentProfiles.getCollectionNameForProfile(this.profile);
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.acceptedTermsAndConditions = moment().format('YYYY-MM-DD');
      // console.log('handleAccept', collectionName, updateData);
      updateMethod.callPromise({ collectionName, updateData })
        .catch((error) => console.error('Failed to update acceptedTermsAndConditions', error));
    };
    const handleReject = () => {
      Swal.fire({
        title: 'WARNING',
        text: 'By not accepting the terms and conditions you will be immediately logged out and your account will be removed. Are you sure you don\'t consent to the terms and conditions?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'I do not consent',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // need to inform the admin that a student has disagreed to the terms.
          const emailData = {
            to: RadGradProperties.getAdminEmail(),
            bcc: '',
            from: RadGradProperties.getAdminEmail(),
            replyTo: RadGradProperties.getAdminEmail(),
            subject: `${this.profile.username} refused the terms and conditions`,
            templateData: {
              username: this.profile.username,
            },
            filename: 'refusedTerms.html',
          };
          sendRefusedTermsEmailMethod.callPromise(emailData)
            .catch((error) => console.error('Failed to send email.', error));
          const collectionName = StudentProfiles.getCollectionNameForProfile(this.profile);
          const updateData: StudentProfileUpdate = {};
          updateData.id = this.profile._id;
          updateData.refusedTermsAndConditions = moment().format('YYYY-MM-DD');
          updateMethod.callPromise({ collectionName, updateData })
            .catch((error) => console.error('Failed to update refusedTermsAndConditions', error));
        }
      });
    };
    switch (this.state) {
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox
            description='Please indicate if you consent to the Terms and Conditions below. If you indicate that you do not consent, we will initiate your removal from the RadGrad system. You will also be automatically logged out.'>
            <ChecklistButtonAction onClick={handleAccept} label='I consent' id='I-consent' />
            <ChecklistButtonAction onClick={handleReject} label='I do not consent' icon='thumbs down outline' color='red' id='I-dont-consent' />
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }

  public getChecklistItem(): JSX.Element {
    if (this.profile.refusedTermsAndConditions) {
      return <Redirect to={{ pathname: '/signout-refused' }} key={`${this.profile.username}-refused-terms`} />;
    }
    return super.getChecklistItem();
  }

}
