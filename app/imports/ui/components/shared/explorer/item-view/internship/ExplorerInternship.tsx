import moment from 'moment';
import React from 'react';
import Markdown from 'react-markdown';
import { Grid, Item, List, Segment } from 'semantic-ui-react';
import { Internship, Profile } from '../../../../../../typings/radgrad';
import LocationItem from './LocationItem';

interface ExplorerInternshipProps {
  internship: Internship;
  profile: Profile;
}

const ExplorerInternship: React.FC<ExplorerInternshipProps> = ({ internship, profile }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const compactRowStyle = { paddingTop: 3, paddingBottom: 3 };
  const gridStyle = { paddingLeft: 17, paddingTop: 10, paddingBottom: 17 };

  return (
    <div id="internshipExplorer">
      <Segment className="container" style={segmentStyle}>
        <Grid stackable style={gridStyle}>
          <Grid.Row style={compactRowStyle}>
            <strong>Position:</strong>&nbsp;{internship.position}
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong>Company:</strong>&nbsp;{internship.company}
          </Grid.Row>
          <Grid.Row style={compactRowStyle}>
            <strong>{internship.urls.length > 1 ? 'URLs:' : 'URL:'}</strong>&nbsp;
            <List>
              {internship.urls.map(url => (<List.Item key={url}><a href={url} target='_blank' rel="noreferrer">{url}</a></List.Item>))}
            </List>
          </Grid.Row>
          <Grid.Row>
            <Item.Group>
              {internship.location.map(loc => <LocationItem key={`${internship._id}-${loc.city}-${loc.state}-${loc.country}-${loc.zip}`} city={loc.city} country={loc.country} state={loc.state} zip={loc.zip} />)}
            </Item.Group>
          </Grid.Row>
          <Grid.Row>
            <strong>Last seen:&nbsp;</strong>{moment(internship.lastScraped).format('MM/DD/YYYY')}
          </Grid.Row>
          <Grid.Row>
            <strong>Description:</strong>
            <Markdown escapeHtml linkTarget="_blank">{internship.description}</Markdown>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default ExplorerInternship;
