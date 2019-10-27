import * as React from 'react';
import * as Markdown from 'react-markdown';
import { Feed, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { renderLink } from '../shared/RouterHelperFunctions';

interface IStudentFeedItemProps {
  feed: object;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

const dateDiffInDays = (a: string, b: string) => {
  const ams = Date.parse(a);
  const bms = Date.parse(b);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const ret = Math.floor((ams - bms) / MS_PER_DAY);
  return ret;
};


const feedTimestamp = (feed): string => {
  let ret = '';
  const feedTime = feed.timestamp;
  const currentDate = Date();
  const currentTime = currentDate.toString();
  const timeDiff = dateDiffInDays(currentTime, feedTime);
  if (timeDiff === 0) {
    ret = 'Today';
  } else if (timeDiff === 1) {
    ret = 'Yesterday';
  } else {
    ret = `${dateDiffInDays(currentTime, feedTime)} days ago`;
  }
  return ret;
};


const StudentFeedItem = (props: IStudentFeedItemProps) => {
  const { feed, match }: any = props;
  return (
    <React.Fragment>
      <Feed.Event>
        <Feed.Label>
          <Image src={feed.picture}/>
        </Feed.Label>
        <Feed.Content style={{ marginTop: '0px' }}>
          <Feed.Summary>
            <Markdown escapeHtml={true} source={feed.description}
                      renderers={{ link: (props) => renderLink(props, match) }}/>
          </Feed.Summary>

          <Feed.Extra text={true}>
            <Feed.Date style={{ marginTop: '0px' }}>
              {feedTimestamp(feed)}
            </Feed.Date>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    </React.Fragment>
  );
};

export default withRouter(StudentFeedItem);
