import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Divider, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { availableOpps, checkForNoItems, IExplorerTypes, matchingOpportunities } from '../explorer-helper-functions';
import { IMatchProps } from '../RouterHelperFunctions';
import OpportunitySortWidget, { opportunitySortKeys } from '../OpportunitySortWidget';
import OpportunityCardWidget from './OpportunityInformationItem';
import * as Router from '../RouterHelperFunctions';
import { FavoriteInterests } from '../../../../api/favorite/FavoriteInterestCollection';
import PreferedChoice from '../../../../api/degree-plan/PreferredChoice';
import { IOpportunity } from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface ICardExplorerOpportunitiesWidgetProps {
  match: IMatchProps;
}

const CardExplorerOpportunitiesWidget = (props: ICardExplorerOpportunitiesWidgetProps) => {
  const { match } = props;
  const [sortOpportunitiesChoiceState, setSortOpportunitiesChoice] = useState(opportunitySortKeys.recommended);

  const opportunitiesItemCount = availableOpps(match).length;
  let opportunities: IOpportunity[] = matchingOpportunities(match);
  switch (sortOpportunitiesChoiceState) {
    case opportunitySortKeys.recommended:
      // eslint-disable-next-line no-case-declarations
      const userID = Router.getUserIdFromRoute(props.match);
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
  return (
    <>
      <Grid.Row>
        <Header>
          OPPORTUNITIES <WidgetHeaderNumber inputValue={opportunitiesItemCount} />
        </Header>
        {checkForNoItems(match, EXPLORER_TYPE.OPPORTUNITIES as IExplorerTypes)}
        <OpportunitySortWidget
          sortChoice={sortOpportunitiesChoiceState}
          handleChange={(key, value) => {
            setSortOpportunitiesChoice(value);
          }}
        />
        <Divider />
      </Grid.Row>
      {opportunities.map((opportunity) => (
        <OpportunityCardWidget key={opportunity._id} opportunity={opportunity} />
      ))}
    </>
  );
};

export default withRouter(CardExplorerOpportunitiesWidget);
