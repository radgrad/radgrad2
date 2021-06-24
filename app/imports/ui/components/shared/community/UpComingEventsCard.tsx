import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import { useRouteMatch } from 'react-router';
import InterestList from '../InterestList';
import OpportunityLabel from '../label/OpportunityLabel';
import { getSlugFromEntityID } from '../../landing/utilities/helper-functions';
import * as Router from '../utilities/router';

interface UpComingEventsCardProps {
  event: {
    id: string,
    name: string,
    picture: string,
    date: string,
    label: string,
    interestIDs: string[];
  };
}

const UpComingEventsCard: React.FC<UpComingEventsCardProps> = ({ event }) => {
  const info = `${event.date} - ${event.label}`;
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  return (
    <Grid.Row>
      <Grid.Column width={4}>
        <Image size='small' circular verticalAlign='middle' src={event.picture} />
      </Grid.Column>
      <Grid.Column width={12}>
        <OpportunityLabel key={event.id} userID={userID} slug={getSlugFromEntityID(event.id)} size="medium" />
        <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={info}/>
        <InterestList item={event} size="small" />
      </Grid.Column>
    </Grid.Row>
  );
};

export default UpComingEventsCard;
