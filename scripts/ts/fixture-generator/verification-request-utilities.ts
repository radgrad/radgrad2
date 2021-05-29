import { OpportunityInstance } from './opportunity-instance-utilities';

interface Processed {
  date: Date;
  status: string;
  verifier: string;
  feedback?: string;
}

interface VerificationRequest {
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

export const generateVerificationRequest = (opportunityInstance: OpportunityInstance): VerificationRequest => {
  const student = opportunityInstance.student;
  const documentation = `I completed ${opportunityInstance.opportunity}`;
  const academicTerm = opportunityInstance.academicTerm;
  const opportunity = opportunityInstance.opportunity;
  return {
    student,
    documentation,
    academicTerm,
    opportunity,
  };
};
