import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Divider, Feed, Header, Segment } from 'semantic-ui-react';
import { Feeds } from '../../../api/feed/FeedCollection';
import StudentFeedItem from './StudentFeedItem';
import { studentFeedWidget } from './student-widget-names';

interface IStudentFeedWidgetProps {
  feeds: object[];
}

const StudentFeedWidget = (props: IStudentFeedWidgetProps) => {
  const feedStyle = {
    maxHeight: '488px',
    overflow: 'scroll',
    marginTop: '10px',
  };

  return (
    <Container id={`${studentFeedWidget}`}>
      <Segment padded={true}>
        <Header dividing={true}>RADGRAD COMMUNITY ACTIVITY</Header>
        {
          props.feeds ?
            <Feed style={feedStyle}>
              {props.feeds.map((feed, index) => (
                <React.Fragment key={index}>
                  <StudentFeedItem feed={feed}/>
                  <Divider/>
                </React.Fragment>
              ))}
            </Feed>
            :
            <p>No recent feeds.</p>
        }
      </Segment>
    </Container>
  );
};

const StudentFeedWidgetContainer = withTracker(() => ({
  feeds: Feeds.findNonRetired({}, { sort: { timestamp: -1 } }),
}))(StudentFeedWidget);

export default StudentFeedWidgetContainer;
