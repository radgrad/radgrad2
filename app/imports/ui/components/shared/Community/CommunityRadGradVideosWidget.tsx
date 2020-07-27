import * as React from 'react';
import { Embed } from 'semantic-ui-react';
import { radgradVideoIds } from '../../../../api/radgrad/radgrad-video-ids';

const videoStyle = { float: left, width: 400, paddingRight: 20, paddingBottom: 30 };

// @ts-ignore
const CommunityRadGradVideosWidget = () => (
  <>
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
  </>
);

export default CommunityRadGradVideosWidget;
