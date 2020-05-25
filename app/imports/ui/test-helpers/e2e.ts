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
} from '../components/shared/e2e-component-names';

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

