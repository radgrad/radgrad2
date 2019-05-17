import * as React from 'react';
import { Feed, Image, Divider } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

interface IStudentFeedItem {
  feed: object;
}

class StudentFeedItem extends React.Component<IStudentFeedItem> {
  constructor(props) {
    super(props);
  }

  private getFeedPicture = (feed) => {
    if (feed.userIDs.length === 0) {
      return feed.picture;
    }
    const profile = Users.getProfile(feed.userIDs[0]);
    if (profile.picture !== '') {
      return profile.picture;
    }
    return defaultProfilePicture;
  }

  private multipleUsers = (feed) => {
    return feed.userIDs.length > 1;
  }

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

  // TODO: How to convert from markdown to HTML for feed.description. Feed messages that contain link aren't properly translated
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { feed } = this.props;
    const feedPicture = this.getFeedPicture(feed);
    const multipleUsers: boolean = this.multipleUsers(feed);
    const feedTimestamp: string = this.feedTimestamp(feed);

    return(
        <div>
            <Feed.Event>
                <Feed.Label>
                    <Image src={feedPicture}/>
                </Feed.Label>
                <Feed.Content style={{ marginTop: '0px' }}>
                    <Feed.Summary>
                        {feed.description}
                    </Feed.Summary>

                    <Feed.Extra text={true}>
                        {multipleUsers ?
                            <Feed.Meta style={{ float: 'right', marginTop: '0px' }}>
                                {/* TODO: Student_Feed_Modal */}
                            </Feed.Meta>
                            : ''
                        }
                        <Feed.Date style={{ marginTop: '0px' }}>
                            {feedTimestamp}
                        </Feed.Date>
                    </Feed.Extra>
                </Feed.Content>
            </Feed.Event>
            <Divider/>
        </div>
    );
  }
}

export default StudentFeedItem;
