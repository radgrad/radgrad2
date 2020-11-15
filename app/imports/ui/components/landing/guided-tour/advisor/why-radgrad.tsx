import React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../../pages/landing/guidedtour-style';

const GuidedTourAdvisorWhyRadGrad = () => (
  <div>
    <Grid container>
      <Grid.Row centered>
        <Grid.Column width="eight">
          <Image rounded size="large" src="/images/guidedtour/guidedtour-why-radgrad.png" />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column width="twelve" textAlign="center">
          <div style={styles.p}>
            <Header style={styles.h1}>Why Use RadGrad?</Header>
            <p>So, you&apos;re a computer science program advisor, and already overbooked and overwhelmed. Why should
              you spend the time to learn yet another online tool? In a nutshell, we believe RadGrad offers the
              following benefits to you:</p>
            <List as="ul">
              <List.Item style={styles.li}>
                You&apos;ll spend more time getting to know the student, and less time on degree logistics.
              </List.Item>
              <List.Item style={styles.li}>
                You can provide the student with detailed, current information about computer science disciplinary areas
                and career goals.
              </List.Item>
              <List.Item style={styles.li}>
                You can access detailed, useful demographics about the student population. For example, how many
                students are interested in Artificial Intelligence? How is that number changing over time? What
                400-level courses do students want to take next year, and how many students are interested in each?
              </List.Item>
              <List.Item style={styles.li}>
                By getting students involved with RadGrad, the advising process should become both more efficient and
                more effective. Students can use RadGrad to answer simple questions (&quot;What career involves web
                development?&quot;) and even some complicated ones (&quot;Which academic plan will enable me to graduate
                with the fewest possible additional courses?&quot;)
              </List.Item>
              <List.Item style={styles.li}>
                RadGrad provides &quot;ground truth&quot; for students about the degree programs. You will spend less
                time addressing rumors and/or incorrect information that has gotten onto the coconut wireless.
              </List.Item>
            </List>
            <p>
              Before continuing with this Guided Tour, please check out the Student Guided Tour first. This Advisor
              Guided Tour builds off the one for students.
            </p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default GuidedTourAdvisorWhyRadGrad;
