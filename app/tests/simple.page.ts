import { Selector } from 'testcafe';
import { PAGEIDS } from '../imports/ui/utilities/PageIDs';

/** Create an instance of a SimplePage when all you need to do is verify that the page was displayed. */
class SimplePage {
  private pageId: string;
  private pageSelector: Selector;
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

export const adminDatabasePage = new SimplePage('admin-database-page');
export const adminDataModelPage = new SimplePage('admin-data-model-page');
export const adminHomePage = new SimplePage('admin-home-page');
export const adminModerationPage = new SimplePage('admin-moderation-page');
export const adminScoreboardPage = new SimplePage(PAGEIDS.FORECASTS);

export const advisorHomePage = new SimplePage('advisor-home-page');
export const advisorVerificationRequestsPage = new SimplePage('advisor-verification-requests-page');
export const advisorModerationPage = new SimplePage('advisor-moderation-page');
export const advisorScoreboardPage = new SimplePage(PAGEIDS.FORECASTS); // same page as adminScoreboardPage

export const facultyHomePage = new SimplePage('faculty-home-page');

export const studentHomePage = new SimplePage(PAGEIDS.STUDENT_HOME);
export const studentDegreePlannerPage = new SimplePage(PAGEIDS.STUDENT_DEGREE_PLANNER);
export const studentICEPointsPage = new SimplePage(PAGEIDS.STUDENT_ICE);
export const studentLevelsPage = new SimplePage(PAGEIDS.STUDENT_LEVELS);
export const studentVerificationPage = new SimplePage(PAGEIDS.STUDENT_VERIFICATION);
export const studentReviewsPage = new SimplePage(PAGEIDS.STUDENT_REVIEWS);
export const studentVisibilityPage = new SimplePage(PAGEIDS.STUDENT_VISIBILITY);

// Common Explorer Pages
export const courseExplorerPage = new SimplePage(PAGEIDS.COURSE_BROWSER);
export const interestExplorerPage = new SimplePage(PAGEIDS.INTEREST_BROWSER);
export const careerGoalExplorerPage = new SimplePage(PAGEIDS.CAREER_GOAL_BROWSER);
export const opportunityExplorerPage = new SimplePage(PAGEIDS.OPPORTUNITY_BROWSER);

// Common pages shared across different roles.
export const manageOpportunitiesPage = new SimplePage(PAGEIDS.MANAGE_OPPORTUNITIES);
export const manageVerificationPage = new SimplePage(PAGEIDS.MANAGE_VERIFICATION);
export const manageReviewsPage = new SimplePage('manage-reviews-page');
export const manageStudentsPage = new SimplePage('manage-students-page');
export const forecastsPage = new SimplePage(PAGEIDS.FORECASTS);
export const communityPage = new SimplePage(PAGEIDS.COMMUNITY);
export const advisorFacultyVisibilityPage = new SimplePage(PAGEIDS.VISIBILITY);
