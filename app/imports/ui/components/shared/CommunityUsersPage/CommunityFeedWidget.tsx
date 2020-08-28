import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Divider, Feed, Header, Segment } from 'semantic-ui-react';
import { Feeds } from '../../../../api/feed/FeedCollection';
import StudentFeedItem from './CommunityFeedItem';
import { studentFeedWidget } from '../../student/student-widget-names';
import { IFeed } from '../../../../typings/radgrad';

interface IStudentFeedWidgetProps {
  feeds: IFeed[];
}

const CommunityFeedWidget = (props: IStudentFeedWidgetProps) => {
  const feedStyle = {
    maxHeight: '325px',
    overflowY: 'scroll',
    marginTop: '10px',
  };

  return (
    <Container id={`${studentFeedWidget}`}>
      <Segment padded>
        <Header dividing>RADGRAD COMMUNITY ACTIVITY</Header>
        {props.feeds ?
          (
            <Feed style={feedStyle}>
              {props.feeds.map((feed) => (
                <React.Fragment key={feed._id}>
                  <StudentFeedItem feed={feed} />
                  <Divider />
                </React.Fragment>
              ))}
            </Feed>
          )
          : <p>No recent feeds.</p>}
      </Segment>
    </Container>
  );
};

const CommunityFeedWidgetContainer = withTracker(() => ({
  feeds: Feeds.findNonRetired({}, { sort: { timestamp: -1 } }),
}))(CommunityFeedWidget);

export default CommunityFeedWidgetContainer;
