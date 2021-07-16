import React from 'react';
import { Grid, Image, Label } from 'semantic-ui-react';
import InterestList from '../InterestList';
import OpportunityLabel from '../label/OpportunityLabel';
import { getSlugFromEntityID } from '../../landing/utilities/helper-functions';
import RadGradHeader from '../RadGradHeader';

interface UpComingEventsListProps {
  event: {
    id: string,
    OpportunityID: string,
    name: string,
    picture: string,
    date: string,
    label: string,
    interestIDs: string[];
  };
  plannerOppIDs: string[];
  userID: string,
}

const UpComingEventsList: React.FC<UpComingEventsListProps> = ({ event, plannerOppIDs, userID }) => {
  const rowStyle = { paddingBottom: 10 };
  const titleStyle = { margin: 0 };
  return (
    <Grid.Row verticalAlign='middle'>
      <Grid.Column width={16} style={titleStyle}>
        <RadGradHeader title={`${event.label}: ${event.date}`} dividing={false}/>
        { plannerOppIDs.includes(event.OpportunityID) ? <Label attached='top right' size='small' color='green'>IN MY PLANNER</Label> : '' }
      </Grid.Column>
      <Grid.Column width={3}>
        <Image size='small' circular verticalAlign='middle' src={event.picture} />
      </Grid.Column>
      <Grid.Column width={13}>
        <Grid.Row style={rowStyle}>
          <OpportunityLabel key={event.OpportunityID} userID={userID} slug={getSlugFromEntityID(event.OpportunityID)} size="medium" />
        </Grid.Row>
        <Grid.Row style={rowStyle}>
          <InterestList item={event} size="tiny" />
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  );
};

export default UpComingEventsList;
