import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';

interface UpComingEventsCardProps {
  event: {
    name: string,
    picture: string,
    date: string,
    label: string,
  };
}

const UpComingEventsCard: React.FC<UpComingEventsCardProps> = ({ event }) => {
  const info = `
  ${event.name}: ${event.label}
  
  ${event.date}
  `;
  return (
    <Grid.Row>
      <Grid.Column width={4}>
        <Image size='small' circular verticalAlign='middle' src={event.picture} />
      </Grid.Column>
      <Grid.Column width={12}>
        <ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={info}/>
      </Grid.Column>
    </Grid.Row>
  );
};

export default UpComingEventsCard;
