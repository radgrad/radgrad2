import { Selector } from 'testcafe'; // eslint-disable-line no-unused-vars
import { adminLogin } from '../../../../tests/helpers/e2e';

/* global fixture, test */
fixture('Admin Pages')
  .page('http://localhost:3200')
  .beforeEach(async (browser: any) => {
    await adminLogin({
      email: 'radgrad@hawaii.edu',
      password: 'foo',
      browser,
    });
  });

test('Home Page', async (browser:any) => {
  const name = Selector('div.ui.top.right.pointing.dropdown div.text');
  await browser.expect(name.textContent).eql('radgrad@hawaii.edu');
  await browser.expect(Selector('.secondary').child('a.item').count).eql(6);
  await browser.expect(Selector('.container').child('.segment').nth(0).child('.header').textContent).eql('FILTER USERS');
  await browser.expect(Selector('.container').child('.segment').nth(1).child('.header').textContent).eql('RETRIEVE USER');
});

test('Datamodel Page', async (browser: any) => {
  await browser.click(Selector('.secondary.menu').child('.item').nth(1));
  await browser.expect(Selector('.vertical.menu').child('.item').count).eql(24);
  await browser.expect(Selector('.message').child('.content').child('p').textContent).eql('Click on a data model element in the menu to the left to display those items.');
  await browser.click(Selector('.vertical.menu').child('.item').nth(3)); // advisor logs
  await browser.expect(Selector('.column').child('.segment').nth(0).child('.header').textContent).eql('Add Advisor Log');
  await browser.expect(Selector('.column').child('.segment').nth(1).child('.header').textContent).eql('AdvisorLogCollection (7)');
  await browser.click(Selector('.ui.grid').child('.accordion.ui.fluid.styled').nth(1));
  await browser.expect(Selector('.content.active').child('p').nth(0).textContent).eql('Gerald Lau');
  await browser.click(Selector('.content.active').child('p').child('button').nth(0));
  await browser.expect(Selector('.ui.form').child('div').child('.field').child('label').textContent).eql('Text');
});
