interface Ice { i: number; c: number; e: number; }

interface IcgDefine { name: string; slug: string; description: string; interests: string[]; }
interface IcgUpdate { name?: string; description?: string; interests?: string[]; }
interface IisDefine { username: string; level: number; i: number; c: number; e: number; updated: any; }
interface IoiDefine { semester: string; opportunity: string; sponsor: string; verified: boolean; student: string; }
interface IoiUpdate { semesterID?: string; verified?: boolean; ice?: Ice; }
interface IuiDefine { username: string; type: string; typeData: string; timestamp: any; }
