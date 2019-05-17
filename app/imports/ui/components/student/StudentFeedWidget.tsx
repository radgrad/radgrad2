import * as React from 'react';
import {Container, Feed, Header, Segment} from 'semantic-ui-react';
import {Feeds} from '../../../api/feed/FeedCollection';
import StudentFeedItem from './StudentFeedItem';

interface IStudentFeedWidget {
  type?: string;
}

class StudentFeedWidget extends React.Component<IStudentFeedWidget> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const feeds = Feeds.find({}, { sort: { timestamp: -1 } });
    return (
            <Container>
                <Segment padded={true}>
                    <Header dividing={true}>RADGRAD COMMUNITY ACTIVITY</Header>
                    {
                        feeds ?
                            <Feed>
                                {feeds.map((feed, index) => (
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

export default StudentFeedWidget;
