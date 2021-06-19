// import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';
// import { landingNavBar } from '../navbar.landing.component';
import { adminNavBar } from '../navbar.admin.component';
import { signinPage } from '../signin.page';
import { academicYearPage } from './academicYear.page';
import { coursePage } from './course.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  admin: { userName: 'radgrad@hawaii.edu', password: 'foo' },
};

fixture('Data model UI acceptance tests').page('http://localhost:3200');

test('Test admin data model pages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'academic-year-instances');
  await academicYearPage.addAcademicYearInstance(testController);
  // test the academic year update
  // test the academic year delete
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'courses');
  coursePage.addCourse(testController);
});
