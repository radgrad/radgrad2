import { AcademicTerm, BaseProfile, Interest, Opportunity, OpportunityType } from '../../../../../typings/radgrad';

export interface ManageOpportunityProps {
  opportunity: Opportunity;
  sponsors: BaseProfile[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  terms: AcademicTerm[];
}
