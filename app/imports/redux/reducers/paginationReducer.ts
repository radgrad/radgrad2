import { IPagination } from '../../typings/radgrad';
import {
  SET_ACADEMIC_PLANS_SHOW_COUNT,
  SET_ACADEMIC_PLANS_SHOW_INDEX,
  SET_ACADEMIC_TERMS_SHOW_COUNT,
  SET_ACADEMIC_TERMS_SHOW_INDEX,
  SET_ACADEMIC_YEARS_SHOW_COUNT,
  SET_ACADEMIC_YEARS_SHOW_INDEX,
  SET_ADVISOR_LOGS_SHOW_COUNT,
  SET_ADVISOR_LOGS_SHOW_INDEX,
  SET_CAREER_GOALS_SHOW_COUNT,
  SET_CAREER_GOALS_SHOW_INDEX,
  SET_COURSE_INSTANCES_SHOW_COUNT,
  SET_COURSE_INSTANCES_SHOW_INDEX,
  SET_COURSES_SHOW_COUNT,
  SET_COURSES_SHOW_INDEX,
  SET_DESIRED_DEGREES_SHOW_COUNT,
  SET_DESIRED_DEGREES_SHOW_INDEX,
  SET_FEEDBACK_INSTANCES_SHOW_COUNT,
  SET_FEEDBACK_INSTANCES_SHOW_INDEX,
  SET_FEEDS_SHOW_COUNT,
  SET_FEEDS_SHOW_INDEX,
  SET_HELP_MESSAGES_SHOW_COUNT,
  SET_HELP_MESSAGES_SHOW_INDEX,
  SET_INTEREST_TYPES_SHOW_COUNT,
  SET_INTEREST_TYPES_SHOW_INDEX,
  SET_INTERESTS_SHOW_COUNT,
  SET_INTERESTS_SHOW_INDEX,
  SET_MENTOR_ANSWERS_SHOW_COUNT,
  SET_MENTOR_ANSWERS_SHOW_INDEX,
  SET_MENTOR_QUESTIONS_SHOW_COUNT,
  SET_MENTOR_QUESTIONS_SHOW_INDEX,
  SET_OPPORTUNITIES_SHOW_COUNT,
  SET_OPPORTUNITIES_SHOW_INDEX,
  SET_OPPORTUNITY_INSTANCES_SHOW_COUNT,
  SET_OPPORTUNITY_INSTANCES_SHOW_INDEX,
  SET_OPPORTUNITY_TYPES_SHOW_COUNT,
  SET_OPPORTUNITY_TYPES_SHOW_INDEX,
  SET_PLAN_CHOICES_SHOW_COUNT,
  SET_PLAN_CHOICES_SHOW_INDEX,
  SET_REVIEWS_SHOW_COUNT,
  SET_REVIEWS_SHOW_INDEX,
  SET_SLUGS_SHOW_COUNT,
  SET_SLUGS_SHOW_INDEX,
  SET_TEASERS_SHOW_COUNT,
  SET_TEASERS_SHOW_INDEX,
  SET_VERIFICATION_REQUESTS_SHOW_COUNT,
  SET_VERIFICATION_REQUESTS_SHOW_INDEX,
} from '../actions/paginationActionTypes';

export function paginationReducer(state: IPagination = {}, action) {
  // console.log('paginationReducer state=%o, action=%o', state, action);
  let collect;
  let s: IPagination;
  switch (action.type) {
    case SET_ACADEMIC_PLANS_SHOW_INDEX:
      collect = state.AcademicPlanCollection;
      s = {
        ...state,
        AcademicPlanCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_PLANS_SHOW_COUNT:
      collect = state.AcademicPlanCollection;
      s = {
        ...state,
        AcademicPlanCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_TERMS_SHOW_INDEX:
      collect = state.AcademicTermCollection;
      s = {
        ...state,
        AcademicTermCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_TERMS_SHOW_COUNT:
      collect = state.AcademicTermCollection;
      s = {
        ...state,
        AcademicTermCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_YEARS_SHOW_INDEX:
      collect = state.AcademicYearInstanceCollection;
      s = {
        ...state,
        AcademicYearInstanceCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_YEARS_SHOW_COUNT:
      collect = state.AcademicYearInstanceCollection;
      s = {
        ...state,
        AcademicYearInstanceCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_ADVISOR_LOGS_SHOW_INDEX:
      collect = state.AdvisorLogCollection;
      s = {
        ...state,
        AdvisorLogCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ADVISOR_LOGS_SHOW_COUNT:
      collect = state.AdvisorLogCollection;
      s = {
        ...state,
        AdvisorLogCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_CAREER_GOALS_SHOW_INDEX:
      collect = state.CareerGoalCollection;
      s = {
        ...state,
        CareerGoalCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_CAREER_GOALS_SHOW_COUNT:
      collect = state.CareerGoalCollection;
      s = {
        ...state,
        CareerGoalCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_COURSE_INSTANCES_SHOW_INDEX:
      collect = state.CourseInstanceCollection;
      s = {
        ...state,
        CourseInstanceCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_COURSE_INSTANCES_SHOW_COUNT:
      collect = state.CourseInstanceCollection;
      s = {
        ...state,
        CourseInstanceCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_COURSES_SHOW_INDEX:
      collect = state.CourseCollection;
      s = {
        ...state,
        CourseCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_COURSES_SHOW_COUNT:
      collect = state.CourseCollection;
      s = {
        ...state,
        CourseCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_DESIRED_DEGREES_SHOW_INDEX:
      collect = state.DesiredDegreeCollection;
      s = {
        ...state,
        DesiredDegreeCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_DESIRED_DEGREES_SHOW_COUNT:
      collect = state.DesiredDegreeCollection;
      s = {
        ...state,
        DesiredDegreeCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_FEEDS_SHOW_INDEX:
      collect = state.FeedCollection;
      s = {
        ...state,
        FeedCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_FEEDS_SHOW_COUNT:
      collect = state.FeedCollection;
      s = {
        ...state,
        FeedCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_FEEDBACK_INSTANCES_SHOW_INDEX:
      collect = state.FeedbackInstanceCollection;
      s = {
        ...state,
        FeedbackInstanceCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_FEEDBACK_INSTANCES_SHOW_COUNT:
      collect = state.FeedbackInstanceCollection;
      s = {
        ...state,
        FeedbackInstanceCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_HELP_MESSAGES_SHOW_INDEX:
      collect = state.HelpMessageCollection;
      s = {
        ...state,
        HelpMessageCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_HELP_MESSAGES_SHOW_COUNT:
      collect = state.HelpMessageCollection;
      s = {
        ...state,
        HelpMessageCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_INTERESTS_SHOW_INDEX:
      collect = state.InterestCollection;
      s = {
        ...state,
        InterestCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_INTERESTS_SHOW_COUNT:
      collect = state.InterestCollection;
      s = {
        ...state,
        InterestCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_INTEREST_TYPES_SHOW_INDEX:
      collect = state.InterestTypeCollection;
      s = {
        ...state,
        InterestTypeCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_INTEREST_TYPES_SHOW_COUNT:
      collect = state.InterestTypeCollection;
      s = {
        ...state,
        InterestTypeCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_MENTOR_ANSWERS_SHOW_INDEX:
      collect = state.MentorAnswerCollection;
      s = {
        ...state,
        MentorAnswerCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_MENTOR_ANSWERS_SHOW_COUNT:
      collect = state.MentorAnswerCollection;
      s = {
        ...state,
        MentorAnswerCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_MENTOR_QUESTIONS_SHOW_INDEX:
      collect = state.MentorQuestionCollection;
      s = {
        ...state,
        MentorQuestionCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_MENTOR_QUESTIONS_SHOW_COUNT:
      collect = state.MentorQuestionCollection;
      s = {
        ...state,
        MentorQuestionCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_OPPORTUNITIES_SHOW_INDEX:
      collect = state.OpportunityCollection;
      s = {
        ...state,
        OpportunityCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_OPPORTUNITIES_SHOW_COUNT:
      collect = state.OpportunityCollection;
      s = {
        ...state,
        OpportunityCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_OPPORTUNITY_INSTANCES_SHOW_INDEX:
      collect = state.OpportuntiyInstanceCollection;
      s = {
        ...state,
        OpportuntiyInstanceCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_OPPORTUNITY_INSTANCES_SHOW_COUNT:
      collect = state.OpportuntiyInstanceCollection;
      s = {
        ...state,
        OpportuntiyInstanceCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_OPPORTUNITY_TYPES_SHOW_INDEX:
      collect = state.OpportunityTypeCollection;
      s = {
        ...state,
        OpportunityTypeCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_OPPORTUNITY_TYPES_SHOW_COUNT:
      collect = state.OpportunityTypeCollection;
      s = {
        ...state,
        OpportunityTypeCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_PLAN_CHOICES_SHOW_INDEX:
      collect = state.PlanChoiceCollection;
      s = {
        ...state,
        PlanChoiceCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_PLAN_CHOICES_SHOW_COUNT:
      collect = state.PlanChoiceCollection;
      s = {
        ...state,
        PlanChoiceCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_REVIEWS_SHOW_INDEX:
      collect = state.ReviewCollection;
      s = {
        ...state,
        ReviewCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_REVIEWS_SHOW_COUNT:
      collect = state.ReviewCollection;
      s = {
        ...state,
        ReviewCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_SLUGS_SHOW_INDEX:
      collect = state.SlugCollection;
      s = {
        ...state,
        SlugCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_SLUGS_SHOW_COUNT:
      collect = state.SlugCollection;
      s = {
        ...state,
        SlugCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_TEASERS_SHOW_INDEX:
      collect = state.TeaserCollection;
      s = {
        ...state,
        TeaserCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_TEASERS_SHOW_COUNT:
      collect = state.TeaserCollection;
      s = {
        ...state,
        TeaserCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_VERIFICATION_REQUESTS_SHOW_INDEX:
      collect = state.VerificationRequestCollection;
      s = {
        ...state,
        VerificationRequestCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_VERIFICATION_REQUESTS_SHOW_COUNT:
      collect = state.VerificationRequestCollection;
      s = {
        ...state,
        VerificationRequestCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}
