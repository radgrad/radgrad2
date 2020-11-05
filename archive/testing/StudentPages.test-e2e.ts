// import {
//   academicPlansExplorerSelector,
//   adminLogin,
//   cardExplorerWidgetCardSelector,
//   cardExplorerWidgetTitleSelector,
//   careerGoalsExplorerSelector,
//   coursesExplorerSelector,
//   degreesExplorerSelector,
//   explorerCareerGoalWidgetTitleSelector,
//   explorerCourseWidgetTitleSelector,
//   explorerDegreeWidgetTitleSelector,
//   explorerInterestWidgetTitleSelector,
//   explorerOpportunityWidgetTitleSelector,
//   explorerPlansWidgetTitleSelector,
//   helpAccordionSelector,
//   helpFirstParagraphSelector,
//   helpTitleSelector,
//   interestsExplorerSelector,
//   leftHandMenuSelector,
//   opportunitiesExplorerSelector,
//   secondMenuSelector,
//   selectExplorerMenuItemsSelector,
//   selectExplorerMenuSelector,
//   student2ndMenuDegreePlannerPageSelector,
//   student2ndMenuExplorerPageSelector,
//   student2ndMenuHomePageSelector,
//   student2ndMenuMentorSpacePageSelector,
//   studentAboutMePageSelector,
//   studentAboutMeWidgetTitleSelector,
//   studentAdvisorLogPageSelector,
//   studentFeedWidgetTitleSelector,
//   studentIceCompetencyColumnSelector,
//   studentIceExperienceColumnSelector,
//   studentIceInnovationColumnSelector,
//   studentIcePointsPageSelector,
//   studentIceWidgetTitleSelector,
//   studentLevelsOtherWigetTitleSelector,
//   studentLevelsPageSelector,
//   studentLevelsWidgetTitleSelector,
//   studentLogWidgetTitleSelector,
//   studentMentorSpaceAskQuestionWidgetTitleSelector, studentMentorSpaceMentorDirectoryWidgetTitleSelector,
//   studentMentorSpaceQuestionWidgetTitleSelector,
//   studentRecommendedCoursesTitleSelector,
//   studentRecommendedOpportunitiesTitleSelector,
//   studentTabbedFavoriestWidgetDetailsTabSelector,
//   studentTabbedFavoriestWidgetFavCourseTabSelector,
//   studentTabbedFavoriestWidgetFavOppTabSelector,
//   studentTabbedFavoriestWidgetFavPlanTabSelector,
//   studentTeaserWidgetTitleSelector,
//   usersExplorerSelector,
// } from '../../test-helpers/e2e';
//
// /* global fixture, test */
// fixture('Student Pages')
//   .page('http://localhost:3200')
//   .beforeEach(async (browser: any) => {
//     await adminLogin({
//       email: 'radgrad@hawaii.edu',
//       password: 'foo',
//       browser,
//     });
//   });
//
// test('Menu Bars', async (browser: any) => {
//   await browser.click('#abi');
//   await browser.expect(secondMenuSelector.count).eql(4); // second menu
//
// });
//
// test('Home Page', async (browser:any) => {
//   await browser.click('#abi');
//   await browser.click(student2ndMenuHomePageSelector);
//   // help widget
//   await browser.expect(helpTitleSelector.textContent).eql('Make the most of your home page');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('This page presents RadGrad\'s recommendations for courses and opportunities based on your interests, as well as new events in the RadGrad community.');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(leftHandMenuSelector.count).eql(5);
//   await browser.expect(studentRecommendedOpportunitiesTitleSelector.textContent).eql('RECOMMENDED opportunities · 6 ');
//   await browser.expect(studentRecommendedCoursesTitleSelector.textContent).eql('RECOMMENDED courses · 6 ');
//   await browser.expect(studentFeedWidgetTitleSelector.textContent).eql('RADGRAD COMMUNITY ACTIVITY');
//   await browser.expect(studentTeaserWidgetTitleSelector.textContent).eql(' TEASERS · 8  ');
//   // About Me Page
//   await browser.click(studentAboutMePageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('How to use the About Me Page');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('The About Me page provides your RadGrad profile and enables you to manage certain details. This information enables RadGrad to help you connect with others with similar interests and career goals, and enables the system to make better recommendations for you.');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(studentAboutMeWidgetTitleSelector.textContent).eql('ABOUT ME');
//   // ICE Points Page
//   await browser.click(studentIcePointsPageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('What\'s the deal with ICE?');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('Many students think that the only important measure of academic success is their GPA. Sadly, whether you\'re hoping to go to graduate school or just get an interesting, high paying job after graduation, a good GPA is no longer enough for you to stand out from the crowd.');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(studentIceWidgetTitleSelector.textContent).eql('YOUR ICE POINTS');
//   await browser.expect(studentIceInnovationColumnSelector.child('.segment').child('h3').textContent).eql('INNOVATION');
//   await browser.expect(studentIceCompetencyColumnSelector.child('.segment').child('h3').textContent).eql('COMPETENCY');
//   await browser.expect(studentIceExperienceColumnSelector.child('.segment').child('h3').textContent).eql('Experience');
//   // Levels Page
//   await browser.click(studentLevelsPageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('Want to level up?');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('As you progress through your degree program, RadGrad recognizes your development through six levels, represented by the colors grey, yellow, green, blue, brown, and black. The exact requirements to achieve certain levels are shrouded in mystery, but here are some hints:');
//   await browser.expect(studentLevelsWidgetTitleSelector.textContent).eql('CURRENT LEVEL');
//   await browser.expect(studentLevelsOtherWigetTitleSelector.textContent).eql('OTHER LEVEL 1 STUDENTS');
//   // Advisor Log Page
//   await browser.click(studentAdvisorLogPageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('Learn about the Advisor Meeting Log');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('Each time you meet with an ICS Advisor, they can summarize the results from your meeting as a RadGrad Advisor Log entry.');
//   await browser.expect(studentLogWidgetTitleSelector.textContent).eql('ADVISOR MEETING LOG');
// });
//
// test('Explorer Page', async (browser: any) => {
//   await browser.click('#abi');
//   await browser.click(student2ndMenuExplorerPageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('So. You want to explore?');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('The Explorer provides detailed information about Career Goals, Courses, Academic Plans, Interests, Opportunities, and Users.');
//   await browser.expect(selectExplorerMenuSelector.textContent).eql('Select ExplorerAcademic PlansCareer GoalsCoursesDegreesInterestsOpportunitiesUsers');
//   await browser.click(selectExplorerMenuSelector);
//   await browser.expect(selectExplorerMenuItemsSelector.count).eql(7);
//   await browser.click(academicPlansExplorerSelector); // Academic Plans
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('ACADEMIC PLANS · 41 ');
//   await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first plan
//   await browser.expect(explorerPlansWidgetTitleSelector.textContent).eql('B.A. IN COMPUTER SCIENCES IT FOCUS (2018)');
//   await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
//   await browser.click(careerGoalsExplorerSelector);
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('CAREER GOALS · 14 ');
//   await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first career goal
//   await browser.expect(explorerCareerGoalWidgetTitleSelector.textContent).eql('DEVOPS ENGINEER');
//   await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
//   await browser.click(coursesExplorerSelector);
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('COURSES · 30 ');
//   await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first course
//   await browser.expect(explorerCourseWidgetTitleSelector.textContent).eql('DIGITAL TOOLS (Digital Tools for the Information World)');
//   await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
//   await browser.click(degreesExplorerSelector);
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('DESIRED DEGREES · 3 ');
//   await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first degree
//   await browser.expect(explorerDegreeWidgetTitleSelector.textContent).eql('B.A. IN INFORMATION AND COMPUTER SCIENCES');
//   await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
//   await browser.click(interestsExplorerSelector);
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('INTERESTS · 41 ');
//   await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first course
//   await browser.expect(explorerInterestWidgetTitleSelector.textContent).eql('Artificial IntelligenceADD TO FAVORITES');
//   await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
//   await browser.click(opportunitiesExplorerSelector);
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('OPPORTUNITIES · 42 ');
//   await browser.click(cardExplorerWidgetCardSelector.nth(0).child('a')); // Go to first course
//   await browser.expect(explorerOpportunityWidgetTitleSelector.textContent).eql('GOOGLE SUMMER OF CODE');
//   await browser.click(selectExplorerMenuSelector); // got to open the menu before selecting the choice
//   await browser.click(usersExplorerSelector);
//   await browser.expect(cardExplorerWidgetTitleSelector.textContent).eql('USERS');
// });
//
// test('DEP Page', async (browser: any) => {
//   await browser.click('#abi');
//   await browser.click(student2ndMenuDegreePlannerPageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('Make the Degree Planner work for you!');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('The Degree Planner helps you organize your ICS Degree experience on an academic term-by-term basis. You can plan the courses you need to satisfy your chosen degree plan as well as the the extracurricular opportunities that provide you with real world experiences and chances to innovate outside the classroom. ');
//   await browser.expect(studentTabbedFavoriestWidgetFavOppTabSelector.textContent).eql(' OPPS');
//   await browser.expect(studentTabbedFavoriestWidgetFavPlanTabSelector.textContent).eql(' PLAN');
//   await browser.expect(studentTabbedFavoriestWidgetFavCourseTabSelector.textContent).eql(' COUR');
//   await browser.expect(studentTabbedFavoriestWidgetDetailsTabSelector.textContent).eql('DETAILS');
// });
//
// test('Mentor Space Page', async (browser: any) => {
//   await browser.click('#abi');
//   await browser.click(student2ndMenuMentorSpacePageSelector);
//   await browser.expect(helpTitleSelector.textContent).eql('Learn about Mentor Space');
//   await browser.click(helpAccordionSelector);
//   await browser.expect(helpFirstParagraphSelector.textContent).eql('Mentor Space enables you to connect with RadGrad mentors: ICS alumni and other high tech professionals who are volunteering their time to help get the latest information about careers and job opportunities in Hawaii and beyond.');
//   await browser.expect(studentMentorSpaceQuestionWidgetTitleSelector.textContent).eql('QUESTIONS');
//   await browser.expect(studentMentorSpaceAskQuestionWidgetTitleSelector.textContent).eql('ASK A NEW QUESTION');
//   await browser.expect(studentMentorSpaceMentorDirectoryWidgetTitleSelector.textContent).eql('MENTOR DIRECTORY');
// });
