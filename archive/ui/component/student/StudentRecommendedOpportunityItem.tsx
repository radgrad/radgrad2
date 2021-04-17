import React from 'react';
import { useRouteMatch } from 'react-router';
import { Grid, Header } from 'semantic-ui-react';
import { Opportunities } from '../../../../app/imports/api/opportunity/OpportunityCollection';
import { Slugs } from '../../../../app/imports/api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../../app/imports/ui/layouts/utilities/route-constants';
import { ButtonLink } from '../../../../app/imports/ui/components/shared/button/ButtonLink';
import IceHeader from '../../../../app/imports/ui/components/shared/IceHeader';
import * as RouterUtils from '../../../../app/imports/ui/components/shared/utilities/router';

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
        <ButtonLink url={RouterUtils.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`)} label='See details / Add to profile' icon='search plus' size='mini'/>
      </Grid.Column>
    </Grid.Row>
  );
};

export default StudentRecommendedOpportunityItem;
