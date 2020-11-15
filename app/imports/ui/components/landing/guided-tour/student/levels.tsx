import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/guidedtour-style';

const GuidedTourStudentLevels = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-level.png" target="_blank">
          <Image
            rounded
            src="/images/guidedtour/guidedtour-level.png"
          />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <div>
          <Header style={styles.h1}>Level up!</Header>
          <p style={styles.p}>
            ICE provides a final goal in RadGrad, but Levels help you figure out how you&apos;re doing along the way.
          </p>
          <p style={styles.p}>
            There are six Levels in RadGrad: Grey, Yellow, Green, Blue, Brown, and Black. Each time you achieve a new
            level in RadGrad, you can pick up a free, limited edition RadGrad laptop sticker representing that level
            from your advisor.
          </p>
          <p style={styles.p}>
            The first few levels are relatively straightforward to achieve as you progress through the computer science
            degree program. Achieving the last couple of levels requires you to be &quot;well rounded&quot; as well
            as &quot;well prepared&quot;.
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentLevels;
