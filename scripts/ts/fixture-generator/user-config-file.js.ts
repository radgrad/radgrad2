interface Collection {
  name: string;
  contents: object[];
}

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
  academicTermOffset: number;
  grade: Grade;
}

export interface PlanOpportunityItem {
  slug: string;
  academicTermOffset: number;
  verified: boolean;
}

export interface PlanReviewItem {
  academicTermOffset: number;
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
  studentProfiles: Collection;
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
