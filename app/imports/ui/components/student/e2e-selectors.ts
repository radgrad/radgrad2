import { Selector } from 'testcafe';
import {
  recommendedCourses,
  recommendedOpportunities,
  studentAboutMeWidget,
  studentDepWidget,
  studentFeedWidget,
  studentIceWidget,
  studentLevelsOthersWidget,
  studentLevelsWidget,
  studentLogWidget,
  studentMentorSpaceAskQuestionWidget,
  studentMentorSpaceMentorDirectoryWidget,
  studentMentorSpaceQuestionsWidget,
  studentTeaserWidget,
  tabbedFavoritesWidget,
} from './e2e-component-names';

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
