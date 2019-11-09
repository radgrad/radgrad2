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
  'Step 2 Student Home': function (browser) {
    browser.click('a.ui.basic.grey.fluid.label:nth-child(4)');
    browser.expect.elements('.secondary a.item').count.to.equal(4); // second menu
    browser.pause(2000);
  },
  'End tests': function (browser) {
    browser.end();
  },
};
