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

export type ICEType = 'Innovation' | 'Competency' | 'Experience';

export interface Ice {
  i: number;
  c: number;
  e: number;
}

interface Document {
  _id: string;
  createdAt: Date;
  updatedAt?: Date;
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
export interface AcademicYearInstance extends Document {
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
export interface CareerGoal extends Document {
  name: string;
  slugID: string;
  description: string;
  interestIDs: string[];
  retired?: boolean;
  picture?: string;
}

export interface CareerGoalDefine extends DumpOne {
  name: string;
  slug: string;
  description: string;
  interests: string[];
  retired?: boolean;
  picture?: string,
}

export interface CareerGoalUpdate extends Update {
  name?: string;
  description?: string;
  interests?: string[];
  retired?: boolean;
  picture?: string,
}

export interface CareerGoalKeyword {
  careerGoalID: string;
  keyword: string;
  retired: boolean;
}

export interface CareerGoalKeywordDefine extends DumpOne {
  careerGoal: string;
  keyword: string;
  retired?: boolean;
}

export interface CareerGoalKeywordUpdate extends Update {
  keyword?: string;
  retired?: boolean;
}

// CourseInstances
export interface CourseInstance extends Document {
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
  picture?: string,
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
  picture?: string;
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
  picture?: string;
}

export interface Forecast {
  _id: string;
  count: number;
}

// Courses
export interface Course extends Document {
  name: string;
  shortName: string;
  slugID: string;
  num: string;
  description: string;
  creditHrs: number;
  interestIDs: string[];
  // Optional data
  syllabus?: string;
  repeatable?: boolean;
  retired?: boolean;
  picture?: string;
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
  repeatable?: boolean;
  retired?: boolean;
  picture?: string,
}

export interface CourseUpdate extends Update {
  name?: string;
  shortName?: string;
  num?: string;
  description?: string;
  creditHrs?: number;
  interests?: string[];
  syllabus?: string;
  repeatable?: boolean;
  retired?: boolean;
  picture?: string;
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

// Profile Entries
export interface ProfileCareerGoalDefine extends DumpOne {
  careerGoal: string;
  username: string;
  share?: boolean;
  retired?: boolean;
}

export interface ProfileCareerGoal extends Document {
  careerGoalID: string;
  userID: string;
  retired: boolean;
  share:boolean;
}

export interface ProfileCourseDefine extends DumpOne {
  course: string;
  username: string;
  retired?: boolean;
  share?: boolean;
}

export interface ProfileCourse extends Document {
  courseID: string;
  userID: string;
  retired: boolean;
  share:boolean;
}

export interface ProfileInterestDefine extends DumpOne {
  interest: string;
  username: string;
  share?: boolean;
  retired?: boolean;
}

export interface ProfileInterest extends Document {
  interestID: string;
  userID: string;
  share: boolean;
  retired: boolean;
}

export interface ProfileOpportunityDefine extends DumpOne {
  opportunity: string;
  username: string;
  retired?: boolean;
  share?:boolean;
}

export interface ProfileOpportunity extends Document {
  opportunityID: string;
  userID: string;
  retired: boolean;
  share: boolean;
}

export interface ProfileEntryUpdate extends Update {
  share?: boolean;
  retired?: boolean;
}

// Interests
export interface Interest extends Document {
  name: string;
  slugID: string;
  description: string;
  interestTypeID: string;
  retired?: boolean;
  picture?: string;
  keywords?: string[];
}

export interface InterestDefine extends DumpOne {
  name: string;
  slug: string;
  description: string;
  interestType: string;
  retired?: boolean;
  picture?: string;
  keywords?: string[];
}

export interface InterestUpdate extends Update {
  name?: string;
  description?: string;
  interestType?: string;
  retired?: boolean;
  picture?: string;
  keywords?: string[];
}

export interface InterestKeyword {
  interestID: string;
  keyword: string;
  retired: boolean;
}

export interface InterestKeywordDefine extends DumpOne {
  interest: string;
  keyword: string;
  retired?: boolean;
}

export interface InterestKeywordUpdate extends Update {
  keyword?: string;
  retired?: boolean;
}

// InterestTypes
export interface InterestType extends Document {
  name: string;
  slugID: string;
  description: string;
  interestTypeID: string;
  retired?: boolean;
  picture?: string;
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

// Opportunities
export interface Opportunity extends Document {
  name: string;
  slugID: string;
  description: string;
  opportunityTypeID: string;
  sponsorID: string;
  interestIDs: string[];
  termIDs: string[];
  timestamp: Date;
  // Optional data
  eventDate1?: Date;
  eventDateLabel1?: string;
  eventDate2?: Date;
  eventDateLabel2?: string;
  eventDate3?: Date;
  eventDateLabel3?: string;
  eventDate4?: Date;
  eventDateLabel4?: string;
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
  ice: Ice;
  eventDate1?: Date;
  eventDateLabel1?: string;
  eventDate2?: Date;
  eventDateLabel2?: string;
  eventDate3?: Date;
  eventDateLabel3?: string;
  eventDate4?: Date;
  eventDateLabel4?: string;
  picture?: string;
  retired?: boolean;
}

export interface OpportunityUpdate extends Update {
  name?: string;
  description?: string;
  opportunityType?: string;
  sponsor?: string;
  interests?: string[];
  eventDate1?: Date;
  eventDateLabel1?: string;
  clearEventDate1?: boolean;
  clearEventDate2?: boolean;
  clearEventDate3?: boolean;
  clearEventDate4?: boolean;
  eventDate2?: Date;
  eventDateLabel2?: string;
  eventDate3?: Date;
  eventDateLabel3?: string;
  eventDate4?: Date;
  eventDateLabel4?: string;
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
  eventDate?: any;
  eventDate1?: Date;
  eventDateLabel1?: string;
  eventDate2?: Date;
  eventDateLabel2?: string;
  eventDate3?: Date;
  eventDateLabel3?: string;
  eventDate4?: Date;
  eventDateLabel4?: string;
  ice?: Ice;
  picture?: string;
  retired?: boolean;
}

// OpportunityInstances
export interface OpportunityInstance extends Document {
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
export interface OpportunityType extends Document {
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
export interface BaseProfile extends Document {
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
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  shareICE?: boolean;
  optedIn?: boolean;
  courseExplorerFilter?: string;
  opportunityExplorerSortOrder?: string;
  aboutMe?: string;
  lastRegistrarLoad?: string;
  lastVisited?: Record<string, string>;
}

export interface Profile extends Document {
  userID: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  picture?: string;
  website?: string;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  retired?: boolean;
  courseExplorerFilter?: string;
  opportunityExplorerSortOrder?: string;
  lastVisited?: Record<string, string>;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

// Advisor and Faculty Profiles
export interface AdvisorOrFacultyProfile extends Profile {
  aboutMe?: string;
  profileCourses?: string[];
  profileOpportunities?: string[];
  shareCourses?: boolean;
  shareOpportunities?: boolean;
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
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareInterests?: boolean;
  shareOpportunities?: boolean;
  lastVisited?: Record<string, string>;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

export interface AdvisorOrFacultyProfileDefine extends ProfileDefine {
  aboutMe?: string;
  profileCourses?: string[];
  profileOpportunities?: string[];
  shareCourses?: boolean;
  shareOpportunities?: boolean;
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
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  shareICE?: boolean;
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
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareInterests?: boolean;
  shareOpportunities?: boolean;
  lastVisited?: Record<string, string>;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
}

export interface AdvisorOrFacultyProfileUpdate extends ProfileUpdate {
  aboutMe?: string;
  profileCourses?: string[];
  profileOpportunities?: string[];
  shareCourses?: boolean;
  shareOpportunities?: boolean;
}

export interface StudentProfile extends Profile {
  level: number;
  declaredAcademicTermID?: string;
  isAlumni?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  shareICE?: boolean;
  lastRegistrarLoad?: string;
  lastLeveledUp?: string;
}

export interface StudentProfileDefine extends ProfileDefine {
  level: number;
  declaredAcademicTerm?: string;
  profileCourses?: string[];
  profileOpportunities?: string[];
  isAlumni?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  shareICE?: boolean;
  lastRegistrarLoad?: string;
  lastLeveledUp?: string;
}

export interface StudentProfileUpdate extends ProfileUpdate {
  level?: number;
  declaredAcademicTerm?: string;
  profileCourses?: string[];
  profileOpportunities?: string[];
  isAlumni?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  shareICE?: boolean;
  lastRegistrarLoad?: string;
  lastLeveledUp?: string;
}

export interface StudentProfileUpdateData {
  level?: number;
  declaredAcademicTermID?: string;
  isAlumni?: boolean;
  role?: string;
  retired?: boolean;
  sharePicture?: boolean;
  shareWebsite?: boolean;
  shareInterests?: boolean;
  shareCareerGoals?: boolean;
  shareCourses?: boolean;
  shareOpportunities?: boolean;
  shareLevel?: boolean;
  shareICE?: boolean;
  lastRegistrarLoad?: string;
  lastLeveledUp?: string;
  acceptedTermsAndConditions?: string;
  refusedTermsAndConditions?: string;
  lastVisited?: Record<string, string>;
}

// Reviews
type ReviewRatings = 1 | 2 | 3 | 4 | 5;

export interface Review extends Document {
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
export interface AcademicTerm extends Document {
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
export interface Slug extends Document {
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
export interface Teaser extends Document {
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
export interface UserInteraction extends Document {
  username: string;
  type: string;
  typeData: string[];
  timestamp: Date;
}

export interface UserInteractionDefine extends DumpOne {
  username: string;
  type: string;
  typeData?: string[];
  timestamp?: any;
}

// VerificationRequests
interface Processed {
  date: Date;
  status: string;
  verifier: string;
  feedback?: string;
}

export interface VerificationRequest extends Document {
  studentID: string;
  opportunityInstanceID: string;
  submittedOn: Date;
  status: string;
  processed: Processed[];
  documentation: string;
  ice?: Ice;
  retired?: boolean;
}

export interface VerificationRequestDefine extends DumpOne {
  student: string;
  opportunityInstance?: string;
  documentation: string;
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

export interface RelatedCoursesOrOpportunities {
  completed: string[];
  inPlan: string[];
  notInPlan: string[];
}

export interface Location {
  city?: string;
  country?: string;
  state?: string;
  zip?: string;
}

export interface Internship extends Document {
  urls: string[];
  guid?: string;
  position: string;
  description: string;
  lastScraped?: Date;
  missedUploads?: number;
  interestIDs: string[];
  company?: string;
  location?: Location[];
  contact?: string;
  posted?: string;
  due?: string;
}

export interface InternshipDefine extends DumpOne {
  urls: string[];
  position: string;
  description: string;
  lastScraped?: Date;
  missedUploads?: number;
  interests: string[];
  company?: string;
  location?: Location[];
  contact?: string;
  posted?: string;
  due?: string;
}

export interface InternshipUpdate extends Update {
  urls?: string[];
  position?: string;
  description?: string;
  interests?: string[];
  company?: string;
  location?: Location[];
  contact?: string;
  posted?: string;
  due?: string;
  missedUploads?: number;
}

export interface InternshipUpdateData extends Update {
  urls?: string[];
  position?: string;
  description?: string;
  interestIDs?: string[];
  interests?: string[];
  company?: string;
  location?: Location[];
  contact?: string;
  posted?: string;
  due?: string;
  missedUploads?: number;
}
