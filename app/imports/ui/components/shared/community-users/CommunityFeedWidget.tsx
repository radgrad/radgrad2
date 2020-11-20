import React from 'react';
import { Container, Divider, Feed, Header, Segment } from 'semantic-ui-react';
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

export default CommunityFeedWidget;
