import React from 'react';
import { useRouteMatch } from 'react-router';
import { Grid, Header, Label } from 'semantic-ui-react';
import { Opportunities } from '../../../../app/imports/api/opportunity/OpportunityCollection';
import { ButtonLink } from '../../../../app/imports/ui/components/shared/button/ButtonLink';
import IceHeader from '../../../../app/imports/ui/components/shared/IceHeader';
import * as RouterUtils from '../../../../app/imports/ui/components/shared/utilities/router';

interface StudentProfileOpportunityItemProps {
  opportunityID: string;
}

const StudentProfileOpportunityItem: React.FC<StudentProfileOpportunityItemProps> = ({ opportunityID }) => {
  const opportunity = Opportunities.findDoc(opportunityID);
  const match = useRouteMatch();
  return (
    <Grid.Row columns='three'>
      <Grid.Column>
        <Label color='green' size='large'>IN PROFILE</Label>
      </Grid.Column>
      <Grid.Column floated='left' textAlign='left'>
        <Header>{opportunity.name} <IceHeader ice={opportunity.ice} /></Header>
      </Grid.Column>
      <Grid.Column textAlign='right'>
        <ButtonLink url={RouterUtils.buildRouteName(match, '/degree-planner')} label='Add to degree plan' icon='search plus' size='small'/>
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentProfileOpportunityItem;

