import React from 'react';
import { Grid, Image, Label } from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
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
  const info = `${event.date} - ${event.label}`;
  return (
    <Grid.Row>
      <Grid.Column width={4}>
        <Image size='small' circular verticalAlign='middle' src={event.picture} />
      </Grid.Column>
      <Grid.Column width={12}>
        <Grid.Row>
          <OpportunityLabel key={event.id} userID={userID} slug={getSlugFromEntityID(event.id)} size="medium" />
          { plannerOppIDs.includes(event.id) ? <Label attached='top right' color='green'>IN MY PLANNER</Label> : '' }
        </Grid.Row>
        <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={info}/>
        <InterestList item={event} size="small" />
      </Grid.Column>
    </Grid.Row>
  );
};

export default UpComingEventsCard;
