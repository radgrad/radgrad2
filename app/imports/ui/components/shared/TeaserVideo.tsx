import React from 'react';
import { Embed } from 'semantic-ui-react';

interface TeaserVideoProps {
  id: string;
}

const TeaserVideo: React.FC<TeaserVideoProps> = ({ id }) => (
  <div style={{ paddingBottom: '20px' }}>
    <Embed
      active
      autoplay={false}
      source="youtube"
      id={id}
    />
  </div>
);

export default TeaserVideo;
