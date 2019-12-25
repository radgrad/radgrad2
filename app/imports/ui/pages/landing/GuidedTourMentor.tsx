import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../components/landing/LandingFooter';
import WhyRadGrad from '../../components/guidedtour/mentor/why-radgrad';
import WhatsNext from '../../components/guidedtour/mentor/whats-next';
import SetUp from '../../components/guidedtour/mentor/set-up';
import MentorSpace from '../../components/guidedtour/mentor/mentorspace';
import Explorer from '../../components/guidedtour/mentor/explorer';

const GuidedTourMentor = () => {

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <div style={styles.background}>
      <Container textAlign="center">
        <Segment padded style={styles.background}>
          <Slider {...settings}>
            <WhyRadGrad />
            <SetUp />
            <MentorSpace />
            <Explorer />
            <WhatsNext />
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">Return to RadGrad</List.Item>
      </Container>
      <LandingFooter />
    </div>
  );
};

export default GuidedTourMentor;
