import * as React from 'react';
import * as Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Divider, Feed, Image } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

interface IStudentFeedItemProps {
  feed: object;
}

class StudentFeedItem extends React.Component<IStudentFeedItemProps> {
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

  /*
  Because we are using react-router, the converted markdown hyperlinks won't be redirected properly. This is a solution.
  See https://github.com/rexxars/react-markdown/issues/29#issuecomment-231556543
  */
  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { feed }: any = this.props;
    const feedPicture = this.getFeedPicture(feed);
    const multipleUsers: boolean = this.multipleUsers(feed);
    const feedTimestamp: string = this.feedTimestamp(feed);
    return (
      <React.Fragment>
        <Feed.Event>
          <Feed.Label>
            <Image src={feedPicture}/>
          </Feed.Label>
          <Feed.Content style={{ marginTop: '0px' }}>
            <Feed.Summary>
              <Markdown escapeHtml={true} source={feed.description} renderers={{ link: this.routerLink }}/>
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
      </React.Fragment>
    );
  }
}

export default StudentFeedItem;
