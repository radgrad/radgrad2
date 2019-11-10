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
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'ABOUT THE FACULTY PROFILE PAGE');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'For RadGrad to effectively "match" students with faculty, it is helpful for you to provide useful profile information.');
    browser.click('.ui.floating.info.message .accordion');
    // profile
    browser.assert.containsText('h3.ui.dividing.left.aligned.header', 'Profile');
  },
  'Faculty Verifications Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(2)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT VERIFICATION');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'Student participation in RadGrad opportunities consists of the following procedure:');
    browser.click('.ui.floating.info.message .accordion');
    // main page and left hand menu
    browser.expect.elements('.vertical.menu .item').count.to.equal(3); // left hand menu.
    browser.assert.containsText('.eleven.wide.column .segment .dividing.header', 'PENDING VERIFICATION REQUESTS');
    browser.click('.vertical.menu .item:nth-child(2)');
    browser.assert.containsText('.eleven.wide.column .segment .dividing.header', 'EVENT VERIFICATION');
    browser.click('.vertical.menu .item:nth-child(3)');
    browser.assert.containsText('.eleven.wide.column .segment .dividing.header', 'COMPLETED VERIFICATION REQUESTS');
  },
  'Faculty Manage Opportunities Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(3)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'HOW TO CREATE AND MANAGE OPPORTUNITIES');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'In RadGrad, opportunities are activities outside of regular coursework that enable students to earn "Innovation" and "Experience" points. When students pick an opportunity, they associate it with a specific academic term (Fall, Spring, or Summer).');
    browser.click('.ui.floating.info.message .accordion');
    // opportunity page
    browser.assert.containsText('.ui.padded.segment:first-child .header', 'Add Opportunity');
    browser.assert.containsText('.ui.padded.segment:nth-child(2) .header', 'YOUR OPPORTUNITIES (1)');

  },
  'Faculty Explorer Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(4)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT THE EXPLORER');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'The Explorer provides detailed information about Academic Plans, Career Goals, Courses, Degrees, Interests, and Opportunities.');
    browser.click('.ui.floating.info.message .accordion');
    // explorer menu
    browser.assert.containsText('.three.wide.column .text', 'Select Explorer');
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition .item:first-child');
    // browser.pause(2000);
  },
  'Faculty Scoreboard Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(5)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT SCOREBOARDS');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'This page allows you to see the different scoreboards. The scoreboards show how many students are participating in an entity (currently Courses and Opportunities) for a corresponding academic term.');
    browser.click('.ui.floating.info.message .accordion');
    // scoreboards
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
