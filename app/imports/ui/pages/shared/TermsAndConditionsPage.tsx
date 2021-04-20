import React, { useEffect, useState } from 'react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { getTermsAndConditions } from '../../../api/utilities/TermsAndConditions.methods';

const headerPaneTitle = 'Terms and Conditions';
const headerPaneBody = `
Here are the terms and conditions for using RadGrad.
`;

/** See https://www.radgrad.org/docs/developers/patterns/components-methods for documentation. */
const TermsAndConditionsPage: React.FC = () => {
  const [terms, setTerms] = useState('');
  const fetchTerms = () => {
    // console.log('check for infinite loop');
    getTermsAndConditions.callPromise({})
      .then(result => setTerms(result))
      .catch(error => setTerms(`Server Error: ${error}`));
  };
  useEffect(() => { fetchTerms(); }, [terms]);

  return (
    <PageLayout id={PAGEIDS.TERMS_AND_CONDITIONS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={terms}/>
    </PageLayout>
  );
};

export default TermsAndConditionsPage;
