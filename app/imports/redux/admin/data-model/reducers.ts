import * as TYPES from './types';

interface IState {
  pagination: {
    AcademicPlanCollection: { [key: string]: number };
    AcademicTermCollection: { [key: string]: number };
    AcademicYearInstanceCollection: { [key: string]: number };
    AdvisorLogCollection: { [key: string]: number };
    CareerGoalCollection: { [key: string]: number };
    CourseInstanceCollection: { [key: string]: number };
    CourseCollection: { [key: string]: number };
    DesiredDegreeCollection: { [key: string]: number };
    FeedCollection: { [key: string]: number };
    FeedbackInstanceCollection: { [key: string]: number };
    HelpMessageCollection: { [key: string]: number };
    InterestCollection: { [key: string]: number };
    InterestTypeCollection: { [key: string]: number };
    MentorAnswerCollection: { [key: string]: number };
    MentorQuestionCollection: { [key: string]: number };
    OpportunityCollection: { [key: string]: number };
    OpportunityInstanceCollection: { [key: string]: number };
    OpportunityTypeCollection: { [key: string]: number };
    PlanChoiceCollection: { [key: string]: number };
    ReviewCollection: { [key: string]: number };
    SlugCollection: { [key: string]: number };
    AdvisorProfileCollection: { [key: string]: number };
    FacultyProfileCollection: { [key: string]: number };
    MentorProfileCollection: { [key: string]: number };
    StudentProfileCollection: { [key: string]: number };
    TeaserCollection: { [key: string]: number };
    VerificationRequestCollection: { [key: string]: number };
  };
  cloudinary: {
    Feeds: { [key: string]: any };
    Users: { [key: string]: any };
  };
}

const initialState: IState = {
  pagination: {
    AcademicPlanCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AcademicTermCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AcademicYearInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AdvisorLogCollection: {
      showIndex: 0,
      showCount: 25,
    },
    CareerGoalCollection: {
      showIndex: 0,
      showCount: 25,
    },
    CourseInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    CourseCollection: {
      showIndex: 0,
      showCount: 25,
    },
    DesiredDegreeCollection: {
      showIndex: 0,
      showCount: 25,
    },
    FeedCollection: {
      showIndex: 0,
      showCount: 25,
    },
    FeedbackInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    HelpMessageCollection: {
      showIndex: 0,
      showCount: 25,
    },
    InterestCollection: {
      showIndex: 0,
      showCount: 25,
    },
    InterestTypeCollection: {
      showIndex: 0,
      showCount: 25,
    },
    MentorAnswerCollection: {
      showIndex: 0,
      showCount: 25,
    },
    MentorQuestionCollection: {
      showIndex: 0,
      showCount: 25,
    },
    OpportunityCollection: {
      showIndex: 0,
      showCount: 25,
    },
    OpportunityInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    OpportunityTypeCollection: {
      showIndex: 0,
      showCount: 25,
    },
    PlanChoiceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    ReviewCollection: {
      showIndex: 0,
      showCount: 25,
    },
    SlugCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AdvisorProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    FacultyProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    MentorProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    StudentProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    TeaserCollection: {
      showIndex: 0,
      showCount: 25,
    },
    VerificationRequestCollection: {
      showIndex: 0,
      showCount: 25,
    },
  },
  cloudinary: {
    Feeds: {
      isCloudinaryUsed: false,
      cloudinaryUrl: '',
    },
    Users: {
      isCloudinaryUsed: false,
      cloudinaryUrl: '',
    },
  },
};

export function reducer(state: IState = initialState, action): IState {
  // console.log('paginationReducer state=%o, action=%o', state, action);
  let s;
  let collect;
  let otherKeys;
  const paginationState = state.pagination;
  const cloudinaryState = state.cloudinary;
  switch (action.type) {
    case TYPES.SET_ACADEMIC_PLANS_SHOW_INDEX:
      collect = paginationState.AcademicPlanCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AcademicPlanCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ACADEMIC_PLANS_SHOW_COUNT:
      collect = paginationState.AcademicPlanCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AcademicPlanCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ACADEMIC_TERMS_SHOW_INDEX:
      collect = paginationState.AcademicTermCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AcademicTermCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ACADEMIC_TERMS_SHOW_COUNT:
      collect = paginationState.AcademicTermCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AcademicTermCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ACADEMIC_YEARS_SHOW_INDEX:
      collect = paginationState.AcademicYearInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AcademicYearInstanceCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ACADEMIC_YEARS_SHOW_COUNT:
      collect = paginationState.AcademicYearInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AcademicYearInstanceCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ADVISOR_LOGS_SHOW_INDEX:
      collect = paginationState.AdvisorLogCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AdvisorLogCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ADVISOR_LOGS_SHOW_COUNT:
      collect = paginationState.AdvisorLogCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AdvisorLogCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_CAREER_GOALS_SHOW_INDEX:
      collect = paginationState.CareerGoalCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          CareerGoalCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_CAREER_GOALS_SHOW_COUNT:
      collect = paginationState.CareerGoalCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          CareerGoalCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_COURSE_INSTANCES_SHOW_INDEX:
      collect = paginationState.CourseInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          CourseInstanceCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_COURSE_INSTANCES_SHOW_COUNT:
      collect = paginationState.CourseInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          CourseInstanceCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_COURSES_SHOW_INDEX:
      collect = paginationState.CourseCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          CourseCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_COURSES_SHOW_COUNT:
      collect = paginationState.CourseCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          CourseCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_DESIRED_DEGREES_SHOW_INDEX:
      collect = paginationState.DesiredDegreeCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          DesiredDegreeCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_DESIRED_DEGREES_SHOW_COUNT:
      collect = paginationState.DesiredDegreeCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          DesiredDegreeCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FEEDS_SHOW_INDEX:
      collect = paginationState.FeedCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          FeedCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FEEDS_SHOW_COUNT:
      collect = paginationState.FeedCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          FeedCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FEEDBACK_INSTANCES_SHOW_INDEX:
      collect = paginationState.FeedbackInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          FeedbackInstanceCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FEEDBACK_INSTANCES_SHOW_COUNT:
      collect = paginationState.FeedbackInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          FeedbackInstanceCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_HELP_MESSAGES_SHOW_INDEX:
      collect = paginationState.HelpMessageCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          HelpMessageCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_HELP_MESSAGES_SHOW_COUNT:
      collect = paginationState.HelpMessageCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          HelpMessageCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_INTERESTS_SHOW_INDEX:
      collect = paginationState.InterestCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          InterestCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_INTERESTS_SHOW_COUNT:
      collect = paginationState.InterestCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          InterestCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_INTEREST_TYPES_SHOW_INDEX:
      collect = paginationState.InterestTypeCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          InterestTypeCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_INTEREST_TYPES_SHOW_COUNT:
      collect = paginationState.InterestTypeCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          InterestTypeCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_MENTOR_ANSWERS_SHOW_INDEX:
      collect = paginationState.MentorAnswerCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          MentorAnswerCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_MENTOR_ANSWERS_SHOW_COUNT:
      collect = paginationState.MentorAnswerCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          MentorAnswerCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_MENTOR_QUESTIONS_SHOW_INDEX:
      collect = paginationState.MentorQuestionCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          MentorQuestionCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_MENTOR_QUESTIONS_SHOW_COUNT:
      collect = paginationState.MentorQuestionCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          MentorQuestionCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITIES_SHOW_INDEX:
      collect = paginationState.OpportunityCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          OpportunityCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITIES_SHOW_COUNT:
      collect = paginationState.OpportunityCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          OpportunityCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITY_INSTANCES_SHOW_INDEX:
      collect = paginationState.OpportunityInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          OpportunityInstanceCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITY_INSTANCES_SHOW_COUNT:
      collect = paginationState.OpportunityInstanceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          OpportunityInstanceCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITY_TYPES_SHOW_INDEX:
      collect = paginationState.OpportunityTypeCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          OpportunityTypeCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITY_TYPES_SHOW_COUNT:
      collect = paginationState.OpportunityTypeCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          OpportunityTypeCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_PLAN_CHOICES_SHOW_INDEX:
      collect = paginationState.PlanChoiceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          PlanChoiceCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_PLAN_CHOICES_SHOW_COUNT:
      collect = paginationState.PlanChoiceCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          PlanChoiceCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_REVIEWS_SHOW_INDEX:
      collect = paginationState.ReviewCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          ReviewCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_REVIEWS_SHOW_COUNT:
      collect = paginationState.ReviewCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          ReviewCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_SLUGS_SHOW_INDEX:
      collect = paginationState.SlugCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          SlugCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_SLUGS_SHOW_COUNT:
      collect = paginationState.SlugCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          SlugCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ADVISORS_SHOW_INDEX:
      collect = paginationState.AdvisorProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AdvisorProfileCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_ADVISORS_SHOW_COUNT:
      collect = paginationState.AdvisorProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          AdvisorProfileCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FACULTY_SHOW_INDEX:
      collect = paginationState.FacultyProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          FacultyProfileCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FACULTY_SHOW_COUNT:
      collect = paginationState.FacultyProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          FacultyProfileCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_MENTORS_SHOW_INDEX:
      collect = paginationState.MentorProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          MentorProfileCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_MENTORS_SHOW_COUNT:
      collect = paginationState.MentorProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          MentorProfileCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_STUDENTS_SHOW_INDEX:
      collect = paginationState.StudentProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          StudentProfileCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_STUDENTS_SHOW_COUNT:
      collect = paginationState.StudentProfileCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          StudentProfileCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_TEASERS_SHOW_INDEX:
      collect = paginationState.TeaserCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          TeaserCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_TEASERS_SHOW_COUNT:
      collect = paginationState.TeaserCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          TeaserCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_VERIFICATION_REQUESTS_SHOW_INDEX:
      collect = paginationState.VerificationRequestCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          VerificationRequestCollection: {
            ...collect,
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_VERIFICATION_REQUESTS_SHOW_COUNT:
      collect = paginationState.VerificationRequestCollection;
      s = {
        ...state,
        pagination: {
          ...paginationState,
          VerificationRequestCollection: {
            ...collect,
            showCount: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FEEDS_IS_CLOUDINARY_USED:
      otherKeys = cloudinaryState.Feeds;
      s = {
        ...state,
        cloudinary: {
          ...cloudinaryState,
          Feeds: {
            ...otherKeys,
            isCloudinaryUsed: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_FEEDS_CLOUDINARY_URL:
      otherKeys = cloudinaryState.Feeds;
      s = {
        ...state,
        cloudinary: {
          ...cloudinaryState,
          Feeds: {
            ...otherKeys,
            cloudinaryUrl: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_USERS_IS_CLOUDINARY_USED:
      otherKeys = cloudinaryState.Users;
      s = {
        ...state,
        cloudinary: {
          ...cloudinaryState,
          Users: {
            ...otherKeys,
            isCloudinaryUsed: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_USERS_CLOUDINARY_URL:
      otherKeys = cloudinaryState.Users;
      s = {
        ...state,
        cloudinary: {
          ...cloudinaryState,
          Users: {
            ...otherKeys,
            cloudinaryUrl: action.payload,
          },
        },
      };
      return s;
    default:
      return state;
  }
}

export default reducer;
