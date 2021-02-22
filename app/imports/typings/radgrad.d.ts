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

export interface MeteorError {
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

interface Document {
  _id: string;
}

export interface DumpOne {
  slug?: string;
}

export interface Update {
  id?: string;
}

export interface Pagination {
  AcademicTermCollection?: {
    showIndex: number;
    showCount: number;
  };
  AcademicYearInstanceCollection?: {
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
// used to implement the Card Explorer Widgets (ProfileCard, TermCard, ExplorerCard, and UserProfileCard).
export interface CardExplorerCards {
  item: any;
}

export interface PlanCard extends CardExplorerCards {
  type: string;
  canAdd?: boolean;
}

export interface ProfileCard extends CardExplorerCards {
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    };
  };
}

export interface TermCard extends CardExplorerCards {
  type: string;
  isStudent: boolean;
  canAdd: boolean;
}

export interface UserProfileCard extends CardExplorerCards {}

// TODO this is a very bad interface.
export interface DescriptionPair {
  label: string;
  value: string | number | string[] | any[] | unknown;
}

export interface SocialPair {
  label: string;
  amount?: number;
  value: Profile[];
}

// AcademicYearInstances
export interface AcademicYearInstance {
  _id: string;
  year: number;
  springYear: number;
  studentID: string;
  termIDs: string[];
  retired?: boolean;
}

export interface AcademicYearInstanceDefine extends DumpOne {
  year: number;
  student: string;
  retired?: boolean;
}

// CareerGoals
export interface CareerGoal {
  _id: string;
  name: string;
  slugID: string;
  description: string;
  interestIDs: string[];
  retired?: boolean;
}

export interface CareerGoalDefine extends DumpOne {
  name: string;
  slug: string;
  description: string;
  interests: string[];
  retired?: boolean;
}

export interface CareerGoalUpdate extends Update {
  name?: string;
  description?: string;
  interests?: string[];
  retired?: boolean;
}

// StudentParticipations
export interface StudentParticipation {
  itemID: string;
  itemSlug: string;
  itemCount: number;
}

export interface StudentParticipationDefine extends DumpOne {
  itemID: string;
  itemSlug: string;
  itemCount: number;
}

export interface StudentParticipationUpdate extends Update {
  itemCount?: number;
}

// CourseInstances
export interface CourseInstance {
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

export interface CourseInstanceDefine extends DumpOne {
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

export interface CourseInstanceUpdate extends Update {
  termID?: string;
  verified?: boolean;
  fromRegistrar?: boolean;
  grade?: string;
  creditHrs?: number;
  note?: string;
  ice?: Ice;
  retired?: boolean;
}

export interface Scoreboard {
  _id: string;
  count: number;
}

// Courses
export interface Course {
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

export interface CourseDefine extends DumpOne {
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

export interface CourseUpdate extends Update {
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

// Factoids
export interface InterestOrCareerGoalFactoidProps {
  name: string;
  numberOfStudents: number;
  numberOfOpportunities: number;
  numberOfCourses: number;
  description: string;
}

export interface LevelFactoidProps {
  level: number;
  numberOfStudents: number;
  description: string;
}

export interface ReviewFactoidProps {
  name: string;
  description: string;
}

export interface OpportunityFactoidProps {
  picture: string;
  name: string;
  ice: Ice;
  description: string;
  numberOfStudents: number;
}

// Favoirites
export interface FavoriteCareerGoalDefine extends DumpOne {
  careerGoal: string;
  username: string;
  share?: boolean;
  retired?: boolean;
}

export interface FavoriteCareerGoal {
  careerGoalID: string;
  userID: string;
  retired: boolean;
}

export interface FavoriteCourseDefine extends DumpOne {
  course: string;
  student: string;
  retired?: boolean;
}

export interface FavoriteCourse {
  courseID: string;
  studentID: string;
  retired: boolean;
}

export interface FavoriteInterestDefine extends DumpOne {
  interest: string;
  username: string;
  share?: boolean;
  retired?: boolean;
}

export interface FavoriteInterest {
  interestID: string;
  userID: string;
  share: boolean;
  retired: boolean;
}

export interface FavoriteOpportunityDefine extends DumpOne {
  opportunity: string;
  student: string;
  retired?: boolean;
}

export interface FavoriteOpportunity {
  opportunityID: string;
  studentID: string;
  retired: boolean;
}

export interface FavoriteUpdate extends Update {
  share?: boolean;
  retired?: boolean;
}

// Feeds
export interface IFeed {
  _id: string;
  userIDs: string[];
  description?: string;
  picture?: string;
  feedType: string;
  timestamp: Date;
  opportunityID?: string;
  courseID?: string;
  termID?: string;
  retired?: boolean;
}

export interface FeedDefine extends DumpOne {
  user?: string;
  course?: string;
  opportunity?: string;
  academicTerm?: string;
  level?: number;
  feedType: string;
  timestamp?: Date;
  retired?: boolean;
}

export interface FeedUpdate extends Update {
  description?: string;
  picture?: string;
  users?: string[];
  opportunity?: string;
  course?: string;
  academicTerm?: string;
  retired?: boolean;
}

// FeedBackInstances
export interface FeedbackInstance {
  userID: string;
  functionName: string;
  description: string;
  feedbackType: string;
  retired?: boolean;
}

export interface FeedbackInstanceDefine extends DumpOne {
  user: string;
  functionName: string;
  description: string;
  feedbackType: string;
  retired?: boolean;
}

export interface FeedbackInstanceUpdate extends Update {
  user?: string;
  functionName?: string;
  description?: string;
  feedbackType?: string;
  retired?: boolean;
}

// Interests
export interface Interest {
  _id: string;
  name: string;
  slugID: string;
  description: string;
  interestTypeID: string;
  retired?: boolean;
}

export interface InterestDefine extends DumpOne {
  name: string;
  slug: string;
  description: string;
  interestType: string;
  retired?: boolean;
}

export interface InterestUpdate extends Update {
  name?: string;
  description?: string;
  interestType?: string;
  retired?: boolean;
}

// InterestTypes
export interface InterestType {
  name: string;
  slugID: string;
  description: string;
  interestTypeID: string;
  retired?: boolean;
}

export interface TypeDefine extends DumpOne {
  name: string;
  slug: string;
  description: string;
  retired?: boolean;
}

export interface TypeUpdate extends Update {
  name?: string;
  description?: string;
  retired?: boolean;
}

// IceSnapshots
export interface IceSnapshotDefine extends DumpOne {
  username: string;
  level: number;
  i: number;
  c: number;
  e: number;
  updated: any;
}

// Opportunities
export interface Opportunity {
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
  picture?: string;
  retired?: boolean;
}

export interface OpportunityDefine extends DumpOne {
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
  picture?: string;
  retired?: boolean;
}

export interface OpportunityUpdate extends Update {
  name?: string;
  description?: string;
  opportunityType?: string;
  sponsor?: string;
  interests?: string[];
  academicTerms?: string[];
  eventDate?: any;
  timestamp?: Date;
  ice?: Ice;
  picture?: string;
  retired?: boolean;
}

export interface OpportunityUpdateData {
  name?: string;
  description?: string;
  opportunityTypeID?: string;
  sponsorID?: string;
  interestIDs?: string[];
  termIDs?: string[];
  eventDate?: any;
  timestamp?: Date;
  ice?: Ice;
  picture?: string;
  retired?: boolean;
}

// OpportunityInstances
export interface OpportunityInstance {
  _id: string;
  termID: string;
  opportunityID: string;
  verified: boolean;
  studentID: string;
  sponsorID: string;
  ice: Ice;
  picture?: string;
  retired?: boolean;
}

export interface OpportunityInstanceDefine extends DumpOne {
  academicTerm: string;
  opportunity: string;
  sponsor?: string;
  verified: boolean;
  student: string;
  retired?: boolean;
}

export interface OpportunityInstanceUpdate extends Update {
  termID?: string;
  verified?: boolean;
  ice?: Ice;
  retired?: boolean;
}

// OpportunityType
export interface OpportunityType {
  _id: string;
  description: string;
  name: string;
  slugID: string;
  retired?: boolean;
}

export interface OpportunityTypeDefine extends DumpOne {
  description: string;
  name: string;
  slug: string;
  retired?: boolean;
}

export interface OpportunityTypeUpdate extends Update {
  description?: string;
  name?: string;
  retired?: boolean;
}

export interface PageInterest extends Document {
  username: string;
  category: string;
  name: string;
  timestamp: Date;
  retired: boolean;
}

export interface PageInterestDefine extends DumpOne {
  username: string;
  category: string;
  name: string;
  timestamp?: Date;
  retired?: boolean;
}

export interface PageInterestInfo {
  name: string;
  views: number;
}

export interface PageInterestsDailySnapshot extends Document {
  careerGoals: PageInterestInfo[];
  courses: PageInterestInfo[];
  interests: PageInterestInfo[];
  opportunities: PageInterestInfo[];
  timestamp: Date;
  retired: boolean;
}

export interface PageInterestsDailySnapshotDefine extends DumpOne {
  careerGoals: PageInterestInfo[];
  courses: PageInterestInfo[];
  interests: PageInterestInfo[];
  opportunities: PageInterestInfo[];
  timestamp?: Date;
  retired?: boolean;
}

// PlanChoice
export interface PlanChoiceDefine extends DumpOne {
  choice: string;
  retired?: boolean;
}

export interface PlanChoiceUpdate extends Update {
  choice?: string;
  retired?: boolean;
}

// Profiles
// TODO: This is wrong we have too much in the BaseProfile
export interface BaseProfile {
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
  isAlumni?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  optedIn?: boolean;
  courseExplorerFilter?: string;
  opportunityExplorerSortOrder?: string;
  aboutMe?: string;
  lastRegistrarLoad?: string;
  lastVisitedCareerGoals?: string;
  lastVisitedCourses?: string;
  lastVisitedInterests?: string;
  lastVisitedOpportunities?: string;
}

export interface Profile {
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
export interface AdvisorOrFacultyProfile extends Profile {
  aboutMe?: string;
}

export interface ProfileDefine extends DumpOne {
  username: string;
  firstName: string;
  lastName: string;
  picture?: string;
  website?: string;
  interests?: string[];
  careerGoals?: string[];
  retired?: boolean;
}

export interface AdvisorOrFacultyProfileDefine extends ProfileDefine {
  aboutMe?: string;
}

export interface CombinedProfileDefine extends ProfileDefine {
  role: string;
  company?: string;
  career?: string;
  location?: string;
  linkedin?: string;
  motivation?: string;
  level?: number;
  declaredAcademicTerm?: string;
  isAlumni?: boolean;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
}

export interface ProfileUpdate extends Update {
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

export interface AdvisorOrFacultyProfileUpdate extends ProfileUpdate {
  aboutMe?: string;
}

export interface StudentProfile extends Profile {
  level: number;
  declaredAcademicTermID?: string;
  isAlumni?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  lastRegistrarLoad?: string;
  lastVisitedCareerGoals?: string;
  lastVisitedCourses?: string;
  lastVisitedInterests?: string;
  lastVisitedOpportunities?: string;
  lastVisitedPrivacy?: string;
  lastLeveledUp?: string;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

export interface StudentProfileDefine extends ProfileDefine {
  level: number;
  declaredAcademicTerm?: string;
  favoriteCourses?: string[];
  favoriteOpportunities?: string[];
  isAlumni?: boolean;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  lastRegistrarLoad?: string;
  lastVisitedCareerGoals?: string;
  lastVisitedCourses?: string;
  lastVisitedInterests?: string;
  lastVisitedOpportunities?: string;
  lastVisitedPrivacy?: string;
  lastLeveledUp?: string;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

export interface StudentProfileUpdate extends ProfileUpdate {
  level?: number;
  declaredAcademicTerm?: string;
  favoriteCourses?: string[];
  favoriteOpportunities?: string[];
  isAlumni?: boolean;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  lastRegistrarLoad?: string;
  lastVisitedCareerGoals?: string;
  lastVisitedCourses?: string;
  lastVisitedInterests?: string;
  lastVisitedOpportunities?: string;
  lastVisitedPrivacy?: string;
  lastLeveledUp?: string;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

export interface StudentProfileUpdateData {
  level?: number;
  declaredAcademicTermID?: string;
  isAlumni?: boolean;
  role?: string;
  retired?: boolean;
  shareUsername?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  lastRegistrarLoad?: string;
  lastVisitedCareerGoals?: string;
  lastVisitedCourses?: string;
  lastVisitedInterests?: string;
  lastVisitedOpportunities?: string;
  lastVisitedPrivacy?: string;
  lastLeveledUp?: string;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

// Reviews
type ReviewRatings = 1 | 2 | 3 | 4 | 5;

export interface Review {
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

export interface ReviewDefine extends DumpOne {
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

export interface ReviewUpdate extends Update {
  academicTerm?: string;
  rating?: ReviewRatings;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

export interface ReviewUpdateData {
  termID?: string;
  rating?: ReviewRatings;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

// AcademicTerms
export interface AcademicTerm {
  _id: string;
  term: string;
  year: number;
  termNumber: number;
  slugID: string;
  retired?: boolean;
}

export interface AcademicTermDefine extends DumpOne {
  term: string;
  year: number;
  retired?: boolean;
}

export interface AcademicTermUpdate extends Update {
  retired?: boolean;
}

export interface SettingsUpdate extends Update {
  quarterSystem?: boolean;
}

// Slugs
export interface Slug {
  _id: string;
  name: string;
  entityName: string;
  entityID: string;
}

export interface SlugDefine extends DumpOne {
  name: string;
  entityName: string;
}

// StarDataObject
export interface StarDataObject {
  semester: string;
  name: string;
  num: string;
  credits: number;
  grade: string;
  student: string;
}

// Teasers
export interface Teaser {
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

export interface TeaserDefine extends DumpOne {
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

export interface TeaserUpdate extends Update {
  title?: string;
  targetSlug?: string;
  interests?: string[];
  author?: string;
  url?: string;
  description?: string;
  duration?: string;
  retired?: boolean;
}

export interface TeaserUpdateData {
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
export interface UserInteraction {
  _id: string;
  username: string;
  type: string;
  typeData: string[];
  timestamp: Date;
}

export interface UserInteractionDefine extends DumpOne {
  username: string;
  type: string;
  typeData: string[];
  timestamp?: any;
}

// VerificationRequests
interface Processed {
  date: Date;
  status: string;
  verifier: string;
  feedback?: string;
}

export interface VerificationRequest {
  _id: string;
  studentID: string;
  opportunityInstanceID: string;
  submittedOn: Date;
  status: string;
  processed: Processed[];
  ice?: Ice;
  retired?: boolean;
}

export interface VerificationRequestDefine extends DumpOne {
  student?: string;
  opportunityInstance?: string;
  submittedOn?: any;
  status?: string;
  processed?: Processed[];
  academicTerm?: string;
  opportunity?: string;
  retired?: boolean;
}

export interface VerificationRequestUpdate extends Update {
  status?: string;
  processed?: Processed[];
  retired?: boolean;
}
