import React, {useEffect, useState} from 'react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import PageLayout from '../PageLayout';
import {getTermsAndConditions} from '../../../api/utilities/TermsAndConditions.methods';

const headerPaneTitle = 'Terms and Conditions';
const headerPaneBody = `
Here are the terms and conditions for using RadGrad.
`;

/**
 * Student Terms and Conditions Page Processing
 *
 * The goal of this page is to display the Terms and Conditions, where Terms and Conditions are located in a file
 * on the server side, the location of which is indicated via a settings property.
 *
 * This page provides a simple example of how to display a page in React where its contents must be fetched
 * asynchronously from the server side.  Normally, we do this via publications and subscriptions, but here is a situation
 * where we need some data from the server that is not stored in a Collection!
 *
 * Therefore, the way this page needs to work is:
 *   1. The page is retrieved and displayed in the client.
 *   2. An asynchronous call is made to the server. The server loads the terms and conditions (T&C) text from a file.
 *   3. If the load is successful, the text is returned to the client and displayed. Otherwise, display an error message.
 *
 * Implementing this requires the use of Meteor Methods, useState, and useEffect.
 *
 * First, there is a Meteor Method called getTermsAndConditions. Meteor methods run on both the client and server side.
 * When it runs on the client side, it immediately returns the empty string. (This particular value is important.)
 * When it runs on the server side, it tries to load the T&C text and return it.
 *
 * Second, we have to use React's useState and useEffect hooks to invoke the Meteor Method and ensure that the page
 * is re-rendered exactly once when the Method returns.
 *
 * We use useState to create a state variable called 'terms', with initial value of the empty string. Note that whenever
 * the 'terms' variable changes value, the page will be re-rendered.
 *
 * We use useEffect to define a function that is run each time the page is rendered.  This function checks the terms
 * variable, and returns immediately if the terms variable is the empty string. In the case that the terms variable is
 * the empty string, then it invokes the fetchTerms function, which invokes the Meteor Method. The Meteor Method will
 * run immediately on the client side, but it will set the terms variable to the empty string, so that doesn't change
 * the state. Eventually the promise will return, resulting in the then() or catch() chained function calls. Hopefully
 * it's always the then() chain that gets executed, which sets the terms variable to the contents of the file on the
 * server side. Now the terms variable is not the empty string, so when useEffect is called again after the page
 * re-renders, it doesn't do call fetchTerms again.
 *
 * The final part of the design is to render the markdown section of the page with either the terms variable value (if
 * it's not the empty string), or the value of the awaitingTerms variable.  We do this so that if it takes a while
 * to get the result back from the server, the page will display "Waiting to receive terms and conditions...." while
 * waiting.
 */
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
