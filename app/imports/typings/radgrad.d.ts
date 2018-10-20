import { defaultProfilePicture } from '../api/user/BaseProfileCollection';

interface Ice { i: number; c: number; e: number; }
interface IDumpOne { slug?: string; }

// AcademicPlans
interface IapDefine extends IDumpOne { slug: string; degreeSlug: string; name: string; description: string; semester: string; coursesPerSemester: number[]; courseList: string[]; }
interface IapUpdate { degreeSlug?: string; name?: string; semester?: string; coursesPerSemester?: number[]; courseList?: string[]; }
// AcademicYearInstances
interface IayDefine extends IDumpOne { year: number; student: string; }
// AdvisorLogs
interface IadvisorLogDefine extends IDumpOne { advisor: string; student: string; text: string; createdOn?: any; }
interface IadvisorLogUpdate { id?: string; text?: string; }
// AdvisorProfiles
interface IAdvisorProfileDefine extends IDumpOne { username: string; firstName: string; lastName: string; picture?: string; website?: string; interests?: string[]; careerGoals?: string[]; }
// CareerGoals
interface IcgDefine extends IDumpOne { name: string; slug: string; description: string; interests: string[]; }
interface IcgUpdate { name?: string; description?: string; interests?: string[]; }
// CourseInstances
interface IciDefine extends IDumpOne { semester: string; course: string; verified?: boolean; fromSTAR?: boolean; grade?: string; note?: string; student: string; creditHrs?: number; }
interface IciUpdate { semesterID?: string; verified?: boolean; fromSTAR?: boolean; grade?: string; creditHrs?: number; note?: string; ice?: Ice; }
// Courses
interface IcoDefine extends IDumpOne { name: string; shortName?: string; slug: string; num: string; description: string; creditHrs?: number; interests?: string[]; syllabus?: string; prerequisites?: string[]; }
interface IcoUpdate { name?: string; shortName?: string; num?: string; description?: string; creditHrs?: number; interests?: string[]; prerequisites?: string[]; syllabus?: string; }
// DesiredDegree
interface IddDefine extends IDumpOne { name: string; shortName?: string; slug: string; description: string; }
interface IddUpdate { name?: string; shortName?: string; description?: string; }
// Feeds
interface IfeedUpdate { description?: string; picture?: string; users?: string[]; opportunity?: string; course?: string; semester?: string; }
// FeedBackInstances
interface IfbiDefine extends IDumpOne { user: string; functionName: string; description: string; feedbackType: string; }
interface IfbiUpdate { user?: string; functionName?: string; description?: string; feedbackType?: string; }
// Help Messages
interface IhelpDefine extends IDumpOne { routeName: string; title: string; text: string; }
interface IhelpUpdate { routeName?: string; title?: string; text?: string; }
// Interests
interface IinterestDefine extends IDumpOne { name: string; slug: string; description: string; interestType: string; }
interface IinterestUpdate { name?: string; description?: string; interestType?: string; }
// InterestTypes
interface ITypeDefine extends IDumpOne { name: string; slug: string; description: string; }
interface ITypeUpdate { name?: string; description?: string; }
// IceSnapshots
interface IisDefine extends IDumpOne { username: string; level: number; i: number; c: number; e: number; updated: any; }
// MentorAnswers
interface IMentorAnswerDefine extends IDumpOne { question: string; mentor: string; text: string; }
interface IMentorAnswerUpdate { text?: string; }
// MentorQuestions
interface IMentorQuestionDefine extends IDumpOne { question: string; slug: string; student: string; moderated?: boolean; visible?: boolean; moderatorComments?: string; }
interface IMentorQuestionUpdate { question?: string; student?: string; moderated?: boolean; visible?: boolean; moderatorComments?: string; }
// Opportunities
interface IOpportunityDefine extends IDumpOne { name: string; slug: string; description: string; opportunityType: string; sponsor: string; interests: string[]; semesters: string[]; ice: Ice; eventDate?: any; }
interface IOpportunityUpdate { name?: string; description?: string; opportunityType?: string; sponsor?: string; interests?: string[]; semesters?: string[]; eventDate?: any; ice?: Ice; }
interface IOpportunityUpdateData { name?: string; description?: string; opportunityTypeID?: string; sponsorID?: string; interestIDs?: string[]; semesterIDs?: string[]; eventDate?: any; ice?: Ice; }
// OpportunityInstances
interface IOpportunityInstanceDefine extends IDumpOne { semester: string; opportunity: string; sponsor: string; verified: boolean; student: string; }
interface IOpportunityInstanceUpdate { semesterID?: string; verified?: boolean; ice?: Ice; }
// Reviews
interface IReviewDefine extends IDumpOne { slug?: string; student: string; reviewType: string; reviewee: string; semester: string; rating?: number; comments: string; moderated?: boolean; visible?: boolean; moderatorComments?: string; }
interface IReviewUpdate { semester?: string; rating?: number; comments?: string; moderated?: boolean; visible?: boolean; moderatorComments?: string; }
interface IReviewUpdateData { semesterID?: string; rating?: number; comments?: string; moderated?: boolean; visible?: boolean; moderatorComments?: string; }
// Semesters
interface ISemesterDefine extends IDumpOne {term: string; year: number; }
// Slugs
interface ISlugDefine extends IDumpOne { name: string; entityName: string; }
// StarDataObject
interface IStarDataObject { semester: string; name: string; num: string; credits: number; grade: string; student: string; }
// Teasers
interface ITeaserDefine extends IDumpOne { title: string; slug: string; author: string; url: string; description: string; duration: string; interests: string[]; opportunity: string; }
interface ITeaserUpdate { title?: string; opportunity?: string; interests?: string[]; author?: string; url?: string; description?: string; duration?: string; }
interface ITeaserUpdateData { title?: string; opportunityID?: string; interestIDs?: string[]; author?: string; url?: string; description?: string; duration?: string; }
// UserInteractions
interface IuiDefine extends IDumpOne { username: string; type: string; typeData: string; timestamp?: any; }

interface IBaseProfile { userID: string; username: string; firstName: string; lastName: string; role: string; picture?: string; website?: string; interestIDs: string[]; careerGoalIDs: string[]; }
