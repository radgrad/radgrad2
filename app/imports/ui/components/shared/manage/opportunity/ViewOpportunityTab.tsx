import React from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import { AcademicTerm, BaseProfile, Interest, Opportunity, OpportunityType } from '../../../../../typings/radgrad';

import ManageOpportunityItem from './ManageOpportunityItem';

export interface ViewOpportunityTabProps {
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
    <Grid stackable textAlign='center'>
      {opportunities.length > 0 ? (opportunities.map((opp) => <ManageOpportunityItem opportunity={opp} sponsors={sponsors} terms={terms}
        interests={interests} opportunityTypes={opportunityTypes} key={opp._id} />)) :
        'You are not sponsoring any Opportunities and so there are none for you to manage at this time.'}
    </Grid>
  </Tab.Pane>
);

export default ViewOpportunityTab;
