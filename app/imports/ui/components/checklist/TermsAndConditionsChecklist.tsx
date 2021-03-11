import moment from 'moment';
import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Header, Icon } from 'semantic-ui-react';
import { sendRefusedTermsEmailMethod } from '../../../api/analytic/Email.methods';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { TERMS_AND_CONDITIONS, URL_ROLES } from '../../layouts/utilities/route-constants';
import { Checklist } from './Checklist';
import '../../../../client/style.css';


export class TermsAndConditionsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('TermsAndConditionsChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    if (this.profile.acceptedTermsAndConditions || this.profile.refusedTermsAndConditions) {
      this.state = 'Awesome';
    } else {
      this.state = 'Improve';
    }
  }

  public getIcon(): string | JSX.Element {
    return <Icon name="file alternate" color="grey" /> ;
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Awesome':
        return <Header as='h1'>Thanks for having approved the terms and conditions</Header>;
      case 'Improve':
        return <Header as='h1'>Please approve the terms and conditions</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    const adminEmail = Meteor.settings.public.adminProfile.username;
    switch (state) {
      case 'Awesome':
        return <div><p>Congrats! You&apos;ve approved the terms and conditions. To see a copy of the terms and conditions,
          please go to <Button size='medium' color='green'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${TERMS_AND_CONDITIONS}`}>Go
            To
            Terms and Conditions</Button>. If you no longer approve of the Terms and Conditions and wish to be removed
          from the system, please contact a RadGrad administrator at <a
            href={`mailto:${adminEmail}?subject=Remove student from RadGrad`}>Remove me from RadGrad</a> and request
          removal from the system.</p></div>;
      case 'Improve':
        return <div><p>Use of RadGrad requires your consent to the following Terms and Conditions. Please read them and
          indicate whether you approve or not.</p></div>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    if (this.state === 'Improve') {
      return <div><p><Button size='medium' color='green'  as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${TERMS_AND_CONDITIONS}`}>View the
        Terms and Conditions</Button></p></div>;
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
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update refusedTermsAndConditions', error);
        }
      });
    };
    switch (state) {
      case 'Awesome':
        return <a href={`mailto:${adminEmail}?subject=Remove student from RadGrad`}>Remove me from RadGrad</a>;
      case 'Improve':
        return <div className="centeredBox">
          <p>Click &quot;I approve&quot; to indicate your consent. Click &quot;I do not approve&quot; to initiate your
            removal from RadGrad.
          </p>
          <Button size='huge' color='teal' onClick={handleAccept}>I Approve</Button> &nbsp;&nbsp;
          <Button basic size='huge' color='teal' onClick={handleReject}>I Do Not Approve</Button>
        </div>;
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
