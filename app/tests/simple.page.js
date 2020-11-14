import { Selector } from 'testcafe';

/** Create an instance of a SimplePage when all you need to do is verify that the page was displayed. */
class SimplePage {
  constructor(id) {
    this.pageId = `#${id}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const signoutPage = new SimplePage('signout-page');

export const adminAnalyticsPage = new SimplePage('admin-analytics-page');
export const adminDatabasePage = new SimplePage('admin-database-page');
export const adminDataModelPage = new SimplePage('admin-data-model-page');
export const adminHomePage = new SimplePage('admin-home-page');
export const adminModerationPage = new SimplePage('admin-moderation-page');
export const adminScoreboardPage = new SimplePage('scoreboard-page');

export const advisorHomePage = new SimplePage('advisor-home-page');
export const advisorVerificationRequestsPage = new SimplePage('advisor-verification-requests-page');
export const advisorModerationPage = new SimplePage('advisor-moderation-page');
export const advisorAcademicPlanPage = new SimplePage('advisor-academic-plan-page');
export const advisorScoreboardPage = new SimplePage('scoreboard-page'); // same page as adminScoreboardPage

export const facultyHomePage = new SimplePage('faculty-home-page');
export const facultyVerificationPage = new SimplePage('faculty-verification-page');
export const facultyManageOpportunitiesPage = new SimplePage('faculty-manage-opportunities-page');

export const studentAcademicPlansExplorerPage = new SimplePage('plans-explorer-page');
export const studentCareerGoalsExplorerPage = new SimplePage('career-goals-explorer-page');
export const studentCoursesExplorerPage = new SimplePage('courses-explorer-page');
export const studentDegreePlannerPage = new SimplePage('degree-planner-page');
export const studentInterestsExplorerPage = new SimplePage('interests-explorer-page');
export const studentOpportunitiesPage = new SimplePage('student-opportunities-page');
export const studentCommunityUsersPage = new SimplePage('community-users-page');
export const studentCommunityRadGradVideosPage = new SimplePage('community-radgrad-videos-page');
export const studentAboutMePage = new SimplePage('student-about-me-page');
export const studentICEPointsPage = new SimplePage('student-ice-points-page');
export const studentLevelsPage = new SimplePage('student-levels-page');
export const studentAdvisorLogPage = new SimplePage('student-advisor-log-page');
