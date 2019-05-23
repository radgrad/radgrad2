import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Feed, Header, Segment } from 'semantic-ui-react';
import { Feeds } from '../../../api/feed/FeedCollection';
import StudentFeedItem from './StudentFeedItem';

interface IStudentFeedWidgetProps {
  feeds: object[];
}

class StudentFeedWidget extends React.Component<IStudentFeedWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Container>
        <Segment padded={true}>
          <Header dividing={true}>RADGRAD COMMUNITY ACTIVITY</Header>
          {
            this.props.feeds ?
              <Feed>
                {this.props.feeds.map((feed, index) => (
                  <StudentFeedItem key={index} feed={feed}/>
                ))}
              </Feed>
              :
              <p>No recent feeds.</p>
          }
        </Segment>
      </Container>
    );
  }
}

const StudentFeedWidgetContainer = withTracker(() => ({
  feeds: Feeds.find({}, { sort: { timestamp: -1 } }),
}))(StudentFeedWidget);

export default StudentFeedWidgetContainer;
