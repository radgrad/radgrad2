import { ClientFunction, Selector } from 'testcafe';

export const adminLogin = async ({ email, password, browser }) => {
  await browser.click(Selector('div.ui.top.right.pointing.dropdown').child('div.text'));
  await browser.click(Selector('#admin'));
  await browser.typeText(Selector('input[name=email]'), email);
  await browser.typeText(Selector('input[name=password]'), password);
  await browser.click(Selector('div.field button.ui.button'));
};

/* global window */
export const getPageUrl = ClientFunction(() => window.location.href);

export const secondMenuSelector = Selector('.secondary').child('a.item');
export const leftHandMenuSelector = Selector('.vertical.menu').child('.item');

export const studentHomePageSelector = leftHandMenuSelector.nth(0);
export const studentAboutMePageSelector = leftHandMenuSelector.nth(1);
export const studentIcePointsPageSelector = leftHandMenuSelector.nth(2);
export const studentLevelsPageSelector = leftHandMenuSelector.nth(3);
export const studentAdvisorLogPageSelector = leftHandMenuSelector.nth(4);

export const helpTitleSelector = Selector('#helpPanelWidget .ui.floating.info.message .title');
export const helpAccordionSelector = Selector('#helpPanelWidget .ui.floating.info.message').child('.accordion');
export const helpFirstParagraphSelector = Selector('#helpPanelWidget .accordion').child('.content.active').child('p').nth(0);
export const studentRecommendedOpportunitiesWidgetSelector = Selector('#recommendedOpportunities');
export const studentRecommendedCoursesWidgetSelector = Selector('#recommendedCourses');
