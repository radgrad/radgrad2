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
  'Mentor Home Page': function (browser) {
    browser.waitForElementVisible('body', 5000);
    browser.click('div.ui.attached.tabular.menu .item:nth-child(3)');
    browser.click('#rbrewer');
    browser.windowHandles(function (result) {
      // console.log(result);
      const newHandle = result.value[1];
      this.switchWindow(newHandle);
    });
    browser.expect.elements('.secondary a.item').count.to.equal(3); // second menu
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'WHY DO MENTORS NEED PROFILES?');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'Thank you for volunteering to be a RadGrad mentor!');
    browser.click('.ui.floating.info.message .accordion');
    // profile
    browser.assert.containsText('h3.ui.dividing.left.aligned.header', 'PROFILE');
  },
  'Mentor Mentor Space Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(2)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'HOW DOES MENTOR SPACE WORK?');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'Mentor Space enables students to connect with you, the RadGrad mentors: ICS alumni and other high tech professionals who are volunteering their time to help get the latest information about careers and job opportunities in Hawaii and beyond.');
    browser.click('.ui.floating.info.message .accordion');
    browser.expect.elements('.ten.wide.column').count.to.equal(1);
    browser.expect.elements('.four.wide.column').count.to.equal(1);
    browser.assert.containsText('.four.wide.column .ui.dividing.header', 'MENTOR DIRECTORY');
  },
  'Mentor Explorer Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(3)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT THE EXPLORER');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'The Explorer provides detailed information about Career Goals, Courses, Academic Plans, Interests, Opportunities, and Users.');
    browser.click('.ui.floating.info.message .accordion');
    // explorer menu
    browser.assert.containsText('.three.wide.column .text', 'Select Explorer');
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:first-child'); // ACADEMIC PLANS
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'ACADEMIC PLANS');
    browser.click('.card:first-child a.ui.button'); // Individual Explorer Page
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:nth-child(2)'); // CAREER GOALS
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'CAREER GOALS');
    browser.click('.card:first-child a.ui.button'); // Individual Explorer Page
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:nth-child(3)'); // COURSES
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'COURSES');
    browser.click('.card:first-child a.ui.button'); // Individual Explorer Page
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:nth-child(4)'); // DESIRED DEGREES
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'DESIRED DEGREES');
    browser.click('.card:first-child a.ui.button'); // Individual Explorer Page
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:nth-child(5)'); // INTERESTS
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'INTERESTS');
    browser.click('.card:first-child a.ui.button'); // Individual Explorer Page
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:nth-child(6)'); // OPPORTUNITIES
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'OPPORTUNITIES');
    browser.click('.card:first-child a.ui.button'); // Individual Explorer Page
    browser.click('.ui.fluid.selection.dropdown');
    browser.click('.visible.menu.transition a.item:nth-child(7)'); // USERS
    browser.assert.containsText('.ui.dividing.header h4 span:first-child', 'USERS');
    // browser.pause(2000);
  },
  'End tests': function (browser) {
    browser.end();
  },
};
