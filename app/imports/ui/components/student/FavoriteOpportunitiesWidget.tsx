import * as React from 'react';
import { Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import FavoriteOpportunityCard from './FavoriteOpportunityCard';

interface IFavoriteOpportunitiesWidgetProps {
  match: object;
  studentID: string;
  opportunities: IOpportunity[];
}

const FavoriteOpportunitiesWidget = (props: IFavoriteOpportunitiesWidgetProps) => (
    <Card.Group itemsPerRow={1}>
      {_.map(props.opportunities, (o) => (<FavoriteOpportunityCard key={o._id} opportunity={o} studentID={props.studentID}/>))}
    </Card.Group>
  );

export default withRouter(withTracker((props) => {
  const studentID = getUserIdFromRoute(props.match);
  const favorites = FavoriteOpportunities.findNonRetired({ studentID });
  const opportunities = _.map(favorites, (f) => Opportunities.findDoc(f.opportunityID));
  return {
    studentID,
    opportunities,
  };
})(FavoriteOpportunitiesWidget));
