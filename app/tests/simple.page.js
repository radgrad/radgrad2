import { Selector } from 'testcafe';

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

export const adminAnalyticsPage = new SimplePage('admin-analytics-page');
export const adminDatabasePage = new SimplePage('admin-database-page');
export const adminDataModelPage = new SimplePage('admin-data-model-page');
export const adminHomePage = new SimplePage('admin-home-page');
export const adminModerationPage = new SimplePage('admin-moderation-page');
export const adminScoreboardPage = new SimplePage('scoreboard-page');

export const studentAcademicPlansExplorerPage = new SimplePage('plans-explorer-page');
export const studentCareerGoalsExplorerPage = new SimplePage('career-goals-explorer-page');
export const studentCoursesExplorerPage = new SimplePage('courses-explorer-page');
export const studentDegreePlannerPage = new SimplePage('degree-planner-page');
export const studentInterestsExplorerPage = new SimplePage('interests-explorer-page');
export const studentOpportunitiesPage = new SimplePage('student-opportunities-page');
