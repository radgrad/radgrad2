export interface Ice {
  i: number;
  c: number;
  e: number;
}

export interface IDumpOne {
  slug?: string;
}

// AcademicPlans
export interface IAcademicPlanDefine extends IDumpOne {
  slug: string;
  degreeSlug: string;
  name: string;
  description: string;
  semester: string;
  coursesPerSemester: number[];
  courseList: string[];
}

export interface IAcademicPlanUpdate {
  degreeSlug?: string;
  name?: string;
  semester?: string;
  coursesPerSemester?: number[];
  courseList?: string[];
}

// AcademicYearInstances
export interface IAcademicYearDefine extends IDumpOne {
  year: number;
  student: string;
}

// AdvisorLogs
export interface IAdvisorLogDefine extends IDumpOne {
  advisor: string;
  student: string;
  text: string;
  createdOn?: any;
}

export interface IAdvisorLogUpdate {
  id?: string;
  text?: string;
}

// CareerGoals
export interface ICareerGoalDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  interests: string[];
}

export interface ICareerGoalUpdate {
  name?: string;
  description?: string;
  interests?: string[];
}

// CourseInstances
export interface ICourseInstanceDefine extends IDumpOne {
  semester: string;
  course: string;
  verified?: boolean;
  fromSTAR?: boolean;
  grade?: string;
  note?: string;
  student: string;
  creditHrs?: number;
}

export interface ICourseInstanceUpdate {
  semesterID?: string;
  verified?: boolean;
  fromSTAR?: boolean;
  grade?: string;
  creditHrs?: number;
  note?: string;
  ice?: Ice;
}

// Courses
export interface ICourseDefine extends IDumpOne {
  name: string;
  shortName?: string;
  slug: string;
  num: string;
  description: string;
  creditHrs?: number;
  interests?: string[];
  syllabus?: string;
  prerequisites?: string[];
  retired?: boolean;
}

export interface ICourseUpdate {
  name?: string;
  shortName?: string;
  num?: string;
  description?: string;
  creditHrs?: number;
  interests?: string[];
  prerequisites?: string[];
  syllabus?: string;
  retired?: boolean;
}

// DesiredDegree
export interface IDesiredDegreeDefine extends IDumpOne {
  name: string;
  shortName?: string;
  slug: string;
  description: string;
}

export interface IDesiredDegreeUpdate {
  name?: string;
  shortName?: string;
  description?: string;
}

// Feeds
export interface IFeedDefine extends IDumpOne {
  user?: string;
  course?: string;
  opportunity?: string;
  semester?: string;
  level?: number;
  feedType: string;
  timestamp?: Date;
}
export interface IFeedUpdate {
  description?: string;
  picture?: string;
  users?: string[];
  opportunity?: string;
  course?: string;
  semester?: string;
}

// FeedBackInstances
export interface IFeedbackInstanceDefine extends IDumpOne {
  user: string;
  functionName: string;
  description: string;
  feedbackType: string;
}

export interface IFeedbackInstanceUpdate {
  user?: string;
  functionName?: string;
  description?: string;
  feedbackType?: string;
}

// Help Messages
export interface IHelpDefine extends IDumpOne {
  routeName: string;
  title: string;
  text: string;
}

export interface IHelpUpdate {
  routeName?: string;
  title?: string;
  text?: string;
}

// Interests
export interface IInterestDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  interestType: string;
}

export interface IInterestUpdate {
  name?: string;
  description?: string;
  interestType?: string;
}

// InterestTypes
export interface ITypeDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
}

export interface ITypeUpdate {
  name?: string;
  description?: string;
}

// IceSnapshots
export interface IIceSnapshotDefine extends IDumpOne {
  username: string;
  level: number;
  i: number;
  c: number;
  e: number;
  updated: any;
}

// MentorAnswers
export interface IMentorAnswerDefine extends IDumpOne {
  question: string;
  mentor: string;
  text: string;
}

export interface IMentorAnswerUpdate {
  text?: string;
}

// MentorQuestions
export interface IMentorQuestionDefine extends IDumpOne {
  question: string;
  slug: string;
  student: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
}

export interface IMentorQuestionUpdate {
  question?: string;
  student?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
}

// Opportunities
export interface IOpportunityDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  opportunityType: string;
  sponsor: string;
  interests: string[];
  semesters: string[];
  ice: Ice;
  eventDate?: any;
}

export interface IOpportunityUpdate {
  name?: string;
  description?: string;
  opportunityType?: string;
  sponsor?: string;
  interests?: string[];
  semesters?: string[];
  eventDate?: any;
  ice?: Ice;
}

export interface IOpportunityUpdateData {
  name?: string;
  description?: string;
  opportunityTypeID?: string;
  sponsorID?: string;
  interestIDs?: string[];
  semesterIDs?: string[];
  eventDate?: any;
  ice?: Ice;
}

// OpportunityInstances
export interface IOpportunityInstanceDefine extends IDumpOne {
  semester: string;
  opportunity: string;
  sponsor?: string;
  verified: boolean;
  student: string;
}

export interface IOpportunityInstanceUpdate {
  semesterID?: string;
  verified?: boolean;
  ice?: Ice;
}

// PlanChoice
export interface IPlanChoiceDefine extends IDumpOne {
  choice: string;
}

export interface IPlanChoiceUpdate extends IDumpOne {
  choice?: string;
}

// Profiles
export interface IBaseProfile {
  userID: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  picture?: string;
  website?: string;
  interestIDs: string[];
  careerGoalIDs: string[];
}

// Advisor and Faculty Profiles
export interface IProfileDefine extends IDumpOne {
  username: string;
  firstName: string;
  lastName: string;
  picture?: string;
  website?: string;
  interests?: string[];
  careerGoals?: string[];
}

export interface IProfileUpdate {
  firstName?: string;
  lastName?: string;
  picture?: string;
  website?: string;
  interests?: string[];
  careerGoals?: string[];
}

export interface IMentorProfileDefine extends IProfileDefine {
  company: string;
  career: string;
  location: string;
  linkedin?: string;
  motivation: string;
}

export interface IMentorProfileUpdate extends IProfileUpdate {
  company?: string;
  career?: string;
  location?: string;
  linkedin?: string;
  motivation?: string;
}

export interface IStudentProfileDefine extends IProfileDefine {
  level: number;
  declaredSemester?: string;
  academicPlan?: string;
  hiddenCourses?: string[];
  hiddenOpportunities?: string[];
  isAlumni?: boolean;
}

export interface IStudentProfileUpdate extends IProfileUpdate {
  level?: number;
  declaredSemester?: string;
  academicPlan?: string;
  hiddenCourses?: string[];
  hiddenOpportunities?: string[];
  isAlumni?: boolean;
}

export interface IStudentProfileUpdateData {
  level?: number;
  declaredSemesterID?: string;
  academicPlanID?: string;
  hiddenCourseIDs?: string[];
  hiddenOpportunityIDs?: string[];
  isAlumni?: boolean;
  role?: string;
}
// Reviews
export interface IReviewDefine extends IDumpOne {
  slug?: string;
  student: string;
  reviewType: string;
  reviewee: string;
  semester: string;
  rating?: number;
  comments: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
}

export interface IReviewUpdate {
  semester?: string;
  rating?: number;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
}

export interface IReviewUpdateData {
  semesterID?: string;
  rating?: number;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
}

// Semesters
export interface ISemesterDefine extends IDumpOne {
  term: string;
  year: number;
}

// Slugs
export interface ISlugDefine extends IDumpOne {
  name: string;
  entityName: string;
}

// StarDataObject
export interface IStarDataObject {
  semester: string;
  name: string;
  num: string;
  credits: number;
  grade: string;
  student: string;
}

// Teasers
export interface ITeaserDefine extends IDumpOne {
  title: string;
  slug: string;
  author: string;
  url: string;
  description: string;
  duration: string;
  interests: string[];
  opportunity: string;
}

export interface ITeaserUpdate {
  title?: string;
  opportunity?: string;
  interests?: string[];
  author?: string;
  url?: string;
  description?: string;
  duration?: string;
}

export interface ITeaserUpdateData {
  title?: string;
  opportunityID?: string;
  interestIDs?: string[];
  author?: string;
  url?: string;
  description?: string;
  duration?: string;
}

// UserInteractions
export interface IUserInteractionDefine extends IDumpOne {
  username: string;
  type: string;
  typeData: any[];
  timestamp?: any;
}

// VerificationRequests
export interface IVerificationRequestDefine extends IDumpOne {
  student: string;
  opportunityInstance?: string;
  submittedOn?: any;
  status?: string;
  processed?: any[];
  semester?: string;
  opportunity?: string;
}
