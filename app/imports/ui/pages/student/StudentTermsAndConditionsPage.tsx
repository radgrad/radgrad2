import React, { useEffect, useState } from 'react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import PageLayout from '../PageLayout';
import { getTermsAndConditions } from '../../../api/utilities/TermsAndConditions.methods';

const headerPaneTitle = 'Terms and Conditions';
const headerPaneBody = `
Here are the terms and conditions for using RadGrad.
`;

/** See https://www.radgrad.org/docs/developers/patterns/components-methods for documentation. */
const StudentTermsAndConditionsPage: React.FC = () => {
  const [terms, setTerms] = useState('');
  const fetchTerms = () => {
    // console.log('check for infinite loop');
    getTermsAndConditions.callPromise({})
      .then(result => setTerms(result))
      .catch(error => setTerms(`Server Error: ${error}`))
  };
  useEffect(() => { fetchTerms(); }, [terms]);

  return (
    <PageLayout id="student-terms-and-conditions-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={terms}/>
    </PageLayout>
  );
};

export default StudentTermsAndConditionsPage;
