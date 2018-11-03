import * as React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';

const GuidedTourAdvisor = () => {

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <div>
      <Grid verticalAlign="middle" textAlign="center" container={true}>

        <Grid.Column width={4}>
          <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
        </Grid.Column>

        <Grid.Column width={8}>
          <h1>Guided Tour Advisor</h1>
        </Grid.Column>

      </Grid>
      <Slider {...settings}>
        <div>
          <div>
            <Grid container={true}>
              <Grid.Row centered={true}>
                <Grid.Column width={'eight'}>
                  <Image rounded={true} size="large" src="/images/guidedtour/guidedtour-why-radgrad.png"/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered={true}>
                <Grid.Column width={'twelve'} textAlign={'center'}>
                  <div>
                    <Header style={styles['.guided-tour-description > h1']}>Why use RadGrad?</Header>

                    <p>So, you're a computer science program advisor, and already overbooked and overwhelmed. Why should
                      you spend the time to learn yet another online tool? In a nutshell, we believe RadGrad offers the
                      following benefits to you:</p>
                    <List as="ul">
                      <List.Item as="li" style={styles.li}> You'll spend more time getting to know
                        the student, and less time on degree logistics.</List.Item>

                      <List.Item as="li" style={styles.li}> You can provide the student with detailed, current
                        information
                        about computer science
                        disciplinary areas and career goals.</List.Item>

                      <List.Item as="li" style={styles.li}> You can access detailed, useful demographics about the
                        student
                        population. For example, how many
                        students are interested in Artificial Intelligence? How is that number changing over time? What
                        400-level courses do students want to take next year, and how many students are interested in
                        each?</List.Item>

                      <List.Item as="li" style={styles.li}> By getting students involved with RadGrad, the advising
                        process should become both more
                        efficient and more effective. Students can use RadGrad to answer simple questions ("What career
                        involves web development?") and even some complicated ones ("Which academic plan will enable me
                        to
                        graduate with the fewest possible additional courses?")</List.Item>

                      <List.Item as="li" style={styles.li}> RadGrad provides "ground truth" for students about the
                        degree
                        programs. You will spend less time
                        addressing rumors and/or incorrect information that has gotten onto the coconut
                        wireless.</List.Item>
                    </List>
                    <p>Before continuing with this Guided Tour, please check out the Student Guided Tour first. This
                      Advisor Guided Tour builds off the one for students.</p>

                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>

        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider>
    </div>

  );
};

export default GuidedTourAdvisor;
