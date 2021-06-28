import { AcademicTerm, BaseProfile, Interest, Opportunity, OpportunityType } from '../../../../../typings/radgrad';

export interface ManageOpportunityProps {
  terms: AcademicTerm[];
  opportunity: Opportunity;
  sponsors: BaseProfile[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}
