import { ClientFunction, Selector } from 'testcafe';
import {
  cardExplorerWidget,
  explorerCareerGoalWidget,
  explorerCourseWidget,
  explorerDegreeWidget,
  explorerInterestWidget,
  explorerOpportunityWidget,
  explorerPlanWidget,
  firstMenu,
  helpPanelWidget,
  leftHandMenu,
  secondMenu,
  selectExplorerMenu,
} from '../components/shared/shared-widget-names';
import {
  recommendedOpportunities,
  recommendedCourses,
  studentFeedWidget,
  studentTeaserWidget,
  studentAboutMeWidget,
  studentIceWidget,
  studentLevelsWidget,
  studentLevelsOthersWidget,
  studentLogWidget,
  studentDepWidget,
  tabbedFavoritesWidget,
  studentMentorSpaceQuestionsWidget,
  studentMentorSpaceAskQuestionWidget,
  studentMentorSpaceMentorDirectoryWidget,
} from '../components/student/student-widget-names';

export const adminLogin = async ({ email, password, browser }) => {
  await browser.click(Selector('div.ui.top.right.pointing.dropdown').child('div.text'));
  await browser.click(Selector('#admin'));
  await browser.typeText(Selector('input[name=email]'), email);
  await browser.typeText(Selector('input[name=password]'), password);
  await browser.click(Selector('div.field button.ui.button'));
};

/* global window */
export const getPageUrl = ClientFunction(() => window.location.href);

export const firstMenuSelector = Selector(`#${firstMenu}`);
export const secondMenuSelector = Selector(`#${secondMenu}`).child('a.item');
export const leftHandMenuSelector = Selector(`#${leftHandMenu}`).child('.item');

/* ======== SHARED ======== */
export const helpTitleSelector = Selector(`#${helpPanelWidget} .ui.floating.info.message .title`);
export const helpAccordionSelector = Selector(`#${helpPanelWidget} .ui.floating.info.message`).child('.accordion');
export const helpFirstParagraphSelector = Selector(`#${helpPanelWidget} .accordion`).child('.content.active').child('p').nth(0);
export const selectExplorerMenuSelector = Selector(`#${selectExplorerMenu}`);
export const selectExplorerMenuItemsSelector = selectExplorerMenuSelector.child('.visible.menu.transition').child('.item');
export const academicPlansExplorerSelector = selectExplorerMenuItemsSelector.nth(0);
export const careerGoalsExplorerSelector = selectExplorerMenuItemsSelector.nth(1);
export const coursesExplorerSelector = selectExplorerMenuItemsSelector.nth(2);
export const degreesExplorerSelector = selectExplorerMenuItemsSelector.nth(3);
export const interestsExplorerSelector = selectExplorerMenuItemsSelector.nth(4);
export const opportunitiesExplorerSelector = selectExplorerMenuItemsSelector.nth(5);
export const usersExplorerSelector = selectExplorerMenuItemsSelector.nth(6);
export const cardExplorerWidgetSelector = Selector(`#${cardExplorerWidget}`);
export const cardExplorerWidgetTitleSelector = cardExplorerWidgetSelector.child('.header').child('h4');
export const cardExplorerWidgetCardSelector = cardExplorerWidgetSelector.child('.two.cards').child('.radgrad-interest-card');
export const explorerPlansWidgetSelector = Selector(`#${explorerPlanWidget}`);
export const explorerPlansWidgetTitleSelector = explorerPlansWidgetSelector.child('.container').child('.segment')
  .child('.header');
export const explorerPlansWidgetFavoriteButtonSelector = explorerPlansWidgetSelector.child('.container').child('.segment')
  .child('.button');
export const explorerCareerGoalWidgetSelector = Selector(`#${explorerCareerGoalWidget}`);
export const explorerCareerGoalWidgetTitleSelector = explorerCareerGoalWidgetSelector.child('.column').child('.segment')
  .child('.vertical.segment').child('.row')
  .child('.header');
export const explorerCourseWidgetSelector = Selector(`#${explorerCourseWidget}`);
export const explorerCourseWidgetTitleSelector = explorerCourseWidgetSelector.child('.segments').child('.segment.container')
  .child('.clearing.segment').child('h4');
export const explorerDegreeWidgetSelector = Selector(`#${explorerDegreeWidget}`);
export const explorerDegreeWidgetTitleSelector = explorerDegreeWidgetSelector.child('.container').child('.segment')
  .child('.clearing.segment').child('h4');
export const explorerInterestWidgetSelector = Selector(`#${explorerInterestWidget}`);
export const explorerInterestWidgetTitleSelector = explorerInterestWidgetSelector.child('.segments').child('.segment')
  .child('.header');
export const explorerOpportunityWidgetSelector = Selector(`#${explorerOpportunityWidget}`);
export const explorerOpportunityWidgetTitleSelector = explorerOpportunityWidgetSelector.child('.segments')
  .child('.segment').child('.clearing.segment').child('h4');

/* ======== STUDENT ======== */
export const student2ndMenuHomePageSelector = secondMenuSelector.nth(0);
export const student2ndMenuExplorerPageSelector = secondMenuSelector.nth(1);
export const student2ndMenuDegreePlannerPageSelector = secondMenuSelector.nth(2);
export const student2ndMenuMentorSpacePageSelector = secondMenuSelector.nth(3);

export const studentHomePageSelector = leftHandMenuSelector.nth(0);
export const studentAboutMePageSelector = leftHandMenuSelector.nth(1);
export const studentIcePointsPageSelector = leftHandMenuSelector.nth(2);
export const studentLevelsPageSelector = leftHandMenuSelector.nth(3);
export const studentAdvisorLogPageSelector = leftHandMenuSelector.nth(4);

export const studentRecommendedOpportunitiesWidgetSelector = Selector(`#${recommendedOpportunities}`);
export const studentRecommendedOpportunitiesTitleSelector = studentRecommendedOpportunitiesWidgetSelector.child('.header').child('h4');
export const studentRecommendedCoursesWidgetSelector = Selector(`#${recommendedCourses}`);
export const studentRecommendedCoursesTitleSelector = studentRecommendedCoursesWidgetSelector.child('.header').child('h4');
export const studentFeedWidgetSelector = Selector(`#${studentFeedWidget}`);
export const studentFeedWidgetTitleSelector = studentFeedWidgetSelector.child('.segment').child('.header');
export const studentTeaserWidgetSelector = Selector(`#${studentTeaserWidget}`);
export const studentTeaserWidgetTitleSelector = studentTeaserWidgetSelector.child('.segment').child('.header').child('h4');
export const studentAboutMeWidgetSelector = Selector(`#${studentAboutMeWidget}`);
export const studentAboutMeWidgetTitleSelector = studentAboutMeWidgetSelector.child('.container').child('.header');
export const studentIceWidgetSelector = Selector(`#${studentIceWidget}`);
export const studentIceWidgetTitleSelector = studentIceWidgetSelector.child('.header');
export const studentIceInnovationColumnSelector = studentIceWidgetSelector.child('.grid').child('.column').nth(0);
export const studentIceCompetencyColumnSelector = studentIceWidgetSelector.child('.grid').child('.column').nth(1);
export const studentIceExperienceColumnSelector = studentIceWidgetSelector.child('.grid').child('.column').nth(2);
export const studentLevelsWidgetSelector = Selector(`#${studentLevelsWidget}`);
export const studentLevelsWidgetTitleSelector = studentLevelsWidgetSelector.child('h4');
export const studentLevelsOtherWidgetSelector = Selector(`#${studentLevelsOthersWidget}`);
export const studentLevelsOtherWigetTitleSelector = studentLevelsOtherWidgetSelector.child('h4');
export const studentLogWidgetSelector = Selector(`#${studentLogWidget}`);
export const studentLogWidgetTitleSelector = studentLogWidgetSelector.child('.segment').child('h4');

export const studentDepWidgetSelector = Selector(`#${studentDepWidget}`);
export const studentTabbedFavoritesWidgetSelector = Selector(`#${tabbedFavoritesWidget}`);
export const studentTabbedFavoritesWidgetFaveTabSelector = studentTabbedFavoritesWidgetSelector.child('div')
  .child('.tabular.menu').child('.item');
export const studentTabbedFavoriestWidgetFavOppTabSelector = studentTabbedFavoritesWidgetFaveTabSelector.nth(0);
export const studentTabbedFavoriestWidgetFavPlanTabSelector = studentTabbedFavoritesWidgetFaveTabSelector.nth(1);
export const studentTabbedFavoriestWidgetFavCourseTabSelector = studentTabbedFavoritesWidgetFaveTabSelector.nth(2);
export const studentTabbedFavoriestWidgetDetailsTabSelector = studentTabbedFavoritesWidgetFaveTabSelector.nth(3);

export const studentMentorSpaceQuestionsWidgetSelector = Selector(`#${studentMentorSpaceQuestionsWidget}`);
export const studentMentorSpaceQuestionWidgetTitleSelector = studentMentorSpaceQuestionsWidgetSelector.child('.header').child('h4');
export const studentMentorSpaceAskQuestionWidgetSelector = Selector(`#${studentMentorSpaceAskQuestionWidget}`);
export const studentMentorSpaceAskQuestionWidgetTitleSelector = studentMentorSpaceAskQuestionWidgetSelector.child('.header').child('h4');
export const studentMentorSpaceMentorDirectoryWidgetSelector = Selector(`#${studentMentorSpaceMentorDirectoryWidget}`);
export const studentMentorSpaceMentorDirectoryWidgetTitleSelector = studentMentorSpaceMentorDirectoryWidgetSelector.child('.header').child('h4');
