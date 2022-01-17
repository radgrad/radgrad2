import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import Swal from 'sweetalert2';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfileUpdate } from '../../../typings/radgrad';
import { ActionsBox } from '../../components/checklist/ActionsBox';
import { ChecklistButtonAction } from '../../components/checklist/ChecklistButtons';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { getTermsAndConditions } from '../../../api/utilities/TermsAndConditions.methods';
import { sendRefusedTermsEmailMethod } from '../../../api/email/Email.methods';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';

const headerPaneTitle = 'Terms and Conditions';
const headerPaneBody = `
Here are the terms and conditions for using RadGrad.
`;

/** See https://www.radgrad.org/docs/developers/patterns/components-methods for documentation. */
const TermsAndConditionsPage: React.FC = () => {
  const history = useHistory();
  const rejectHistory = useHistory();
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const [terms, setTerms] = useState('');
  const urlUser = Users.getProfile(currentUser);
  const fetchTerms = () => {
    // console.log('check for infinite loop');
    getTermsAndConditions.callPromise({})
      .then(result => setTerms(result))
      .catch(error => setTerms(`Server Error: ${error}`));
  };
  useEffect(() => { fetchTerms(); }, [terms]);

  const agreeToTerm = () => {
    const collectionName = StudentProfiles.getCollectionNameForProfile(urlUser);
    const updateData: StudentProfileUpdate = {};
    updateData.id = urlUser._id;
    updateData.acceptedTermsAndConditions = moment().format('YYYY-MM-DD');
    // console.log('handleAccept', collectionName, updateData);
    const agreePath = `/${urlUser.role.toLowerCase()}/${currentUser.toLowerCase()}/home`;
    history.push(agreePath);

    updateMethod.callPromise({ collectionName, updateData })
      .catch((error) => console.error('Failed to update acceptedTermsAndConditions', error));
  };

  const rejectToTerm = () => {
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
          subject: `${urlUser.username} refused the terms and conditions`,
          templateData: {
            username: urlUser.username,
          },
          filename: 'refusedTerms.html',
        };
        sendRefusedTermsEmailMethod.callPromise(emailData)
          .catch((error) => console.error('Failed to send email.', error));
        const collectionName = StudentProfiles.getCollectionNameForProfile(urlUser);
        const updateData: StudentProfileUpdate = {};
        updateData.id = urlUser._id;
        updateData.refusedTermsAndConditions = moment().format('YYYY-MM-DD');
        updateMethod.callPromise({ collectionName, updateData })
          .catch((error) => console.error('Failed to update refusedTermsAndConditions', error));
        const disagreePath = '/signout-refused';
        rejectHistory.push(disagreePath);
      }
    });
  };

  return (
    <PageLayout id={PAGEIDS.TERMS_AND_CONDITIONS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={terms} />
      <ActionsBox description="Please indicate if you consent to the Terms and Conditions below. If you indicate that you do not consent, we will initiate your removal from the RadGrad system. You will also be automatically logged out.">
        <ChecklistButtonAction onClick={agreeToTerm} label='I consent to the Terms and Condition' icon='thumbs up outline' color='green' id='I-consent-to-terms' />
        <ChecklistButtonAction onClick={rejectToTerm} label='I do not consent to the Terms and Condition' icon='thumbs down outline' color='red' id='I-dont-consent-to-terms' />
      </ActionsBox>
    </PageLayout>
  );
};

export default (TermsAndConditionsPage);

