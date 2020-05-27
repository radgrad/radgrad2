import React from 'react';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import styles from './landing-styles';

interface ILandingSection6Props {
  levelOne: string;
  levelTwo: string;
  levelThree: string;
  levelFour: string;
  levelFive: string;
  levelSix: string;
}

const marginStyle = { margin: 21 };

const LandingSection6 = (props: ILandingSection6Props) => (
  <div className="grey-section" id="landing-section-6" style={styles['header-section']}>
    <Container>
      <Grid columns={2} centered padded stackable>

        <Grid.Column textAlign="center">
          <Grid columns={3}>
            <Grid.Column>
              <Image size="small" src="/images/level-icons/radgrad-level-1-icon.png" />
            </Grid.Column>
            <Grid.Column className="column">
              <Image size="small" src="/images/level-icons/radgrad-level-2-icon.png" />
            </Grid.Column>
            <Grid.Column className="column">
              <Image size="small" src="/images/level-icons/radgrad-level-3-icon.png" />
            </Grid.Column>
          </Grid>

          <Header as="h1" style={styles['header-text']}>Level up</Header>
          <div style={styles['header-description']}>
            <p>
              The RadGrad path to an improved degree experience is long and challenging. To recognize stages in your
              progress, RadGrad defines six levels of achievement: white, yellow, green, blue, brown and black.
            </p>
            <p>
              Right now, there are <strong style={styles['green-text']}>{props.levelOne}</strong> student(s) at Level
              One, <strong style={styles['green-text']}>{props.levelTwo}</strong> at Level Two,
              <strong style={styles['green-text']}> {props.levelThree}</strong> at Level Three,
              <strong style={styles['green-text']}> {props.levelFour}</strong> at Level Four,
              <strong style={styles['green-text']}> {props.levelFive}</strong> at Level Five, and
              <strong style={styles['green-text']}> {props.levelSix}</strong> at Level Six.
            </p>
            <p>
              Once you achieve a level, the corresponding badge appears in your profile and is visible to other
              community members. In addition, your advisor will give you a laptop sticker representing your level.
              Congratulations, grasshopper!
            </p>
          </div>

          <Grid columns={3} style={marginStyle}>
            <Grid.Column>
              <Image size="small" src="/images/level-icons/radgrad-level-4-icon.png" />
            </Grid.Column>
            <Grid.Column>
              <Image size="small" src="/images/level-icons/radgrad-level-5-icon.png" />
            </Grid.Column>
            <Grid.Column>
              <Image size="small" src="/images/level-icons/radgrad-level-6-icon.png" />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection6;
