import React from 'react';
import Markdown from 'react-markdown';
import { Grid, List, Segment } from 'semantic-ui-react';
import { Internship, Profile } from '../../../../../../typings/radgrad';

interface ExplorerInternshipProps {
  internship: Internship;
  profile: Profile;
}

const ExplorerInternship: React.FC<ExplorerInternshipProps> = ({ internship, profile }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const compactRowStyle = { paddingTop: 3, paddingBottom: 3 };
  const gridStyle = { paddingLeft: 17, paddingTop: 10, paddingBottom: 17 };

  console.log(internship.location);
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
            <strong>Location:</strong>&nbsp;{internship.location}
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
