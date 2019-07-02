import * as React from 'react';
import * as Markdown from 'react-markdown';
import { Feed, Image } from 'semantic-ui-react';
import { renderLink } from '../shared/RouterHelperFunctions';

interface IStudentFeedItemProps {
  feed: object;
}

class StudentFeedItem extends React.Component<IStudentFeedItemProps> {
  constructor(props) {
    super(props);
  }

  private getFeedPicture = (feed) => feed.picture;

  private multipleUsers = (feed) => feed.userIDs.length > 1;

  private dateDiffInDays = (a: string, b: string) => {
    const ams = Date.parse(a);
    const bms = Date.parse(b);
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const ret = Math.floor((ams - bms) / MS_PER_DAY);
    return ret;
  }

  private feedTimestamp = (feed) => {
    let ret = '';
    const feedTime = feed.timestamp;
    const currentDate = Date();
    const currentTime = currentDate.toString();
    const timeDiff = this.dateDiffInDays(currentTime, feedTime);
    if (timeDiff === 0) {
      ret = 'Today';
    } else if (timeDiff === 1) {
      ret = 'Yesterday';
    } else {
      ret = `${this.dateDiffInDays(currentTime, feedTime)} days ago`;
    }
    return ret;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { feed }: any = this.props;
    const feedPicture = this.getFeedPicture(feed);
    const feedTimestamp: string = this.feedTimestamp(feed);
    return (
      <React.Fragment>
        <Feed.Event>
          <Feed.Label>
            <Image src={feedPicture}/>
          </Feed.Label>
          <Feed.Content style={{ marginTop: '0px' }}>
            <Feed.Summary>
              <Markdown escapeHtml={true} source={feed.description} renderers={{ link: renderLink }}/>
            </Feed.Summary>

            <Feed.Extra text={true}>
              <Feed.Date style={{ marginTop: '0px' }}>
                {feedTimestamp}
              </Feed.Date>
            </Feed.Extra>
          </Feed.Content>
        </Feed.Event>
      </React.Fragment>
    );
  }
}

export default StudentFeedItem;
