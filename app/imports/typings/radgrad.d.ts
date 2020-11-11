/* eslint-disable */

import { IReviewTypes } from '../api/review/ReviewTypes';

declare global {
  namespace Assets {
    function getBinary(assetPath: string, asyncCallback?: () => void): EJSON;

    function getText(assetPath: string, asyncCallback?: () => void): string;

    function absoluteFilePath(assetPath: string): string;
  }
}

declare namespace cloudinary {
  function openUploadWidget(options: any, resultCallback?: (error: null | string, result: { event: string; info?: { [key: string]: any } }) => any): any;
}

export interface IMeteorError {
  details: any;
  error: string;
  errorType: string;
  isClientSafe: boolean;
  message: string;
  reason: string;
  stack: string;
}

export interface Ice {
  i: number;
  c: number;
  e: number;
}

interface IDocument {
  _id: string;
}

export interface IDumpOne {
  slug?: string;
}

export interface IUpdate {
  id?: string;
}

export interface IPagination {
  AcademicPlanCollection?: {
    showIndex: number;
    showCount: number;
  };
  AcademicTermCollection?: {
    showIndex: number;
    showCount: number;
  };
  AcademicYearInstanceCollection?: {
    showIndex: number;
    showCount: number;
  };
  AdvisorLogCollection?: {
    showIndex: number;
    showCount: number;
  };
  CareerGoalCollection?: {
    showIndex: number;
    showCount: number;
  };
  CourseInstanceCollection?: {
    showIndex: number;
    showCount: number;
  };
  CourseCollection?: {
    showIndex: number;
    showCount: number;
  };
  FeedCollection?: {
    showIndex: number;
    showCount: number;
  };
  FeedbackInstanceCollection?: {
    showIndex: number;
    showCount: number;
  };
  HelpMessageCollection?: {
    showIndex: number;
    showCount: number;
  };
  InterestCollection?: {
    showIndex: number;
    showCount: number;
  };
  InterestTypeCollection?: {
    showIndex: number;
    showCount: number;
  };
  OpportunityCollection?: {
    showIndex: number;
    showCount: number;
  };
  OpportunityInstanceCollection?: {
    showIndex: number;
    showCount: number;
  };
  OpportunityTypeCollection?: {
    showIndex: number;
    showCount: number;
  };
  PlanChoiceCollection?: {
    showIndex: number;
    showCount: number;
  };
  ReviewCollection?: {
    showIndex: number;
    showCount: number;
  };
  SlugCollection?: {
    showIndex: number;
    showCount: number;
  };
  AdvisorProfileCollection?: {
    showIndex: number;
    showCount: number;
  };
  FacultyProfileCollection?: {
    showIndex: number;
    showCount: number;
  };
  StudentProfileCollection?: {
    showIndex: number;
    showCount: number;
  };
  TeaserCollection?: {
    showIndex: number;
    showCount: number;
  };
  VerificationRequestCollection?: {
    showIndex: number;
    showCount: number;
  };
}

// Card Explorer Cards. Note that this does not refer to specifically ExplorerCard.tsx. But rather all the Cards that are
// used to implement the Card Explorer Widgets (PlanCard, ProfileCard, TermCard, ExplorerCard, and UserProfileCard).
export interface ICardExplorerCards {
  item: any;
}

export interface IPlanCard extends ICardExplorerCards {
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

export interface IProfileCard extends ICardExplorerCards {
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

export interface ITermCard extends ICardExplorerCards {
  type: string;
  isStudent: boolean;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

export interface IUserProfileCard extends ICardExplorerCards {
}

export interface IDescriptionPair {
  label: string;
  value: string | string[] | any[];
}

// AcademicPlans
interface IAcademicPlanGroup {
  name: string;
  courseSlugs: string[];
}

export interface IAcademicPlan {
  _id: string;
  name: string;
  description: string;
  slugID: string;
  effectiveAcademicTermID: string;
  academicTermNumber: number;
  year: number;
  coursesPerAcademicTerm: number[];
  choiceList: string[];
  isBAM?: boolean;
  retired?: boolean;
}

export interface IAcademicPlanDefine extends IDumpOne {
  slug: string;
  name: string;
  description: string;
  academicTerm: string;
  coursesPerAcademicTerm: number[];
  choiceList: string[];
  retired?: boolean;
}

export interface IAcademicPlanUpdate extends IUpdate {
  name?: string;
  academicTerm?: string;
  coursesPerAcademicTerm?: number[];
  choiceList?: string[];
  retired?: boolean;
}

// AcademicYearInstances
export interface IAcademicYearInstance {
  _id: string;
  year: number;
  springYear: number;
  studentID: string;
  termIDs: string[];
  retired?: boolean;
}

export interface IAcademicYearInstanceDefine extends IDumpOne {
  year: number;
  student: string;
  retired?: boolean;
}

// AdvisorLogs
export interface IAdvisorLog {
  _id?: string;
  advisorID: string;
  studentID: string;
  text: string;
  createdOn: Date;
  retired?: boolean;
}

export interface IAdvisorLogDefine extends IDumpOne {
  advisor: string;
  student: string;
  text: string;
  createdOn?: any;
  retired?: boolean;
}

export interface IAdvisorLogUpdate extends IUpdate {
  text?: string;
  retired?: boolean;
}

// CareerGoals
export interface ICareerGoal {
  _id: string;
  name: string;
  slugID: string;
  description: string;
  interestIDs: string[];
  retired?: boolean;
}

export interface ICareerGoalDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  interests: string[];
  retired?: boolean;
}

export interface ICareerGoalUpdate extends IUpdate {
  name?: string;
  description?: string;
  interests?: string[];
  retired?: boolean;
}

// StudentParticipations
export interface IStudentParticipation {
  itemID: string;
  itemSlug: string;
  itemCount: number;
}

export interface IStudentParticipationDefine extends IDumpOne {
  itemID: string;
  itemSlug: string;
  itemCount: number;
}

export interface IStudentParticipationUpdate extends IUpdate {
  itemCount?: number;
}

// CourseInstances
export interface ICourseInstance {
  _id: string;
  termID: string;
  courseID: string;
  verified: boolean;
  fromRegistrar?: boolean;
  grade?: string;
  creditHrs: number;
  note?: string;
  studentID: string;
  ice?: Ice;
  retired?: boolean;
}

export interface ICourseInstanceDefine extends IDumpOne {
  academicTerm: string;
  course: string;
  verified?: boolean;
  fromRegistrar?: boolean;
  grade: string;
  note?: string;
  student: string;
  creditHrs?: number;
  retired?: boolean;
}

export interface ICourseInstanceUpdate extends IUpdate {
  termID?: string;
  verified?: boolean;
  fromRegistrar?: boolean;
  grade?: string;
  creditHrs?: number;
  note?: string;
  ice?: Ice;
  retired?: boolean;
}

export interface IScoreboard {
  _id: string;
  count: number;
}

// Courses
export interface ICourse {
  _id: string;
  name: string;
  shortName: string;
  slugID: string;
  num: string;
  description: string;
  creditHrs: number;
  interestIDs: string[];
  // Optional data
  syllabus?: string;
  prerequisites?: string[];
  retired?: boolean;
}

export interface ICourseDefine extends IDumpOne {
  name: string;
  shortName?: string;
  slug: string;
  num: string;
  description: string;
  creditHrs?: number;
  interests?: string[];
  syllabus?: string;
  corequisites?: string[];
  prerequisites?: string[];
  retired?: boolean;
}

export interface ICourseUpdate extends IUpdate {
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

// Favoirites
export interface IFavoriteAcademicPlanDefine extends IDumpOne {
  academicPlan: string;
  student: string;
  retired?: boolean;
}

export interface IFavoriteAcademicPlan {
  academicPlanID: string;
  studentID: string;
  retired: boolean;
}

export interface IFavoriteCareerGoalDefine extends IDumpOne {
  careerGoal: string;
  username: string;
  retired?: boolean;
}

export interface IFavoriteCareerGoal {
  careerGoalID: string;
  userID: string;
  retired: boolean;
}

export interface IFavoriteCourseDefine extends IDumpOne {
  course: string;
  student: string;
  retired?: boolean;
}

export interface IFavoriteCourse {
  courseID: string;
  studentID: string;
  retired: boolean;
}

export interface IFavoriteInterestDefine extends IDumpOne {
  interest: string;
  username: string;
  retired?: boolean;
}

export interface IFavoriteInterest {
  interestID: string;
  userID: string;
  retired: boolean;
}

export interface IFavoriteOpportunityDefine extends IDumpOne {
  opportunity: string;
  student: string;
  retired?: boolean;
}

export interface IFavoriteOpportunity {
  opportunityID: string;
  studentID: string;
  retired: boolean;
}

export interface IFavoriteUpdate extends IUpdate {
  retired?: boolean;
}

// Feeds
export interface IFeed {
  _id: string;
  userID: string;
}

export interface IFeedDefine extends IDumpOne {
  user?: string;
  course?: string;
  opportunity?: string;
  academicTerm?: string;
  level?: number;
  feedType: string;
  timestamp?: Date;
  retired?: boolean;
}

export interface IFeedUpdate extends IUpdate {
  description?: string;
  picture?: string;
  users?: string[];
  opportunity?: string;
  course?: string;
  academicTerm?: string;
  retired?: boolean;
}

// FeedBackInstances
export interface IFeedbackInstanceDefine extends IDumpOne {
  user: string;
  functionName: string;
  description: string;
  feedbackType: string;
  retired?: boolean;
}

export interface IFeedbackInstanceUpdate extends IUpdate {
  user?: string;
  functionName?: string;
  description?: string;
  feedbackType?: string;
  retired?: boolean;
}

// Help Messages
export interface IHelpMessage {
  _id: string;
  routeName: string;
  title: string;
  text: string;
  retired: boolean;
}
export interface IHelpMessageDefine extends IDumpOne {
  routeName: string;
  title: string;
  text: string;
  retired?: boolean;
}

export interface IHelpMessageUpdate extends IUpdate {
  routeName?: string;
  title?: string;
  text?: string;
  retired?: boolean;
}

// Interests
export interface IInterest {
  _id: string;
  name: string;
  slugID: string;
  description: string;
  interestTypeID: string;
  retired?: boolean;
}

export interface IInterestDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  interestType: string;
  retired?: boolean;
}

export interface IInterestUpdate extends IUpdate {
  name?: string;
  description?: string;
  interestType?: string;
  retired?: boolean;
}

// InterestTypes
export interface IInterestType {
  name: string;
  slugID: string;
  description: string;
  interestTypeID: string;
  retired?: boolean;
}

export interface ITypeDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  retired?: boolean;
}

export interface ITypeUpdate extends IUpdate {
  name?: string;
  description?: string;
  retired?: boolean;
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

// Opportunities
export interface IOpportunity {
  _id: string;
  name: string;
  slugID: string;
  description: string;
  opportunityTypeID: string;
  sponsorID: string;
  interestIDs: string[];
  termIDs: string[];
  timestamp: Date;
  // Optional data
  eventDate?: Date;
  ice?: Ice;
  retired?: boolean;
}

export interface IOpportunityDefine extends IDumpOne {
  name: string;
  slug: string;
  description: string;
  opportunityType: string;
  sponsor: string;
  interests: string[];
  academicTerms: string[];
  ice: Ice;
  timestamp?: Date;
  eventDate?: any;
  retired?: boolean;
}

export interface IOpportunityUpdate extends IUpdate {
  name?: string;
  description?: string;
  opportunityType?: string;
  sponsor?: string;
  interests?: string[];
  academicTerms?: string[];
  eventDate?: any;
  timestamp?: Date;
  ice?: Ice;
  retired?: boolean;
}

export interface IOpportunityUpdateData {
  name?: string;
  description?: string;
  opportunityTypeID?: string;
  sponsorID?: string;
  interestIDs?: string[];
  termIDs?: string[];
  eventDate?: any;
  timestamp?: Date;
  ice?: Ice;
  retired?: boolean;
}

// OpportunityInstances
export interface IOpportunityInstance {
  _id: string;
  termID: string;
  opportunityID: string;
  verified: boolean;
  studentID: string;
  sponsorID: string;
  ice: Ice;
  retired?: boolean;
}

export interface IOpportunityInstanceDefine extends IDumpOne {
  academicTerm: string;
  opportunity: string;
  sponsor?: string;
  verified: boolean;
  student: string;
  retired?: boolean;
}

export interface IOpportunityInstanceUpdate extends IUpdate {
  termID?: string;
  verified?: boolean;
  ice?: Ice;
  retired?: boolean;
}

// OpportunityType
export interface IOpportunityType {
  _id: string;
  description: string;
  name: string;
  slugID: string;
  retired?: boolean;
}

export interface IOpportunityTypeDefine extends IDumpOne {
  description: string;
  name: string;
  slug: string;
  retired?: boolean;
}

export interface IOpportunityTypeUpdate extends IUpdate {
  description?: string;
  name?: string;
  retired?: boolean;
}

export interface IPageInterest extends IDocument {
  username: string;
  category: string;
  name: string;
  timestamp: Date;
  retired: boolean;
}

export interface IPageInterestDefine extends IDumpOne {
  username: string;
  category: string;
  name: string;
  timestamp?: Date;
  retired?: boolean;
}

export interface IPageInterestInfo {
  name: string;
  views: number;
}

export interface IPageInterestsDailySnapshot extends IDocument {
  careerGoals: IPageInterestInfo[];
  courses: IPageInterestInfo[];
  interests: IPageInterestInfo[];
  opportunities: IPageInterestInfo[];
  timestamp: Date;
  retired: boolean;
}

export interface IPageInterestsDailySnapshotDefine extends IDumpOne {
  careerGoals: IPageInterestInfo[];
  courses: IPageInterestInfo[];
  interests: IPageInterestInfo[];
  opportunities: IPageInterestInfo[];
  timestamp?: Date;
  retired?: boolean;
}

// PlanChoice
export interface IPlanChoiceDefine extends IDumpOne {
  choice: string;
  retired?: boolean;
}

export interface IPlanChoiceUpdate extends IUpdate {
  choice?: string;
  retired?: boolean;
}

// Profiles
export interface IBaseProfile {
  _id: string;
  userID?: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  picture?: string;
  website?: string;
  retired?: boolean;
  company?: string;
  career?: string;
  location?: string;
  linkedin?: string;
  motivation?: string;
  level?: number;
  declaredAcademicTermID?: string;
  academicPlanID?: string;
  isAlumni?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareAcademicPlan?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  optedIn?: boolean;
  courseExplorerFilter?: string;
  opportunityExplorerSortOrder?: string;
}

export interface IProfile {
  _id: string;
  userID: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  picture?: string;
  website?: string;
  retired?: boolean;
  courseExplorerFilter?: string;
  opportunityExplorerSortOrder?: string;
}

// Advisor and Faculty Profiles
export interface IAdvisorProfile extends IProfile {
}

export interface IFacultyProfile extends IProfile {
}

export interface IProfileDefine extends IDumpOne {
  username: string;
  firstName: string;
  lastName: string;
  picture?: string;
  website?: string;
  interests?: string[];
  careerGoals?: string[];
  retired?: boolean;
}

export interface ICombinedProfileDefine extends IProfileDefine {
  role: string;
  company?: string;
  career?: string;
  location?: string;
  linkedin?: string;
  motivation?: string;
  level?: number;
  declaredAcademicTerm?: string;
  academicPlan?: string;
  isAlumni?: boolean;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareAcademicPlan?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
}

export interface IProfileUpdate extends IUpdate {
  firstName?: string;
  lastName?: string;
  picture?: string;
  website?: string;
  interests?: string[];
  careerGoals?: string[];
  retired?: boolean;
  courseExplorerFilter?: string;
  opportunityExplorerSortOrder?: string;
}

export interface IStudentProfile extends IProfile {
  level: number;
  declaredAcademicTermID?: string;
  academicPlanID?: string;
  isAlumni?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareAcademicPlan?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
}

export interface IStudentProfileDefine extends IProfileDefine {
  level: number;
  declaredAcademicTerm?: string;
  favoriteAcademicPlans?: string[];
  favoriteCourses?: string[];
  favoriteOpportunities?: string[];
  isAlumni?: boolean;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareAcademicPlan?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
}

export interface IStudentProfileUpdate extends IProfileUpdate {
  level?: number;
  declaredAcademicTerm?: string;
  favoriteAcademicPlans?: string[];
  favoriteCourses?: string[];
  favoriteOpportunities?: string[];
  isAlumni?: boolean;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareAcademicPlan?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
}

export interface IStudentProfileUpdateData {
  level?: number;
  declaredAcademicTermID?: string;
  academicPlanID?: string;
  isAlumni?: boolean;
  role?: string;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareAcademicPlan?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
}

// Reviews
type ReviewRatings = 1 | 2 | 3 | 4 | 5;

export interface IReview {
  _id: string;
  slugID: string;
  studentID: string;
  reviewType: string;
  revieweeID: string;
  termID: string;
  rating?: ReviewRatings;
  comments: string;
  moderated: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

export interface IReviewDefine extends IDumpOne {
  slug?: string;
  student: string;
  reviewType: IReviewTypes;
  reviewee: string;
  academicTerm: string;
  rating?: ReviewRatings;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

export interface IReviewUpdate extends IUpdate {
  academicTerm?: string;
  rating?: ReviewRatings;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

export interface IReviewUpdateData {
  termID?: string;
  rating?: ReviewRatings;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

// AcademicTerms
export interface IAcademicTerm {
  _id: string;
  term: string;
  year: number;
  termNumber: number;
  slugID: string;
  retired?: boolean;
}

export interface IAcademicTermDefine extends IDumpOne {
  term: string;
  year: number;
  retired?: boolean;
}

export interface IAcademicTermUpdate extends IUpdate {
  retired?: boolean;
}

export interface ISettingsUpdate extends IUpdate {
  quarterSystem?: boolean;
}

// Slugs
export interface ISlug {
  _id: string;
  name: string;
  entityName: string;
  entityID: string;
}

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
export interface ITeaser {
  _id: string;
  title: string;
  slugID: string;
  author: string;
  url: string;
  description: string;
  interestIDs: string[];
  opportunityID?: string;
  targetSlugID?: string;
  duration?: string;
  retired?: boolean;
}

export interface ITeaserDefine extends IDumpOne {
  title: string;
  slug: string;
  author: string;
  url: string;
  description: string;
  duration: string;
  interests: string[];
  opportunity?: string;
  targetSlug?: string;
  retired?: boolean;
}

export interface ITeaserUpdate extends IUpdate {
  title?: string;
  targetSlug?: string;
  interests?: string[];
  author?: string;
  url?: string;
  description?: string;
  duration?: string;
  retired?: boolean;
}

export interface ITeaserUpdateData {
  title?: string;
  targetSlugID?: string;
  interestIDs?: string[];
  author?: string;
  url?: string;
  description?: string;
  duration?: string;
  retired?: boolean;
}

// UserInteractions
export interface IUserInteraction {
  _id: string;
  username: string;
  type: string;
  typeData: string[];
  timestamp: Date;
}

export interface IUserInteractionDefine extends IDumpOne {
  username: string;
  type: string;
  typeData: string[];
  timestamp?: any;
}

// VerificationRequests
interface IProcessed {
  date: Date;
  status: string;
  verifier: string;
  feedback?: string;
}

export interface IVerificationRequest {
  _id: string;
  studentID: string;
  opportunityInstanceID: string;
  submittedOn: Date;
  status: string;
  processed: IProcessed[];
  ice?: Ice;
  retired?: boolean;
}

export interface IVerificationRequestDefine extends IDumpOne {
  student?: string;
  opportunityInstance?: string;
  submittedOn?: any;
  status?: string;
  processed?: IProcessed[];
  academicTerm?: string;
  opportunity?: string;
  retired?: boolean;
}

export interface IVerificationRequestUpdate extends IUpdate {
  status?: string;
  processed?: IProcessed[];
  retired?: boolean;
}
