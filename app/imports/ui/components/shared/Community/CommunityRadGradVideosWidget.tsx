import * as React from 'react';
import { Embed } from 'semantic-ui-react';
import { radgradVideoIds } from '../../../../api/radgrad/radgrad-video-ids';

const CommunityRadGradVideosWidget = () => (
  <>
    {radgradVideoIds.map((link) => (
      <Embed
        active
        autoplay={false}
        source="youtube"
        id={link}
      />
    ))}
  </>
);

export default CommunityRadGradVideosWidget;
