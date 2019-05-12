import * as React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

interface IOpportunitiesProps {
  opportunties: number;
}

const Opportunities = (props: IOpportunitiesProps) => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'ten'}>
        <a href="/images/guidedtour/guidedtour-opp.png" target="_blank"><Image rounded={true}
                                                                               src="/images/guidedtour/guidedtour-opp.png"/>
          <p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'six'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Are you experienced?</Header>
          <p style={styles.p}>A well-balanced student learns from experiences inside and outside of school. RadGrad
            helps you reach beyond the classroom through <strong
              style={styles.strong}>{props.opportunties}</strong> opportunities. These include:</p>
          <List>
            <List.Item style={styles.li}>Projects: A research or development project, under faculty supervision. For
              example, you can work with Kim Binsted on the <a href="http://hi-seas.org" rel="noopener noreferrer"
                                                               target="_blank">HI-SEAS</a> project.</List.Item>
            <List.Item style={styles.li}>Clubs: Many clubs and community organizations provide valuable professional
              experiences, from <a href="http://www.ics.hawaii.edu/community/community-profile-the-ics-grey-hats/"
                                   rel="noopener noreferrer" target="_blank">GreyHats</a> to <a
                href="http://www.codeforhawaii.org/" rel="noopener noreferrer" target="_blank">Code For
                Hawaii</a>.</List.Item>
            <List.Item style={styles.li}>Internships: RadGrad helps you find internship opportunities, such as with <a
              href="http://www.boozallen.com/careers/find-your-job/graduating-students/strategic-innovation-games"
              rel="noopener noreferrer" target="_blank">Booz Allen</a>.</List.Item>
            <List.Item style={styles.li}>Online Learning: For certain technologies, a great place to learn is online.
              For example, game developers might want to take the <a href="https://www.udemy.com/unitycourse/"
                                                                     rel="noopener noreferrer" target="_blank">Unity
                course</a>.</List.Item>
            <List.Item style={styles.li}>Events: Finally, consider a one or multiple day event, such as <a
              href="http://htdc.org/wetwarewed/" rel="noopener noreferrer" target="_blank">WetWareWednesday</a> or
              the <a href="http://hacc.hawaii.gov/" rel="noopener noreferrer" target="_blank">Hawaii Annual Code
                Challenge</a>.</List.Item>
          </List>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default Opportunities;
