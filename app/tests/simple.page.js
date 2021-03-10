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
export const adminScoreboardPage = new SimplePage('forecast-page');

export const advisorHomePage = new SimplePage('advisor-home-page');
export const advisorVerificationRequestsPage = new SimplePage('advisor-verification-requests-page');
export const advisorModerationPage = new SimplePage('advisor-moderation-page');
export const advisorScoreboardPage = new SimplePage('forecast-page'); // same page as adminScoreboardPage

export const facultyHomePage = new SimplePage('faculty-home-page');

export const studentHomePage = new SimplePage('student-home-page');
export const studentDegreePlannerPage = new SimplePage('degree-planner-page');
export const studentICEPointsPage = new SimplePage('student-ice-points-page');
export const studentLevelsPage = new SimplePage('student-levels-page');
export const studentVerificationPage = new SimplePage('student-verification-page');
export const studentReviewsPage = new SimplePage('student-reviews-page');
export const studentPrivacyPage = new SimplePage('student-privacy-page');

// Common Explorer Pages
export const courseExplorerPage = new SimplePage('course-browser-view-page');
export const interestExplorerPage = new SimplePage('interest-browser-view-page');
export const careerGoalExplorerPage = new SimplePage('career-goal-browser-view-page');
export const opportunityExplorerPage = new SimplePage('explorer-opportunities-page');

// Common pages shared across different roles.
export const manageOpportunitiesPage = new SimplePage('manage-opportunities-page');
export const manageVerificationPage = new SimplePage('manage-verification-page');
export const manageReviewsPage = new SimplePage('manage-reviews-page');
export const manageStudentsPage = new SimplePage('manage-students-page');
export const forecastsPage = new SimplePage('forecasts-page');
export const communityPage = new SimplePage('community-page');
export const advisorFacultyPrivacyPage = new SimplePage('advisor-faculty-privacy-page');
