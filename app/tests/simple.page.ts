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

export const signoutPage = new SimplePage(PAGEIDS.SIGNOUT);

export const adminDatabasePage = new SimplePage(PAGEIDS.ADMIN_DATABASE);
export const adminDataModelPage = new SimplePage(PAGEIDS.ADMIN_DATA_MODEL);
export const adminHomePage = new SimplePage(PAGEIDS.ADMIN_HOME);
export const adminModerationPage = new SimplePage(PAGEIDS.ADMIN_MODERATION);
export const adminScoreboardPage = new SimplePage(PAGEIDS.FORECASTS);

export const advisorHomePage = new SimplePage(PAGEIDS.ADVISOR_HOME);
export const advisorVerificationRequestsPage = new SimplePage(PAGEIDS.ADVISOR_VERIFICATIONS);
export const advisorModerationPage = new SimplePage(PAGEIDS.ADVISOR_MODERATION);
export const advisorScoreboardPage = new SimplePage(PAGEIDS.FORECASTS); // same page as adminScoreboardPage

export const facultyHomePage = new SimplePage(PAGEIDS.FACULTY_HOME_PAGE);

export const studentHomePage = new SimplePage(PAGEIDS.STUDENT_HOME);
export const studentDegreePlannerPage = new SimplePage(PAGEIDS.STUDENT_DEGREE_PLANNER);
export const studentICEPointsPage = new SimplePage(PAGEIDS.STUDENT_ICE);
export const studentLevelsPage = new SimplePage(PAGEIDS.STUDENT_LEVELS);
export const studentVerificationPage = new SimplePage(PAGEIDS.STUDENT_VERIFICATION);
export const studentReviewsPage = new SimplePage(PAGEIDS.STUDENT_REVIEWS);
export const studentVisibilityPage = new SimplePage(PAGEIDS.STUDENT_VISIBILITY);

// Common Explorer Pages
export const courseExplorerPage = new SimplePage(PAGEIDS.COURSE_BROWSER);
export const courseExplorerItemPage = new SimplePage(PAGEIDS.COURSE);
export const interestExplorerPage = new SimplePage(PAGEIDS.INTEREST_BROWSER);
export const interestExplorerItemPage = new SimplePage(PAGEIDS.INTEREST);
export const internshipExplorerPage = new SimplePage(PAGEIDS.INTERNSHIP_BROWSER);
export const internshipExplorerItemPage = new SimplePage(PAGEIDS.INTERNSHIP);
export const careerGoalExplorerPage = new SimplePage(PAGEIDS.CAREER_GOAL_BROWSER);
export const careerGoalExplorerItemPage = new SimplePage(PAGEIDS.CAREER_GOAL);
export const opportunityExplorerPage = new SimplePage(PAGEIDS.OPPORTUNITY_BROWSER);
export const opportunityExplorerItemPage = new SimplePage(PAGEIDS.OPPORTUNITY);

// Common pages shared across different roles.
export const manageOpportunitiesPage = new SimplePage(PAGEIDS.MANAGE_OPPORTUNITIES);
export const manageVerificationPage = new SimplePage(PAGEIDS.MANAGE_VERIFICATION);
export const manageReviewsPage = new SimplePage(PAGEIDS.MANAGE_REVIEWS);
export const manageStudentsPage = new SimplePage(PAGEIDS.MANAGE_STUDENTS);
export const forecastsPage = new SimplePage(PAGEIDS.FORECASTS);
export const communityPage = new SimplePage(PAGEIDS.COMMUNITY);
export const advisorFacultyVisibilityPage = new SimplePage(PAGEIDS.VISIBILITY);

// Landing explorer pages
export const landingCareerGoalExplorerPage = new SimplePage(PAGEIDS.LANDING_CAREER_GOALS_EXPLORER);
export const landingCareerGoalExplorerItemPage = new SimplePage(PAGEIDS.LANDING_CAREER_GOAL_EXPLORER);
export const landingCourseExplorerPage = new SimplePage(PAGEIDS.LANDING_COURSES_EXPLORER);
export const landingCourseExplorerItemPage = new SimplePage(PAGEIDS.LANDING_COURSE_EXPLORER);
export const landingInterestExplorerPage = new SimplePage(PAGEIDS.LANDING_INTERESTS_EXPLORER);
export const landingInterestExplorerItemPage = new SimplePage(PAGEIDS.LANDING_INTEREST_EXPLORER);
export const landingOpportunityExplorerPage = new SimplePage(PAGEIDS.LANDING_OPPORTUNITIES_EXPLORER);
export const landingOpportunityExplorerItemPage = new SimplePage(PAGEIDS.LANDING_OPPORTUNITY_EXPLORER);
