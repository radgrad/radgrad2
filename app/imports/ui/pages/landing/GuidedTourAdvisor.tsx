import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../../components/landing/Footer';

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
    <div style={styles['.guided-tour-background']}>
      <Container textAlign="center">
        <Segment padded={true} style={styles['.guided-tour-background']}>
          <Slider {...settings}>
            <div>
              <Grid container={true}>
                <Grid.Row centered={true}>
                  <Grid.Column width={'eight'}>
                    <Image rounded={true} size="large" src="/images/guidedtour/guidedtour-why-radgrad.png"/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row centered={true}>
                  <Grid.Column width={'twelve'} textAlign={'center'}>
                    <div style={styles['.guided-tour-description > p']}>
                      <Header>Why Use RadGrad?</Header>
                      <p>So, you're a computer science program advisor, and already overbooked and overwhelmed. Why should you spend the time to learn yet another online tool? In a nutshell, we believe RadGrad offers the following benefits to you:</p>
                      <List>
                        <List.Item>You'll spend more time getting to know the student, and less time on degree logistics.</List.Item>
                        <List.Item>You can provide the student with detailed, current information about computer science disciplinary areas and career goals.</List.Item>
                        <List.Item>You can access detailed, useful demographics about the student population. For example, how many students are interested in Artificial Intelligence? How is that number changing over time?  What 400-level courses do students want to take next year, and how many students are interested in each?</List.Item>
                        <List.Item> By getting students involved with RadGrad, the advising process should become both more efficient and more effective. Students can use RadGrad to answer simple questions ("What career involves web development?") and even some complicated ones ("Which academic plan will enable me to graduate with the fewest possible additional courses?")</List.Item>
                        <List.Item>RadGrad provides "ground truth" for students about the degree programs.  You will spend less time addressing rumors and/or incorrect information that has gotten onto the coconut wireless.</List.Item>
                      </List>
                      <p>Before continuing with this Guided Tour, please check out the Student Guided Tour first. This Advisor Guided Tour builds off the one for students.</p>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            <div>
              <Grid container={true} columns={2}>
                <Grid.Column width={'nine'}>
                  <Image rounded={true} src="/images/guidedtour/guidedtour-studentconfig.png"/>
                </Grid.Column>
                <Grid.Column width={'seven'} textAlign={'left'}>
                  <div style={styles['.guided-tour-description > p']}>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
            <div>
              <Grid container={true} columns={2}>
                <Grid.Column width={'ten'}>
                  <Image as={NavLink} rounded={true} src="/images/guidedtour/guidedtour-degreeplan.png" to="/images/guidedtour/guidedtour-degreeplan.png"/>Click for full-size image
                </Grid.Column>
                <Grid.Column width={'six'} textAlign={'left'}>
                  <div style={styles['.guided-tour-description > p']}>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
            <div style={styles['.guided-tour-description > p']}>
              <Grid container={true} columns={2}>
                <Grid.Column width={'six'}>
                  <Image as={NavLink} rounded={true} src="/images/guidedtour/guidedtour-pendingverifications.png" to="/images/guidedtour/guidedtour-pendingverifications.png"/>Click for full-size image
                </Grid.Column>
                <Grid.Column width={'ten'} textAlign={'left'}>
                  <div style={styles['.guided-tour-description > p']}>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
            <div>
              <h3>5</h3>
            </div>
            <div>
              <h3>6</h3>
            </div>
          </Slider>
        </Segment>
        <List.Item as={NavLink} to="/">Return to RadGrad</List.Item>
        <p/>
      </Container>
      <Footer/>
    </div>

  );
};

export default GuidedTourAdvisor;
