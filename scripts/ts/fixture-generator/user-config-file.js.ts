import { ICollection } from './demo-fixture-generator';

export enum Grade {
  A = 'A',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B = 'B',
  B_MINUS = 'B-',
  C_PLUS = 'C+',
  C = 'C',
  C_MINUS = 'C-',
  D_PLUS = 'D+',
  D = 'D',
  D_MINUS = 'D-',
  F = 'F',
  CR = 'CR',
  NC = 'NC',
  UNK = '***',
}

export interface PlanCourseItem {
  slug: string;
  academicYearOffset: number;
  termNum: number;
  grade: Grade;
}

export interface PlanOpportunityItem {
  slug: string;
  academicYearOffset: number;
  termNum: number
  verified: boolean;
}

export interface PlanReviewItem {
  academicYearOffset: number;
  termNum: number
  reviewee: string;
  rating: number;
  comments: string;
}

export interface StudentPlan {
  username: string;
  courses: PlanCourseItem[];
  opportunities: PlanOpportunityItem[];
  reviews: PlanReviewItem[];
}

export interface StudentConfig {
  studentProfiles: ICollection;
  studentPlans: StudentPlan[];
}

// Ekahi
// Elua
// Ekolu
// Eha
// Elima
// Eono
// Ehiku
// Ewala
// Eiwa
// Umi
