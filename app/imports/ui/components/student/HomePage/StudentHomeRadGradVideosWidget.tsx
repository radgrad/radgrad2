import React from 'react';
import { Header, Grid } from 'semantic-ui-react';
import { radgradVideos } from '../../../../api/radgrad/radgrad-videos';
import TeaserVideo from '../../shared/TeaserVideo';

const StudentHomeRadGradVideosWidget = () => {
  const numberOfVideos = 3;
  // Get random X (numberOfVideos) amount of radgrad videos
  // https://stackoverflow.com/a/38571132
  // TODO: Not an efficient randomized algorithm, should replace with a better one
  const shuffledRadGradVideos = [...radgradVideos].sort(() => 0.5 - Math.random());
  const slicedRadGradVideos = shuffledRadGradVideos.slice(0, numberOfVideos);
  return (
    <Grid>
      <Grid.Row><Header>RADGRAD VIDEOS</Header></Grid.Row>
      <Grid.Row columns={3}>
        {slicedRadGradVideos.map((video) => (
          <Grid.Column key={video.youtubeID}><TeaserVideo id={video.youtubeID} /> </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  );
};

export default StudentHomeRadGradVideosWidget;
