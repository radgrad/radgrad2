import React from 'react';
import Markdown from 'react-markdown';
import { Feed, Image } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { renderLink } from '../utilities/router';
import { IFeed } from '../../../../typings/radgrad';

interface IStudentFeedItemProps {
  feed: IFeed;
}

const dateDiffInDays = (a: string, b: string) => {
  const ams = Date.parse(a);
  const bms = Date.parse(b);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((ams - bms) / MS_PER_DAY);
};

const feedTimestamp = (feed): string => {
  let ret: string;
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

const CommunityFeedItem: React.FC<IStudentFeedItemProps> = ({ feed }) => {
  const match = useRouteMatch();
  return (
    <React.Fragment>
      <Feed.Event>
        <Feed.Label>
          <Image src={feed.picture} />
        </Feed.Label>
        <Feed.Content style={{ marginTop: '0px' }}>
          <Feed.Summary>
            <Markdown
              escapeHtml
              source={feed.description}
              renderers={{ link: (localProps) => renderLink(localProps, match) }}
            />
          </Feed.Summary>

          <Feed.Extra text>
            <Feed.Date style={{ marginTop: '0px' }}>
              {feedTimestamp(feed)}
            </Feed.Date>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    </React.Fragment>
  );
};

export default CommunityFeedItem;
