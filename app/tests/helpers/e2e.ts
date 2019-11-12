import { ClientFunction, Selector } from 'testcafe'; // eslint-disable-line no-unused-vars

export const adminLogin = async ({ email, password, browser }) => {
  await browser.click('div.ui.top.right.pointing.dropdown div.text');
  await browser.click('#admin');
  await browser.typeText('input[name=email]', email);
  await browser.typeText('input[name=password]', password);
  await browser.click('div.field button.ui.button');
};

/* global window */
export const getPageUrl = ClientFunction(() => window.location.href);
