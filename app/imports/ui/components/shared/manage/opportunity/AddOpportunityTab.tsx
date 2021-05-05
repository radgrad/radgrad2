import React from 'react';
import { Tab } from 'semantic-ui-react';
import { AcademicTerm, BaseProfile, Interest, OpportunityType } from '../../../../../typings/radgrad';
import AddOpportunityForm from '../../../admin/datamodel/opportunity/AddOpportunityForm';

interface AddOpportunityTabProps {
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
}

const AddOpportunityTab: React.FC<AddOpportunityTabProps> = ({ sponsors, terms, interests, opportunityTypes }) => (
  <Tab.Pane>
    <AddOpportunityForm sponsors={sponsors} terms={terms} interests={interests} opportunityTypes={opportunityTypes} />
  </Tab.Pane>
);

export default AddOpportunityTab;

