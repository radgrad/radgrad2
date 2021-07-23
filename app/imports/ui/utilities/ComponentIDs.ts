/** Define IDs to identify components in the system. This is used for testing. */
export enum COMPONENTIDS {

  LANDING_EXPLORER_MENU = 'landing-explorer-menu',
  LANDING_EXPLORER_BUTTONS = 'landing-explorer-buttons',
  LANDING_CAREER_GOALS_EXPLORER = 'landing-career-goals-explorer',
  LANDING_INTERESTS_EXPLORER = 'landing-interests-explorer',
  LANDING_COURSES_EXPLORER = 'landing-courses-explorer',
  LANDING_OPPORTUNITIES_EXPLORER = 'landing-opportunities-explorer',
  LANDING_INTERNSHIPS_EXPLORER = 'landing-internships-explorer',

  NAVBAR_CURRENT_USER = 'navbar-current-user',
  NAVBAR_SIGN_OUT = 'navbar-sign-out',
  LOGIN = 'LOGIN',

  ADMIN = 'admin',
  ADMIN_MENU_HOME = 'admin-menu-home',
  ADMIN_MENU_VISIBILITY = 'admin-menu-visibility',
  ADMIN_MENU_FORECASTS = 'admin-menu-forecasts',
  ADMIN_MENU_COMMUNITY = 'admin-menu-community',
  ADMIN_MENU_EXPLORERS = 'admin-menu-explorers',
  ADMIN_MENU_EXPLORER_CAREERS = 'admin-menu-explorer-careers',
  ADMIN_MENU_EXPLORER_COURSES = 'admin-menu-explorer-courses',
  ADMIN_MENU_EXPLORER_INTERESTS = 'admin-menu-explorer-interests',
  ADMIN_MENU_EXPLORER_OPPORTUNITIES = 'admin-menu-explorer-opportunities',
  ADMIN_MENU_MANAGE = 'admin-menu-manage',
  ADMIN_MENU_MANAGE_STUDENTS = 'admin-menu-manage-students',
  ADMIN_MENU_MANAGE_VERIFICATION = 'admin-menu-manage-verification',
  ADMIN_MENU_MANAGE_REVIEW = 'admin-menu-manage-review',
  FIRST_MENU_USERNAME = 'first-menu-username',
  FILTERED_STUDENTS_TAB = 'filtered-students-tab',
  FILTERED_STUDENTS_GRID = 'filtered-students-grid',
  FILTERED_ALUMNI_TAB = 'filtered-alumni-tab',
  FILTERED_ALUMNI_GRID = 'filtered-alumni-grid',
  UPDATE_TAB = 'update-tab',
  ADD_NEW_TAB = 'add-new-tab',
  OTHER_TAB = 'other-tab',
  MATRICULATE_TAB = 'matriculate-tab',
  ADD_STUDENT_TAB_PANE = 'advisor-add-student-tab',
  OTHER_TAB_PANE = 'advisor-other-tab',
  MATRICULATE_STUDENTS_TAB_PANE = 'matriculate-students-tab',

  ADVISOR = 'advisor',
  ADVISOR_MENU_HOME = 'advisor-menu-home',
  ADVISOR_MENU_VISIBILITY = 'advisor-menu-visibility',
  ADVISOR_MENU_FORECASTS = 'advisor-menu-forecasts',
  ADVISOR_MENU_COMMUNITY = 'advisor-menu-community',
  ADVISOR_MENU_EXPLORERS = 'advisor-menu-explorers',
  ADVISOR_MENU_EXPLORER_CAREERS = 'advisor-menu-explorer-careers',
  ADVISOR_MENU_EXPLORER_COURSES = 'advisor-menu-explorer-courses',
  ADVISOR_MENU_EXPLORER_INTERESTS = 'advisor-menu-explorer-interests',
  ADVISOR_MENU_EXPLORER_OPPORTUNITIES = 'advisor-menu-explorer-opportunities',
  ADVISOR_MENU_MANAGE = 'advisor-menu-manage',
  ADVISOR_MENU_MANAGE_STUDENTS = 'advisor-menu-manage-students',
  ADVISOR_MENU_MANAGE_VERIFICATION = 'advisor-menu-manage-verification',
  ADVISOR_MENU_MANAGE_REVIEW = 'advisor-menu-manage-review',
  ADVISOR_MENU_MANAGE_OPPORTUNITIES = 'advisor-menu-manage-opportunities',
  ADVISOR_ADD_FIRST_NAME = 'advisor-add-first-name',
  ADVISOR_ADD_LAST_NAME = 'advisor-add-last-name',
  ADVISOR_ADD_USERNAME = 'advisor-add-username',
  ADVISOR_ADD_STUDENT_BUTTON = 'advisor-add-student-button',
  ADVISOR_FILTER_FIRST_NAME = 'advisor-filter-first-name',
  ADVISOR_FILTER_LAST_NAME = 'advisor-filter-last-name',
  ADVISOR_FILTER_USERNAME = 'advisor-filter-username',
  MANAGE_STUDENT_ITEM = 'manage-student-item',
  EDIT_OPPORTUNITY_BUTTON = 'edit-opportunity-button',

  FACULTY = 'faculty',
  FACULTY_MENU_HOME = 'faculty-menu-home',
  FACULTY_MENU_VISIBILITY = 'faculty-menu-visibility',
  FACULTY_MENU_FORECASTS = 'faculty-menu-forecasts',
  FACULTY_MENU_COMMUNITY = 'faculty-menu-community',
  FACULTY_MENU_EXPLORERS = 'faculty-menu-explorers',
  FACULTY_MENU_EXPLORER_CAREERS = 'faculty-menu-explorer-careers',
  FACULTY_MENU_EXPLORER_COURSES = 'faculty-menu-explorer-courses',
  FACULTY_MENU_EXPLORER_INTERESTS = 'faculty-menu-explorer-interests',
  FACULTY_MENU_EXPLORER_OPPORTUNITIES = 'faculty-menu-explorer-opportunities',
  FACULTY_MENU_MANAGE = 'faculty-menu-manage',
  FACULTY_MENU_MANAGE_OPPORTUNITIES = 'faculty-menu-manage-opportunities',
  FACULTY_MENU_MANAGE_VERIFICATION = 'faculty-menu-manage-verification',
  FACULTY_MENU_MANAGE_REVIEW = 'faculty-menu-manage-review',

  STUDENT = 'student',
  STUDENT_MENU_HOME = 'student-menu-home',
  STUDENT_MENU_EXPLORERS = 'student-menu-explorers',
  STUDENT_MENU_INTERESTS = 'student-menu-interests',
  STUDENT_MENU_COURSES = 'student-menu-courses',
  STUDENT_MENU_CAREERS = 'student-menu-careers',
  STUDENT_MENU_OPPORTUNITIES = 'student-menu-opportunities',
  STUDENT_MENU_PLANNER = 'student-menu-planner',
  STUDENT_MENU_VERIFICATION = 'student-menu-verification',
  STUDENT_MENU_VISIBILITY = 'student-menu-visibility',
  STUDENT_MENU_ICE = 'student-menu-myice',
  STUDENT_MENU_LEVELS = 'student-menu-levels',
  STUDENT_MENU_REVIEWS = 'student-menu-reviews',
  STUDENT_MENU_COMMUNITY = 'student-menu-community',
  STUDENT_MENU_SIGNOUT = 'student-menu-signout',
  STUDENT_REQUEST_VERIFICATION_BUTTON = 'student-request-verification-button',
  STUDENT_REQUEST_VERIFICATION_INPUT = 'student-request-verification-input',
  STUDENT_REQUEST_VERIFICATION_SUBMIT = 'student-request-verification-submit',
  STUDENT_COURSE_OR_OPPORTUNITY = 'student-course-or-opportunity',
  STUDENT_REVIEW_COMMENT = 'student-review-comment',
  STUDENT_REVIEW_SUBMIT = 'student-review-submit',
  STUDENT_REVIEW_ITEM = 'student-review-item',

  SIGNIN_FORM_EMAIL = 'signin-form-email',
  SIGNIN_FORM_PASSWORD = 'signin-form-password',
  SIGNIN_FORM_SUBMIT = 'signin-form-submit',

  ADD_TO_PROFILE_BUTTON = 'add-to-profile-button',
  ADD_TO_PROFILE_MODAL_BUTTON = 'add-to-profile-modal-button',
  REMOVE_FROM_PROFILE_BUTTON = 'remove-from-profile-button',
  SHARE_PICTURE = 'share-picture',
  SHARE_WEBSITE = 'share-website',
  SHARE_INTERESTS = 'share-interests',
  SHARE_CAREER_GOALS = 'share-career-goals',
  SHARE_OPPORTUNITIES = 'share-opportunities',
  SHARE_COURSES = 'share-courses',
  SHARE_LEVEL = 'share-level',
  SHARE_ICE = 'share-ice',
  PROFILE_PICTURE = 'profile-picture',
  PROFILE_WEBSITE = 'profile-website',
  PROFILE_INTERESTS = 'profile-interests',
  PROFILE_CAREER_GOALS = 'profile-career-goals',
  PROFILE_COURSES = 'profile-courses',
  PROFILE_OPPORTUNITIES = 'profile-opportunities',
  PROFILE_LEVEL = 'profile-level',
  PROFILE_ICE = 'profile-ice',
  SET_WEBSITE_BUTTON = 'set-website-button',
  SUBMIT_WEBSITE_BUTTON = 'submit-website-button',
  SET_WEBSITE_TEXT = 'set-website-text',

  // Data model form ids.
  DATA_MODEL_ACADEMIC_TERM = 'data-model-academic-term',
  DATA_MODEL_AUTHOR = 'data-model-author',
  DATA_MODEL_CAREER_GOALS = 'data-model-career-goals',
  DATA_MODEL_COMMENTS = 'data-model-comments',
  DATA_MODEL_COURSE = 'data-model-course',
  DATA_MODEL_CREDIT_HOURS = 'data-model-credit-hours',
  DATA_MODEL_DESCRIPTION = 'data-model-description',
  DATA_MODEL_DURATION = 'data-model-duration',
  DATA_MODEL_ERROR_FIELD = 'data-model-error-field',
  DATA_MODEL_EVENT_DATE_1 = 'data-model-event-date-1',
  DATA_MODEL_EVENT_DATE_1_LABEL = 'data-model-event-date-1-label',
  DATA_MODEL_EVENT_DATE_2 = 'data-model-event-date-2',
  DATA_MODEL_EVENT_DATE_2_LABEL = 'data-model-event-date-2-label',
  DATA_MODEL_EVENT_DATE_3 = 'data-model-event-date-3',
  DATA_MODEL_EVENT_DATE_3_LABEL = 'data-model-event-date-3-label',
  DATA_MODEL_EVENT_DATE_4 = 'data-model-event-date-4',
  DATA_MODEL_EVENT_DATE_4_LABEL = 'data-model-event-date-4-label',
  DATA_MODEL_FIRST_NAME = 'data-model-first-name',
  DATA_MODEL_GRADE = 'data-model-grade',
  DATA_MODEL_ICE_I = 'data-model-ice-i',
  DATA_MODEL_ICE_C = 'data-model-ice-c',
  DATA_MODEL_ICE_E = 'data-model-ice-e',
  DATA_MODEL_INTERESTS = 'data-model-interests',
  DATA_MODEL_INTEREST_TYPE = 'data-model-interest-type',
  DATA_MODEL_LAST_NAME = 'data-model-last-name',
  DATA_MODEL_MODERATED = 'data-model-moderated',
  DATA_MODEL_MODERATOR_COMMENTS = 'data-model-moderator-comments',
  DATA_MODEL_NAME = 'data-model-name',
  DATA_MODEL_NUM = 'data-model-num',
  DATA_MODEL_OPPORTUNITY = 'data-model-opportunity',
  DATA_MODEL_OPPORTUNITY_TYPE = 'data-model-opportunity-type',
  DATA_MODEL_PAGINATION_LAST = 'data-model-pagination-last',
  DATA_MODEL_PICTURE = 'data-model-picture',
  DATA_MODEL_RATING = 'data-model-rating',
  DATA_MODEL_REPEATABLE = 'data-model-repeatable',
  DATA_MODEL_REVIEWEE = 'data-model-reviewee',
  DATA_MODEL_REVIEW_TYPE = 'data-model-review-type',
  DATA_MODEL_RETIRED = 'data-model-retired',
  DATA_MODEL_ROLE = 'data-model-role',
  DATA_MODEL_SHORT_NAME = 'data-model-short-name',
  DATA_MODEL_SLUG = 'data-model-slug',
  DATA_MODEL_SPONSOR = 'data-model-sponsor',
  DATA_MODEL_STUDENT = 'data-model-student',
  DATA_MODEL_SUBMIT = 'data-model-submit',
  DATA_MODEL_SYLLABUS = 'data-model-syllabus',
  DATA_MODEL_TARGET_SLUG = 'data-model-target-slug',
  DATA_MODEL_TITLE = 'data-model-title',
  DATA_MODEL_USERNAME = 'data-model-username',
  DATA_MODEL_VERIFIED = 'data-model-verified',
  DATA_MODEL_VISIBLE = 'data-model-visible',
  DATA_MODEL_WEBSITE = 'data-model-website',
  DATA_MODEL_YEAR = 'data-model-year',
  DATA_MODEL_YOUTUBE_ID = 'data-model-youtube-id',
}
