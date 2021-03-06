import React from 'react';
import { Embed } from 'semantic-ui-react';
import { radgradVideos } from '../../issue-399/radgrad-videos';

const videoStyle: React.CSSProperties = { float: 'left', width: 400, paddingRight: 20, paddingBottom: 30 };

const CommunityRadGradVideosWidget: React.FC = () => (
  <React.Fragment>
    {radgradVideos.map((video) => (
      <div style={videoStyle} key={video.youtubeID}>
        <Embed active autoplay={false} source="youtube" id={video.youtubeID} />
      </div>
    ))}
  </React.Fragment>
);

export default CommunityRadGradVideosWidget;
