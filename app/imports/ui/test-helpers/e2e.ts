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
} from '../components/shared/component-names';
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
} from '../components/student/component-names';

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
