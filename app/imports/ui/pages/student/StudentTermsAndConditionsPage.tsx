import React, {useEffect, useState} from 'react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import PageLayout from '../PageLayout';
import {getTermsAndConditions} from '../../../api/utilities/TermsAndConditions.methods';

const headerPaneTitle = 'Terms and Conditions';
const headerPaneBody = `
Here are the terms and conditions for using RadGrad.
`;

const StudentTermsAndConditionsPage: React.FC = () => {
  const awaitingTerms = 'Waiting to receive terms and conditions from server...';
  const [terms, setTerms] = useState('');
  useEffect(() => {
    function fetchTerms() {
      getTermsAndConditions.callPromise({})
        .then(result => setTerms(result))
        .catch(error => setTerms(`Server Error: ${error}`));
    }
    // Only fetch terms if they haven't been fetched before.
    terms || fetchTerms();
  });

  return (
    <PageLayout id="student-terms-and-conditions-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={terms || awaitingTerms}/>
    </PageLayout>
  );
};

export default StudentTermsAndConditionsPage;
