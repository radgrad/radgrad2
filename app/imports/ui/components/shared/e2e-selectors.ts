import { Selector } from 'testcafe';
import {
  cardExplorerWidget,
  explorerCareerGoalWidget,
  explorerCourseWidget,
  explorerDegreeWidget,
  explorerInterestWidget,
  explorerOpportunityWidget,
  explorerPlanWidget,
  helpPanelWidget,
  selectExplorerMenu,
  courseFilterWidget,
} from './e2e-names';

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

export const courseFilterWidgetChoicesSelector = Selector('.ui.radio.checkbox');
export const courseFilterWidgetAllChoiceSelector = courseFilterWidgetChoicesSelector.withText('All');
export const courseFilterWidget300PlusChoiceSelector = courseFilterWidgetChoicesSelector.withText('300+');
export const courseFilterWidget400PlusChoiceSelector = courseFilterWidgetChoicesSelector.withText('400+');
export const courseFilterWidget600PlusChoiceSelector = courseFilterWidgetChoicesSelector.withText('600+');
