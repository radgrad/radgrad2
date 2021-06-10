import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import { Profile, RelatedCoursesOrOpportunities } from '../../../typings/radgrad';
import OpportunityList from './OpportunityList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { ROLE } from '../../../api/role/Role';

interface RelatedOpportunitiesProps {
  relatedOpportunities: RelatedCoursesOrOpportunities;
  profile: Profile;
}

const RelatedOpportunities: React.FC<RelatedOpportunitiesProps> = ({ relatedOpportunities, profile }) => {
  const header = <RadGradHeader title='related opportunities' icon={EXPLORER_TYPE_ICON.OPPORTUNITY} />;
  const style = { paddingBottom: '0', textAlign: 'center' };
  return (
    <RadGradSegment header={header}>
      {profile.role === ROLE.STUDENT ? (
        <Grid stackable padded>
          <Grid.Row style={style}>
            <Header as="h4">
              <Icon name="checkmark" color="green" />
              Completed
            </Header>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: '0.5rem' }}>
            <OpportunityList opportunities={relatedOpportunities.completed.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="completedOpp" userID={profile.userID} />
          </Grid.Row>
          <hr style={{ width: '100%' }}/>
          <Grid.Row style={style}>
            <Header as="h4">
              <Icon name="warning sign" color="yellow" />
              In Plan (Not Yet Completed)
            </Header>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: '0.5rem' }}>
            <OpportunityList opportunities={relatedOpportunities.inPlan.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="oppInPlan" userID={profile.userID} />
          </Grid.Row>
          <hr style={{ width: '100%' }}/>
          <Grid.Row style={style}>
            <Header as="h4">
              <Icon name="warning circle" color="red" />
              Not In Plan
            </Header>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: '0.5rem' }}>
            <OpportunityList opportunities={relatedOpportunities.notInPlan.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="oppNotInPlan" userID={profile.userID} />
          </Grid.Row>
        </Grid>
      ) : (
        <OpportunityList opportunities={relatedOpportunities.notInPlan.map((id) => Opportunities.findDoc(id))} size="medium" keyStr="oppsNotInPlan" userID={profile.userID} />
      )}
    </RadGradSegment>
  );
};

export default RelatedOpportunities;
