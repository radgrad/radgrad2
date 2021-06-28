import { adminNavBar } from '../navbar.admin.component';
import { signinPage } from '../signin.page';
import { academicYearPage } from './academicYear.page';
import { careerGoalsPage } from './careerGoals.page';
import { coursePage } from './course.page';
import { courseInstancePage } from './courseInstance.page';
import { interestPage } from './interest.page';
import { opportunityPage } from './opportunity.page';
import { opportunityInstancePage } from './opportunityInstance.page';
import { reviewPage } from './review.page';
import { teaserPage } from './teaser.page';
import { userPage } from './user.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  admin: { userName: 'radgrad@hawaii.edu', password: 'foo' },
};

fixture('Data model UI acceptance tests').page('http://localhost:3200');

test('Test admin data model academic year page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'academic-year-instances');
  await academicYearPage.addAcademicYearInstance(testController);
  // test the academic year update
  // test the academic year delete
});

test('Test admin data model career goals page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'career-goals');
  await careerGoalsPage.addCareerGoal(testController);
  // test career-goals update
  // test career-goals delete
});

test('Test admin data model course instance page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'course-instances');
  await courseInstancePage.addCourseInstance(testController);
  // test course instance update
  // test course instance delete
});

test('Test admin data model course page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'courses');
  await coursePage.addCourse(testController);
  // test course update
  // test course delete
});

test('Test admin data model interest page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'interests');
  await interestPage.addInterest(testController);
  // test interest update
  // test interest delete
});

test('Test admin data model opportunity page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'opportunities');
  await opportunityPage.addOpportunity(testController);
  // test opportunity update
  // test opportunity delete
});

test('Test admin data model opportunity instance page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'opportunity-instances');
  await opportunityInstancePage.addOpportunityInstance(testController);
  // test opportunity update
  // test opportunity delete
});

test('Test admin data model reviews page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'reviews');
  await reviewPage.addReview(testController);
  // test review update
  // test review delete
});

test('Test admin data model teasers page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'teasers');
  await teaserPage.addTeaser(testController);
  // test review update
  // test review delete
});

test('Test admin data model users page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'users');
  await userPage.addUser(testController);
  // test review update
  // test review delete
});
