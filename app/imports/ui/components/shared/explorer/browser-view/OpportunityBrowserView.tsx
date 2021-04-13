import React from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Header, Divider, Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { availableOpps, checkForNoItems, IExplorerTypes, matchingOpportunities } from '../utilities/explorer';
import OpportunitySortWidget, { opportunitySortKeys } from './OpportunitySortWidget';
import OpportunityInformationItem, { OpportunityInformationItemConfiguration } from './OpportunityInformationItem';
import * as Router from '../../utilities/router';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';
import { Opportunity } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { RootState } from '../../../../../redux/types';
import CardExplorersPaginationWidget from './ExplorerOpportunitiesPaginationWidget';
import { CardExplorersPaginationState } from '../../../../../redux/shared/cardExplorer/reducers';

interface CardExplorerOpportunitiesWidgetProps {
  pagination: CardExplorersPaginationState;
  sortValue: string;
}

const opportunityInformationItemConfiguration: OpportunityInformationItemConfiguration = {
  showLogo: true,
  showMetadata: true,
  showStudentsParticipating: false,
};

const mapStateToProps = (state: RootState) => ({
  pagination: state.shared.cardExplorer.pagination.Opportunities,
  sortValue: state.shared.cardExplorer.opportunities.sortValue,
});

const OpportunityBrowserView: React.FC<CardExplorerOpportunitiesWidgetProps> = ({ pagination, sortValue }) => {
  const match = useRouteMatch();

  const opportunitiesItemCount = availableOpps(match).length;
  let opportunities: Opportunity[] = matchingOpportunities(match);

  switch (sortValue) {
    case opportunitySortKeys.recommended:
      // eslint-disable-next-line no-case-declarations
      const userID = Router.getUserIdFromRoute(match);
      // eslint-disable-next-line no-case-declarations
      const profileEntries = ProfileInterests.findNonRetired({ userID });
      // eslint-disable-next-line no-case-declarations
      const interestIDs = profileEntries.map((f) => f.interestID);
      // eslint-disable-next-line no-case-declarations
      const preferred = new PreferredChoice(opportunities, interestIDs);
      opportunities = preferred.getOrderedChoices();
      break;
    case opportunitySortKeys.innovation:
      opportunities = _.sortBy(opportunities, (item) => -item.ice.i);
      break;
    case opportunitySortKeys.experience:
      opportunities = _.sortBy(opportunities, (item) => -item.ice.e);
      break;
    default:
      opportunities = _.sortBy(opportunities, (item) => item.name);
  }

  // Pagination Variables
  const opportunitiesCount = opportunities.length;
  const displayOpportunitiesCount = 7;
  const startIndex = pagination.showIndex * displayOpportunitiesCount;
  const endIndex = startIndex + displayOpportunitiesCount;
  opportunities = opportunities.slice(startIndex, endIndex);
  return (
    <div id="opportunities-page">
      <Grid.Row>
        <Header>
          OPPORTUNITIES <WidgetHeaderNumber inputValue={opportunitiesItemCount} />
        </Header>
        <OpportunitySortWidget />
        <Divider />
      </Grid.Row>
      <Grid.Row>
        {checkForNoItems(match, EXPLORER_TYPE.OPPORTUNITIES as IExplorerTypes)}
        {opportunities.map((opportunity) => (
          <OpportunityInformationItem key={opportunity._id} opportunity={opportunity} informationConfiguration={opportunityInformationItemConfiguration} />
        ))}
      </Grid.Row>
      <Grid>
        <Grid.Row>
          <Container textAlign="center">
            <CardExplorersPaginationWidget type={EXPLORER_TYPE.OPPORTUNITIES} totalCount={opportunitiesCount} displayCount={displayOpportunitiesCount} />
          </Container>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default connect(mapStateToProps, null)(OpportunityBrowserView);
