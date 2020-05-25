import {
  adminLogin,
} from '../../test-helpers/e2e';
import {
  student2ndMenuMentorSpacePageSelector,
} from './e2e-selectors';
import {
  helpAccordionSelector,
  helpFirstParagraphSelector,
  helpTitleSelector,
} from '../../components/shared/e2e-selectors';
import {
  studentMentorSpaceAskQuestionWidgetTitleSelector,
  studentMentorSpaceMentorDirectoryWidgetTitleSelector,
  studentMentorSpaceQuestionWidgetTitleSelector,
} from '../../components/student/e2e-selectors';

/* global fixture, test */
fixture('Student Mentor Space Page')
  .page('http://localhost:3200')
  .beforeEach(async (browser: any) => {
    await adminLogin({
      email: 'radgrad@hawaii.edu',
      password: 'foo',
      browser,
    });
  });

test('Help Widget', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuMentorSpacePageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('Learn about Mentor Space');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('Mentor Space enables you to connect with RadGrad mentors: ICS alumni and other high tech professionals who are volunteering their time to help get the latest information about careers and job opportunities in Hawaii and beyond.');
});
test('Page Components', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuMentorSpacePageSelector);
  await browser.expect(studentMentorSpaceQuestionWidgetTitleSelector.textContent).eql('QUESTIONS');
  await browser.expect(studentMentorSpaceAskQuestionWidgetTitleSelector.textContent).eql('ASK A NEW QUESTION');
  await browser.expect(studentMentorSpaceMentorDirectoryWidgetTitleSelector.textContent).eql('MENTOR DIRECTORY');
});
