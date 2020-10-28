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
  'Advisor Home Page': function (browser) {
    browser.waitForElementVisible('body', 5000);
    browser.click('div.ui.attached.tabular.menu .item:first-child');
    browser.click('#cmoore');
    browser.windowHandles(function (result) {
      // console.log(result);
      const newHandle = result.value[1];
      this.switchWindow(newHandle);
    });
    browser.expect.elements('.secondary a.item').count.to.equal(5); // second menu
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT STUDENT CONFIGURATION');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'You can add new students and edit existing students on this page.');
    browser.click('.ui.floating.info.message .accordion');
    // page tabs
    browser.assert.containsText('h4.ui.dividing.header', 'SELECT STUDENT');
    browser.click('.ui.attached.tabular.menu .item:nth-child(2)');
    browser.assert.containsText('.active.tab h4.ui.dividing.header', 'ADD STUDENT');
    browser.click('.ui.attached.tabular.menu .item:nth-child(3)');
    browser.assert.containsText('.active.tab .ui.dividing.header', 'BULK STAR UPLOAD STAR DATA');
  },
  'Advisor Verifications Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(2)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT VERIFICATION REQUESTS');
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
  'Advisor Moderation Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(3)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT MODERATION');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'On RadGrad, students can provide public feedback with course reviews, opportunity reviews, and Mentor Space questions. To maintain a high-integrity learning environment, all of these public feedbacks require moderation.');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.ui.vertically.divided.equal.width.grid .column:first-child .header', 'PENDING COURSE REVIEWS');
    browser.assert.containsText('.ui.vertically.divided.equal.width.grid .column:nth-child(2) .header', 'PENDING OPPORTUNITY REVIEWS');
    browser.assert.containsText('.ui.vertically.divided.equal.width.grid .column:nth-child(3) .header', 'PENDING QUESTION REVIEWS');
  },
  'Advisor Academic Plan Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(4)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT ACADEMIC PLAN CONSTRUCTION');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'This page allows you to manage Academic Plans. It has two tabs: Viewer and Builder.');
    browser.click('.ui.floating.info.message .accordion');
    // plan tabs
    browser.assert.containsText('.ui.attached.tabular.menu .active.item', 'Viewer');
    browser.click('.ui.attached.tabular.menu .item:nth-child(2)');
    browser.assert.containsText('.ui.attached.tabular.menu .active.item', 'Builder');
  },
  'Advisor Scoreboard Page': function (browser) {
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
