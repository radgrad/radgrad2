import React from 'react';
import { Container, Divider, Feed, Header, Segment } from 'semantic-ui-react';
import StudentFeedItem from './CommunityFeedItem';
import { IFeed } from '../../../../typings/radgrad';

interface StudentFeedWidgetProps {
  feeds: IFeed[];
}

const CommunityFeedWidget: React.FC<StudentFeedWidgetProps> = ({ feeds }) => {
  const feedStyle = {
    maxHeight: '325px',
    overflowY: 'scroll',
    marginTop: '10px',
  };

  return (
    <Container id="community-feed-widget">
      <Segment padded>
        <Header dividing>RADGRAD COMMUNITY ACTIVITY</Header>
        {feeds ? (
          <Feed style={feedStyle}>
            {feeds.map((feed) => (
              <React.Fragment key={feed._id}>
                <StudentFeedItem feed={feed} />
                <Divider />
              </React.Fragment>
            ))}
          </Feed>
        ) : (
          <p>No recent feeds.</p>
        )}
      </Segment>
    </Container>
  );
};

export default CommunityFeedWidget;
