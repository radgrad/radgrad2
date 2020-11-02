import { landingPage } from './landing.page';
import { navBar } from './navbar.component';
import { signinPage } from './signin.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = {
  admin: { username: 'radgrad@hawaii.edu', password: 'foo' },
};

fixture('RadGrad localhost test with default db')
    .page('http://localhost:3200');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test admin login', async (testController) => {
  await navBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.admin.username, credentials.admin.password);
  await navBar.isLoggedIn(testController, credentials.admin.username);
});
