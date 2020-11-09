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
  'Student Home Page': function (browser) {
    browser.waitForElementVisible('body', 5000);
    browser.click('#abi');
    browser.windowHandles(function (result) {
      // console.log(result);
        const newHandle = result.value[1];
        this.switchWindow(newHandle);
      });
    browser.expect.elements('.secondary a.item').count.to.equal(4); // second menu
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'MAKE THE MOST OF YOUR HOME PAGE');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'This page presents RadGrad\'s recommendations for courses and opportunities based on your interests, as well as new events in the RadGrad community.');
    browser.click('.ui.floating.info.message .accordion');
    // Home page
    browser.expect.elements('.vertical.menu .item').count.to.equal(5); // left hand menu.
    browser.expect.elements('.ten.wide.column .segment').count.to.equal(2); // Recommended opportunities and courses.
    browser.expect.elements('.six.wide.column .container').count.to.equal(2); // Recent activity and Teasers.
    browser.assert.containsText('.ten.wide.column .header h4', 'RECOMMENDED');
    browser.assert.containsText('.six.wide.column .ui.container:first-child .header', 'RADGRAD COMMUNITY ACTIVITY');
    browser.click('.vertical.menu .item:nth-child(2)'); // About Me
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'HOW TO USE THE ABOUT ME PAGE');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'The About Me page provides your RadGrad profile and enables you to manage certain details. This information enables RadGrad to help you connect with others with similar interests and career goals, and enables the system to make better recommendations for you.');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.stretched.eleven.wide.column .ui.dividing.header', 'ABOUT ME');
    browser.click('.vertical.menu .item:nth-child(3)'); // ICE Points
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'WHAT\'S THE DEAL WITH ICE?');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'Many students think that the only important measure of academic success is their GPA. Sadly, whether you\'re hoping to go to graduate school or just get an interesting, high paying job after graduation, a good GPA is no longer enough for you to stand out from the crowd.');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.stretched.eleven.wide.column .ui.dividing.header', 'YOUR ICE POINTS');
    browser.assert.containsText('.stretched.eleven.wide.column .column:first-child h3.ui.center', 'INNOVATION');
    browser.assert.containsText('.stretched.eleven.wide.column .column:nth-child(2) h3.ui.center', 'COMPETENCY');
    browser.assert.containsText('.stretched.eleven.wide.column .column:nth-child(3) h3.ui.center', 'Experience');
    browser.click('.vertical.menu .item:nth-child(5)'); // Advisor Log
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'LEARN ABOUT THE ADVISOR MEETING LOG');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'Each time you meet with an ICS Advisor, they can summarize the results from your meeting as a RadGrad Advisor Log entry.');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.stretched.eleven.wide.column h4', 'ADVISOR MEETING LOG');
  },
  'Student Explorer Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(2)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'SO. YOU WANT TO EXPLORE?');
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
  'Student Degree Planner Page': function (browser) {
    browser.click('.secondary.menu .item:nth-child(3)');
    // help widget
    browser.assert.containsText('.ui.floating.info.message .title', 'MAKE THE DEGREE PLANNER WORK FOR YOU!');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.accordion .content.active p:first-child', 'The Degree Planner helps you organize your ICS Degree experience on an academic term-by-term basis. You can plan the courses you need to satisfy your chosen degree plan as well as the the extracurricular opportunities that provide you with real world experiences and chances to innovate outside the classroom.');
    browser.click('.ui.floating.info.message .accordion');
    browser.assert.containsText('.middle.aligned.row h1', 'Degree Experience Planner');
    browser.expect.elements('.stretched.row').count.to.equal(2);
  },
  'End tests': function (browser) {
    browser.end();
  },
};
