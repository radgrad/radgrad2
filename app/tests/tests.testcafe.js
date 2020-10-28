import { landingPage } from './landing.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
// const credentials = { username: 'johnson@hawaii.edu', password: 'foo', firstName: 'Philip', lastName: 'Johnson' };

fixture('RadGrad localhost test with default db')
    .page('http://localhost:3200');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});
