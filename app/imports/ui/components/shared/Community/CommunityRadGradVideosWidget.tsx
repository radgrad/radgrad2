import * as React from 'react';
import { Embed } from 'semantic-ui-react';
import { radgradVideoIds } from '../../../../api/radgrad/radgrad-video-ids';

const videoStyle: React.CSSProperties = { float: 'left', width: 400, paddingRight: 20, paddingBottom: 30 };

const CommunityRadGradVideosWidget = () => (
  <React.Fragment>
    {radgradVideoIds.map((link) => (
      <div style={videoStyle}>
        <Embed
          active
          autoplay={false}
          source="youtube"
          id={link}
        />
      </div>
    ))}
  </React.Fragment>
);

export default CommunityRadGradVideosWidget;
