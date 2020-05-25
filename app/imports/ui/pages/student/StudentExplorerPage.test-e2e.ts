import {
  adminLogin,
} from '../../test-helpers/e2e';
import {
  student2ndMenuExplorerPageSelector,
} from './e2e-selectors';
import {
  academicPlansExplorerSelector,
  cardExplorerWidgetCardSelector,
  cardExplorerWidgetTitleSelector,
  careerGoalsExplorerSelector,
  coursesExplorerSelector,
  degreesExplorerSelector,
  explorerCareerGoalWidgetTitleSelector,
  explorerCourseWidgetTitleSelector,
  explorerDegreeWidgetTitleSelector,
  explorerInterestWidgetTitleSelector,
  explorerOpportunityWidgetTitleSelector,
  explorerPlansWidgetTitleSelector,
  helpAccordionSelector,
  helpFirstParagraphSelector,
  helpTitleSelector,
  interestsExplorerSelector,
  opportunitiesExplorerSelector,
  selectExplorerMenuItemsSelector,
  selectExplorerMenuSelector,
  usersExplorerSelector,
} from '../../components/shared/e2e-selectors';
/* global fixture, test */
fixture('Student Explorer Page')
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
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('So. You want to explore?');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('The Explorer provides detailed information about Career Goals, Courses, Academic Plans, Interests, Opportunities, and Users.');
  await browser.click(helpAccordionSelector);
});

test('Base Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.expect(selectExplorerMenuSelector.textContent).eql('Select ExplorerAcademic PlansCareer GoalsCoursesDegreesInterestsOpportunitiesUsers');
  await browser.click(selectExplorerMenuSelector);
  await browser.expect(selectExplorerMenuItemsSelector.count).eql(7);
});
test('Academic Plans Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(academicPlansExplorerSelector); // Academic Plans
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).contains('ACADEMIC PLANS');
  await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first plan
  await browser.expect(explorerPlansWidgetTitleSelector.textContent).eql('B.A. IN COMPUTER SCIENCES IT FOCUS (2019)');
});
test('Career Goals Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(careerGoalsExplorerSelector);
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).contains('CAREER GOALS');
  await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first career goal
  await browser.expect(explorerCareerGoalWidgetTitleSelector.textContent).eql('DEVOPS ENGINEER');
});
test('Course Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(coursesExplorerSelector);
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).contains('COURSES');
  await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first course
  await browser.expect(explorerCourseWidgetTitleSelector.textContent).eql('INTRODUCTION TO COMPUTER AND NETWORK SECURITY (Introduction to Computer and Network Security)');
});
test('Desired Degree Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(degreesExplorerSelector);
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).contains('DESIRED DEGREES');
  await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first degree
  await browser.expect(explorerDegreeWidgetTitleSelector.textContent).eql('B.A. IN INFORMATION AND COMPUTER SCIENCES');
});
test('Interest Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(interestsExplorerSelector);
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).contains('INTERESTS');
  await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first interest
  await browser.expect(explorerInterestWidgetTitleSelector.textContent).eql('AngularADD TO FAVORITES');
});
test('Opportunity Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(opportunitiesExplorerSelector);
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).contains('OPPORTUNITIES');
  await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first opportunity
  await browser.expect(explorerOpportunityWidgetTitleSelector.textContent).eql('ACM ICPC');
});
test('User Explorer Page', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuExplorerPageSelector);
  await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
  await browser.click(usersExplorerSelector);
  await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('USERS');
});
