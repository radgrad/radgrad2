import moment from 'moment';
import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import DeleteItemButton from '../DeleteItemButton';
import EditOpportunityButton from './EditOpportunityButton';
import { ManageOpportunityProps } from './ManageOpportunityProps';

const ManageOpportunityItem: React.FC<ManageOpportunityProps> = ({ opportunity, opportunityTypes, interests, sponsors, terms }) => {
  const updatedOn = opportunity.updatedAt ? opportunity.updatedAt : opportunity.createdAt;
  const updatedOnStr = `Updated on ${moment(updatedOn).format('MM/DD/YYYY')}`;
  return (
    <Grid.Row>
      <Grid.Column width={4}>
        {opportunity.retired ? <Icon name='eye slash' /> : '' }
        {opportunity.name}
      </Grid.Column>
      <Grid.Column width={2}>
        <EditOpportunityButton opportunity={opportunity} sponsors={sponsors} terms={terms} interests={interests} opportunityTypes={opportunityTypes} />
      </Grid.Column>
      <Grid.Column width={2}>
        <DeleteItemButton item={opportunity} type={PROFILE_ENTRY_TYPE.OPPORTUNITY} />
      </Grid.Column>
      <Grid.Column width={5} />
      <Grid.Column width={3}>
        {updatedOnStr}
      </Grid.Column>
    </Grid.Row>
  );
};

export default ManageOpportunityItem;
