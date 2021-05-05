import React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import AddOpportunityTab from './AddOpportunityTab';
import ViewOpportunityTab, { ViewOpportunityTabProps } from './ViewOpportunityTab';

const ManageOpportunitiesTabs: React.FC<ViewOpportunityTabProps> = ({ sponsors, terms, interests, opportunities, opportunityTypes }) => {
  const panes = [
    {
      menuItem: 'VIEW',
      render: () => (<ViewOpportunityTab sponsors={sponsors} terms={terms} interests={interests} opportunityTypes={opportunityTypes} opportunities={opportunities} />),
    },
    {
      menuItem: 'ADD NEW',
      render: () => (<AddOpportunityTab sponsors={sponsors} terms={terms} interests={interests} opportunityTypes={opportunityTypes} />),
    },
  ];
  return (
    <Segment basic>
      <Tab panes={panes} />
    </Segment>
  );
};

export default ManageOpportunitiesTabs;
