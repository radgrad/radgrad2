import moment from 'moment';
import React from 'react';
import {Redirect} from 'react-router';
import {Button} from 'semantic-ui-react';
import {sendRefusedTermsEmailMethod} from '../../../api/analytic/Email.methods';
import {updateMethod} from '../../../api/base/BaseCollection.methods';
import {RadGradProperties} from '../../../api/radgrad/RadGradProperties';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {Users} from '../../../api/user/UserCollection';
import {StudentProfile, StudentProfileUpdate} from '../../../typings/radgrad';
import {TERMS_AND_CONDITIONS, URL_ROLES} from '../../layouts/utilities/route-constants';
import {Checklist, CHECKSTATE} from './Checklist';
import {DetailsBox} from './DetailsBox';
import {ChecklistButtonLink} from './ChecklistButtonLink';

export class TermsAndConditionsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Terms and Conditions';
    this.profile = Users.getProfile(student);
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

  public getDetails(state: CHECKSTATE): JSX.Element {
    const url = `/${URL_ROLES.STUDENT}/${this.profile.username}/${TERMS_AND_CONDITIONS}`;
    return (
      <DetailsBox description='To review Terms and Conditions:'>
        <ChecklistButtonLink url={url} label='Terms and Conditions Page'/>
      </DetailsBox>
    );
  }

  public getActions(state: CHECKSTATE): JSX.Element {
    const adminEmail = Meteor.settings.public.adminProfile.username;
    const handleAccept = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.acceptedTermsAndConditions = moment().format('YYYY-MM-DD');
      updateMethod.call({collectionName, updateData}, (error) => {
        if (error) {
          console.error('Failed to update acceptedTermsAndConditions', error);
        }
      });
    };
    const handleReject = () => {
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
      sendRefusedTermsEmailMethod.call(emailData, (error) => {
        if (error) {
          console.error('Failed to send email.', error);
        }
      });
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.refusedTermsAndConditions = moment().format('YYYY-MM-DD');
      updateMethod.call({collectionName, updateData}, (error) => {
        if (error) {
          console.error('Failed to update refusedTermsAndConditions', error);
        }
      });
    };
    switch (state) {
      case CHECKSTATE.OK:
        return <a href={`mailto:${adminEmail}?subject=Remove student from RadGrad`}>Remove me from RadGrad</a>;
      case CHECKSTATE.IMPROVE:
        return <div className="centeredBox">
          <p>Click &quot;I approve&quot; to indicate your consent. Click &quot;I do not approve&quot; to initiate your
            removal from RadGrad.
          </p>
          <Button size='huge' color='teal' onClick={handleAccept}>I Approve</Button> &nbsp;&nbsp;
          <Button basic size='huge' color='teal' onClick={handleReject}>I Do Not Approve</Button>
        </div>;
      default:
        return <React.Fragment/>;
    }
  }

  public getChecklistItem(): JSX.Element {
    if (this.profile.refusedTermsAndConditions) {
      return <Redirect to={{pathname: '/signout-refused'}} key={`${this.profile.username}-refused-terms`}/>;
    }
    return super.getChecklistItem();
  }

}
