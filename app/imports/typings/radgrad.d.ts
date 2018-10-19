interface Ice { i: number; c: number; e: number; }

// AcademicPlans
interface IapDefine { slug: string; degreeSlug: string; name: string; description: string; semester: string; coursesPerSemester: number[]; courseList: string[]; }
interface IapUpdate { degreeSlug?: string; name?: string; semester?: string; coursesPerSemester?: number[]; courseList?: string[]; }
// AcademicYearInstances
interface IayDefine  { year: number; student: string; }
// CareerGoals
interface IcgDefine { name: string; slug: string; description: string; interests: string[]; }
interface IcgUpdate { name?: string; description?: string; interests?: string[]; }
// CourseInstances
interface IciDefine { semester: string; course: string; verified?: boolean; fromSTAR?: boolean; grade?: string; note?: string; student: string; creditHrs?: number; }
interface IciUpdate { semesterID?: string; verified?: boolean; fromSTAR?: boolean; grade?: string; creditHrs?: number; note?: string; ice?: Ice; }
// Courses
interface IcoDefine { name: string; shortName?: string; slug: string; num: string; description: string; creditHrs?: number; interests?: string[]; syllabus?: string; prerequisites?: string[]; }
interface IcoUpdate { name?: string; shortName?: string; num?: string; description?: string; creditHrs?: number; interests?: string[]; prerequisites?: string[]; syllabus?: string; }
// DesiredDegree
interface IddDefine { name: string; shortName?: string; slug: string; description: string; }
interface IddUpdate { name?: string; shortName?: string; description?: string; }
// Feeds
interface IfeedUpdate { description?: string; picture?: string; users?: string[]; opportunity?: string; course?: string; semester?: string; }
// FeedBackInstances
interface IfbiDefine { user: string; functionName: string; description: string; feedbackType: string; }
interface IfbiUpdate { user?: string; functionName?: string; description?: string; feedbackType?: string; }
// IceSnapshots
interface IisDefine { username: string; level: number; i: number; c: number; e: number; updated: any; }
// OpportunityInstances
interface IoiDefine { semester: string; opportunity: string; sponsor: string; verified: boolean; student: string; }
interface IoiUpdate { semesterID?: string; verified?: boolean; ice?: Ice; }
// UserInteractions
interface IuiDefine { username: string; type: string; typeData: string; timestamp?: any; }
