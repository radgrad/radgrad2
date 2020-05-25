import {
  adminLogin,
  leftHandMenuSelector,
  secondMenuSelector,
} from '../../test-helpers/e2e';
import {
  student2ndMenuHomePageSelector,
  studentAboutMePageSelector,
  studentAdvisorLogPageSelector,
  studentIcePointsPageSelector,
  studentLevelsPageSelector,
} from './e2e-selectors';
import {
  helpAccordionSelector,
  helpFirstParagraphSelector,
  helpTitleSelector,
} from '../../components/shared/e2e-selectors';
import {
  studentAboutMeWidgetTitleSelector,
  studentFeedWidgetTitleSelector,
  studentIceCompetencyColumnSelector,
  studentIceExperienceColumnSelector,
  studentIceInnovationColumnSelector,
  studentIceWidgetTitleSelector,
  studentLevelsOtherWigetTitleSelector,
  studentLevelsWidgetTitleSelector,
  studentLogWidgetTitleSelector,
  studentRecommendedCoursesTitleSelector,
  studentRecommendedOpportunitiesTitleSelector,
  studentTeaserWidgetTitleSelector,
} from '../../components/student/e2e-selectors';

/* global fixture, test */
fixture('Student Home Page')
  .page('http://localhost:3200')
  .beforeEach(async (browser: any) => {
    await adminLogin({
      email: 'radgrad@hawaii.edu',
      password: 'foo',
      browser,
    });
  });

test('Menu Bars', async (browser: any) => {
  await browser.click('#abi');
  await browser.expect(secondMenuSelector.count).eql(4); // second menu
});

test('Help Widget', async (browser:any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuHomePageSelector);
  // help widget
  await browser.expect(helpTitleSelector.textContent).eql('Make the most of your home page');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('This page presents RadGrad\'s recommendations for courses and opportunities based on your interests, as well as new events in the RadGrad community.');
  await browser.click(helpAccordionSelector);
});

test('Home Page', async (browser:any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuHomePageSelector);
  // Home Page
  await browser.expect(leftHandMenuSelector.count).eql(5);
  await browser.expect(studentRecommendedOpportunitiesTitleSelector.textContent).contains('RECOMMENDED opportunities');
  await browser.expect(studentRecommendedCoursesTitleSelector.textContent).contains('RECOMMENDED courses');
  await browser.expect(studentFeedWidgetTitleSelector.textContent).eql('RADGRAD COMMUNITY ACTIVITY');
  await browser.expect(studentTeaserWidgetTitleSelector.textContent).contains('TEASERS');
});

test('About Me Page', async (browser:any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuHomePageSelector);
  // About Me Page
  await browser.click(studentAboutMePageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('How to use the About Me Page');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('The About Me page provides your RadGrad profile and enables you to manage certain details. This information enables RadGrad to help you connect with others with similar interests and career goals, and enables the system to make better recommendations for you.');
  await browser.click(helpAccordionSelector);
  await browser.expect(studentAboutMeWidgetTitleSelector.textContent).eql('ABOUT ME');
});

test('ICE Points Page', async (browser:any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuHomePageSelector);
  // ICE Points Page
  await browser.click(studentIcePointsPageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('What\'s the deal with ICE?');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('Many students think that the only important measure of academic success is their GPA. Sadly, whether you\'re hoping to go to graduate school or just get an interesting, high paying job after graduation, a good GPA is no longer enough for you to stand out from the crowd.');
  await browser.click(helpAccordionSelector);
  await browser.expect(studentIceWidgetTitleSelector.textContent).eql('YOUR ICE POINTS');
  await browser.expect(studentIceInnovationColumnSelector.child('.segment').child('h3').textContent).eql('INNOVATION');
  await browser.expect(studentIceCompetencyColumnSelector.child('.segment').child('h3').textContent).eql('COMPETENCY');
  await browser.expect(studentIceExperienceColumnSelector.child('.segment').child('h3').textContent).eql('Experience');
});
test('Levels Page', async (browser:any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuHomePageSelector);
  // Levels Page
  await browser.click(studentLevelsPageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('Want to level up?');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('As you progress through your degree program, RadGrad recognizes your development through six levels, represented by the colors grey, yellow, green, blue, brown, and black. The exact requirements to achieve certain levels are shrouded in mystery, but here are some hints:');
  await browser.expect(studentLevelsWidgetTitleSelector.textContent).eql('CURRENT LEVEL');
  await browser.expect(studentLevelsOtherWigetTitleSelector.textContent).contains('OTHER LEVEL');
});

test('About Me Page', async (browser:any) => {
  await browser.click('#abi');
  await browser.click(student2ndMenuHomePageSelector);
  // Advisor Log Page
  await browser.click(studentAdvisorLogPageSelector);
  await browser.expect(helpTitleSelector.textContent).eql('Learn about the Advisor Meeting Log');
  await browser.click(helpAccordionSelector);
  await browser.expect(helpFirstParagraphSelector.textContent).eql('Each time you meet with an ICS Advisor, they can summarize the results from your meeting as a RadGrad Advisor Log entry.');
  await browser.expect(studentLogWidgetTitleSelector.textContent).eql('ADVISOR MEETING LOG');
});
