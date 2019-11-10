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
    browser.waitForElementVisible('body', 5000);
    browser.click('#abi');
    browser.windowHandles(function (result) {
      // console.log(result);
        const newHandle = result.value[1];
        this.switchWindow(newHandle);
      });
    browser.expect.elements('.secondary a.item').count.to.equal(4); // second menu
    // browser.pause(5000);
  },
  'End tests': function (browser) {
    browser.end();
  },
};
