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
  'Check Home Page': function (browser) {
    browser.waitForElementVisible('body', 5000);
    browser.pause(2000);
    browser.assert.containsText('div.ui.top.right.pointing.dropdown div.text', 'radgrad@hawaii.edu'); // logged in dropdown
    browser.expect.elements('.secondary a.item').count.to.equal(6); // second menu
    browser.assert.containsText('.container .segment:first-child .header', 'FILTER USERS');
    browser.assert.containsText('.container .segment:nth-child(2) .header', 'RETRIEVE USER');
  },
  'Check Data Model Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(2)');
    browser.expect.elements('.vertical.menu .item').count.to.equal(24); // left hand menu.
    browser.assert.containsText('.message .content p', 'Click on a data model element in the menu to the left to display those items.');
    browser.click('.vertical.menu .item:nth-child(4)'); // advisor logs
    browser.assert.containsText('.column .segment:first-child .header', 'Add Advisor Log');
    browser.assert.containsText('.column .segment:nth-child(2) .header', 'AdvisorLogCollection (7)');
    browser.click('div.ui.grid div.accordion.ui.fluid.styled:nth-child(2)');
    browser.assert.containsText('div.content.active p:nth-child(2)', 'Gerald Lau');
    browser.click('div.content.active p button:first-child');
    browser.assert.containsText('form.ui.form div div.field label', 'Text');
  },
  'Check Database Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(3)');
    browser.expect.elements('.vertical.menu .item').count.to.equal(2); // left hand menu.
    browser.assert.containsText('div.ui.floating.message', 'Click on a page in the menu to the left.');
    browser.click('.vertical.menu .item:first-child');
    browser.assert.containsText('div.eleven.wide.column form button', 'Check Integrity');
    browser.click('.vertical.menu .item:nth-child(2)');
    browser.assert.containsText('div.eleven.wide.column form button:first-child', 'Dump Database');
    browser.assert.containsText('div.eleven.wide.column form button:nth-child(2)', 'Get Student Emails');
  },
  'Check Moderation Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(4)');
    browser.assert.containsText('div.ui.vertically.divided.equal.width.grid .column:first-child .header', 'PENDING COURSE REVIEWS');
    browser.assert.containsText('div.ui.vertically.divided.equal.width.grid .column:nth-child(2) .header', 'PENDING OPPORTUNITY REVIEWS');
    browser.assert.containsText('div.ui.vertically.divided.equal.width.grid .column:nth-child(3) .header', 'PENDING QUESTION REVIEWS');
  },
  'Check Analytics Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(5)');
  },
  'Check Scoreboard Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(6)');
    browser.expect.elements('.vertical.menu .item').count.to.equal(2); // left hand menu.
    browser.assert.containsText('div.thirteen.wide.column .message', 'Choose a scoreboard from the menu to the left.');
    browser.click('.vertical.menu .item:first-child');
    browser.assert.containsText('div.thirteen.wide.column .header', 'Future Course Scoreboard');
    browser.click('.vertical.menu .item:nth-child(2)');
    browser.assert.containsText('div.thirteen.wide.column .header', 'Future Opportunity Scoreboard');
  },
  'End tests': function (browser) {
    browser.end();
  },
};
