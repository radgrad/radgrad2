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
  'Faculty Home Page': function (browser) {
    browser.waitForElementVisible('body', 5000);
    browser.click('div.ui.attached.tabular.menu .item:nth-child(2)');
    browser.click('#esb');
    browser.windowHandles(function (result) {
      // console.log(result);
      const newHandle = result.value[1];
      this.switchWindow(newHandle);
    });
    browser.expect.elements('.secondary a.item').count.to.equal(5); // second menu
  },
  'End tests': function (browser) {
    browser.end();
  },
};
