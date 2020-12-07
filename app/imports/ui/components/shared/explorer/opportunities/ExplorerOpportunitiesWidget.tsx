import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Header, Divider, Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { availableOpps, checkForNoItems, IExplorerTypes, matchingOpportunities } from '../utilities/explorer';
import OpportunitySortWidget, { opportunitySortKeys } from './OpportunitySortWidget';
import OpportunityInformationItem, { IOpportunityInformationItemConfiguration } from './OpportunityInformationItem';
import * as Router from '../../utilities/router';
import { FavoriteInterests } from '../../../../../api/favorite/FavoriteInterestCollection';
import PreferedChoice from '../../../../../api/degree-plan/PreferredChoice';
import { IOpportunity } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { RootState } from '../../../../../redux/types';
import CardExplorersPaginationWidget from './ExplorerOpportunitiesPaginationWidget';
import { ICardExplorersPaginationState } from '../../../../../redux/shared/cardExplorer/reducers';

interface ICardExplorerOpportunitiesWidgetProps {
  pagination: ICardExplorersPaginationState;
}

const opportunityInformationItemConfiguration: IOpportunityInformationItemConfiguration = {
  showLogo: true,
  showMetadata: true,
  showStudentsParticipating: true,
};

const mapStateToProps = (state: RootState) => ({
  pagination: state.shared.cardExplorer.pagination.Opportunities,
});

const ExplorerOpportunitiesWidget: React.FC<ICardExplorerOpportunitiesWidgetProps> = ({ pagination }) => {
  const match = useRouteMatch();

  const [sortOpportunitiesChoiceState, setSortOpportunitiesChoice] = useState(opportunitySortKeys.recommended);
  const opportunitiesItemCount = availableOpps(match).length;
  let opportunities: IOpportunity[] = matchingOpportunities(match);

  switch (sortOpportunitiesChoiceState) {
    case opportunitySortKeys.recommended:
      // eslint-disable-next-line no-case-declarations
      const userID = Router.getUserIdFromRoute(match);
      // eslint-disable-next-line no-case-declarations
      const favorites = FavoriteInterests.findNonRetired({ userID });
      // eslint-disable-next-line no-case-declarations
      const interestIDs = _.map(favorites, (f) => f.interestID);
      // eslint-disable-next-line no-case-declarations
      const preferred = new PreferedChoice(opportunities, interestIDs);
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
        <Header>OPPORTUNITIES <WidgetHeaderNumber inputValue={opportunitiesItemCount} /></Header>
        <OpportunitySortWidget
          sortChoice={sortOpportunitiesChoiceState}
          handleChange={(key, value) => {
            setSortOpportunitiesChoice(value);
          }}
        />
        <Divider />
      </Grid.Row>
      <Grid.Row>
        {checkForNoItems(match, EXPLORER_TYPE.OPPORTUNITIES as IExplorerTypes)}
        {opportunities.map((opportunity) => (
          <OpportunityInformationItem
            key={opportunity._id}
            opportunity={opportunity}
            informationConfiguration={opportunityInformationItemConfiguration}
          />
        ))}
      </Grid.Row>
      <Grid>
        <Grid.Row>
          <Container textAlign="center">
            <CardExplorersPaginationWidget
              type={EXPLORER_TYPE.OPPORTUNITIES}
              totalCount={opportunitiesCount}
              displayCount={displayOpportunitiesCount}
            />
          </Container>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default connect(mapStateToProps, null)(ExplorerOpportunitiesWidget);
