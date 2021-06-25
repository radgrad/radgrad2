import React from 'react';
import { Grid, Image, Label } from 'semantic-ui-react';
import InterestList from '../InterestList';
import OpportunityLabel from '../label/OpportunityLabel';
import { getSlugFromEntityID } from '../../landing/utilities/helper-functions';

interface UpComingEventsCardProps {
  event: {
    id: string,
    name: string,
    picture: string,
    date: string,
    label: string,
    interestIDs: string[];
  };
  plannerOppIDs: string[];
  userID: string,
}

const UpComingEventsCard: React.FC<UpComingEventsCardProps> = ({ event, plannerOppIDs, userID }) => {
  const rowStyle = { paddingBottom: 10 };
  return (
    <Grid.Row verticalAlign='middle'>
      <Grid.Column width={4}>
        <Image size='small' circular verticalAlign='middle' src={event.picture} />
      </Grid.Column>
      <Grid.Column width={12}>
        <Grid.Row style={rowStyle}>
          <OpportunityLabel key={event.id} userID={userID} slug={getSlugFromEntityID(event.id)} size="large" />
          { plannerOppIDs.includes(event.id) ? <Label attached='top right' size='small' color='green'>IN MY PLANNER</Label> : '' }
        </Grid.Row>
        <Grid.Row style={rowStyle}>
          {event.date} - {event.label}
        </Grid.Row>
        <Grid.Row style={rowStyle}>
          <InterestList item={event} size="tiny" />
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  );
};

export default UpComingEventsCard;
