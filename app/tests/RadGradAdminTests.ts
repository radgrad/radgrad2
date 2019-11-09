module.exports = {
  before: function (browser) {
    browser
      .url('http://localhost:3200')
      .waitForElementVisible('body', 5000)
      .click('div.ui.top.right.pointing.dropdown div.text')
      .click('#admin')
      .setValue('input[name=email]', 'radgrad@hawaii.edu')
      .setValue('input[name=password]', 'foo')
      .click('div.field button.ui.button');
  },
  'Step 2 Check Home Page': function (browser) {
    browser.assert.containsText('div.ui.top.right.pointing.dropdown div.text', 'radgrad@hawaii.edu'); // logged in dropdown
    browser.expect.elements('.secondary a.item').count.to.equal(6); // second menu
    browser.assert.containsText('.container .segment:first-child .header', 'FILTER USERS');
    browser.assert.containsText('.container .segment:nth-child(2) .header', 'RETRIEVE USER');
  },
  'Step 3 Check Data Model Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(2)');
    browser.expect.elements('.vertical.menu .item').count.to.equal(24); // left hand menu.
    browser.assert.containsText('.message .content p', 'Click on a data model element in the menu to the left to display those items.');
  },
  'End tests': function (browser) {
    browser.end();
  },
};
