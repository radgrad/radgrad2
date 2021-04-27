import React from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import { AcademicTerm, BaseProfile, Interest, Opportunity, OpportunityType } from '../../../../typings/radgrad';
import ManageOpportunityItem from './ManageOpportunityItem';

interface ViewOpportunityTabProps {
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  opportunities: Opportunity[];
}

const ViewOpportunityTab: React.FC<ViewOpportunityTabProps> = ({
  sponsors,
  terms,
  interests,
  opportunityTypes,
  opportunities,
}) => (
  <Tab.Pane>
    <Grid stackable>
      {opportunities.map((opp) => <ManageOpportunityItem opportunity={opp} sponsors={sponsors} terms={terms}
                                                         interests={interests} opportunityTypes={opportunityTypes} />)}
    </Grid>
  </Tab.Pane>
);

export default ViewOpportunityTab;
