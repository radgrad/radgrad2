import { Selector } from 'testcafe'; // eslint-disable-line no-unused-vars
import {
  adminLogin,
  helpAccordionSelector, helpFirstParagraphSelector,
  helpTitleSelector, leftHandMenuSelector,
  secondMenuSelector, studentRecommendedOpportunitiesWidgetSelector,
} from '../../test-helpers/e2e';

/* global fixture, test */
fixture('Student Pages')
  .page('http://localhost:3200')
  .beforeEach(async (browser: any) => {
    await adminLogin({
      email: 'radgrad@hawaii.edu',
      password: 'foo',
      browser,
    });
  });

test('Home Page', async (browser:any) => {
  await browser.click('#abi');
  await browser.expect(secondMenuSelector.count).eql(4); // second menu
  // help widget
  await browser.expect(helpTitleSelector.textContent).eql('Make the most of your home page');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('This page presents RadGrad\'s recommendations for courses and opportunities based on your interests, as well as new events in the RadGrad community.');
  await browser.click(helpAccordionSelector);
  await browser.expect(leftHandMenuSelector.count).eql(5);
  await browser.expect(studentRecommendedOpportunitiesWidgetSelector.textContent);
});
