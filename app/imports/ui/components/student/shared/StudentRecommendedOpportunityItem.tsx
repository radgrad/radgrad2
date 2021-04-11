import React from 'react';
import { useRouteMatch } from 'react-router';
import { Grid, Header } from 'semantic-ui-react';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { ButtonLink } from '../../shared/button/ButtonLink';
import IceHeader from '../../shared/IceHeader';
import * as RouterUtils from '../../shared/utilities/router';

interface StudentRecommendedOpportunityItemProps {
  opportunityID: string;
}

const StudentRecommendedOpportunityItem: React.FC<StudentRecommendedOpportunityItemProps> = ({ opportunityID }) => {
  const opportunity = Opportunities.findDoc(opportunityID);
  const slug = Slugs.getNameFromID(opportunity.slugID);
  const match = useRouteMatch();
  return (
    <Grid.Row columns='two'>
      <Grid.Column floated='left'>
        <Header>{opportunity.name} <IceHeader ice={opportunity.ice} /></Header>
      </Grid.Column>
      <Grid.Column floated='right' textAlign='right'>
        <ButtonLink url={RouterUtils.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`)} label='see details / add to profile' icon='search plus' size='small'/>
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentRecommendedOpportunityItem;
