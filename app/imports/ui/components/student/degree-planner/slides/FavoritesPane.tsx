import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

const FavoritesPane: React.FC = () => (
  <div>
    <Grid container stackable>
      <Grid.Row centered>
        <Grid.Column width={5}>
          <Image rounded size="large" src="/images/help/favorite-opportunities.png" />
        </Grid.Column>
        <Grid.Column width={11}>
          <Header style={styles.h1}>Favorites & Details Pane</Header>
          <p style={styles.p}>The Favorites/Details pane provides four tabs showing your favorite opportunities, favorite academic plan, favorite courses and the details about an opportunity or course in your plan.
            <br />
            You can add a course or opportunity to your degree plan by &#34;dragging&#34; the associated button naming the course or opportunity to any current or future semester.
            <br />
            Click on any course or opportunity in your degree plan to bring up details about them in the Details tab.</p>
          <p style={styles.p}>For opportunities, you can also request verification through the Details tab. Document how you participated in the text-box then click the <strong style={styles.strong}>&#34;Request Verification&#34;</strong> button. This will send a message to an advisor who will check your verification evidence. When verified, the associated ICE points will be awarded to you.</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default FavoritesPane;
