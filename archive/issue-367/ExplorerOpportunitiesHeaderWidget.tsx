import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ExplorerOpportunitiesHeaderWidget: React.FC = () => {
  const signImageStyle: React.CSSProperties = { marginBottom: 0 };

  return (
    <div style={styles.background} className="guidedTour">
      <Grid container>
        <Grid.Column width={1} />
        <Grid.Column width={5}>
          <Image style={signImageStyle} rounded src="/images/guidedtour/opportunity_sign.png" />
        </Grid.Column>
        <Grid.Column width={8} textAlign="left">
          <Image src="/images/guidedtour/opportunity_circles.png" />
          <Header style={styles.h1}>Gain Innovation and Experience by taking advantage of Opportunities</Header>
          <p style={styles.p}>This page presents a curated list of Opportunities that the faculty believe will complement existing courses and increase your attractiveness to future employers and graduate programs.</p>
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid>
    </div>
  );
};

export default ExplorerOpportunitiesHeaderWidget;
