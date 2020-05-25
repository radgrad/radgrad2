import {
  adminLogin,
} from '../../test-helpers/e2e';
import {
  student2ndMenuDegreePlannerPageSelector,
} from './e2e-selectors';
import {
  helpAccordionSelector,
  helpFirstParagraphSelector,
  helpTitleSelector,
} from '../../components/shared/e2e-selectors';
import {
  studentTabbedFavoriestWidgetFavOppTabSelector,
  studentTabbedFavoriestWidgetFavPlanTabSelector,
  studentTabbedFavoriestWidgetFavCourseTabSelector,
  studentTabbedFavoriestWidgetDetailsTabSelector,
} from '../../components/student/e2e-selectors';

/* global fixture, test */
fixture('Student Degree Planner Page')
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
  await browser.click(student2ndMenuDegreePlannerPageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('Make the Degree Planner work for you!');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('The Degree Planner helps you organize your ICS Degree experience on an academic term-by-term basis. You can plan the courses you need to satisfy your chosen degree plan as well as the the extracurricular opportunities that provide you with real world experiences and chances to innovate outside the classroom. ');
  await browser.click(helpAccordionSelector);
});

test('Page components', async (browser: any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuDegreePlannerPageSelector);
  await browser.expect(studentTabbedFavoriestWidgetFavOppTabSelector.textContent).eql(' OPPS');
  await browser.expect(studentTabbedFavoriestWidgetFavPlanTabSelector.textContent).eql(' PLAN');
  await browser.expect(studentTabbedFavoriestWidgetFavCourseTabSelector.textContent).eql(' COUR');
  await browser.expect(studentTabbedFavoriestWidgetDetailsTabSelector.textContent).eql('DETAILS');
});
