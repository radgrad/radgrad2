import { PAGEIDS } from '../imports/ui/utilities/PageIDs';
import { landingNavBar } from './navbar.landing.component';
import { signinPage } from './signin.page';
import { studentNavBar } from './navbar.student.component';
import { detailsPage } from './details.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  student: {
    abi: { userName: 'abi@hawaii.edu', password: 'foo', accountName: 'abi', fullName: 'Abigail Kealoha' },
  },
};

fixture('Explorer details page acceptance tests').page('http://localhost:3200');

test('Test the student interests details pages', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);

  await studentNavBar.gotoInterestsExplorerPage(testController);
  await detailsPage.gotoViewPageAndVerify(testController, PAGEIDS.INTEREST);
});