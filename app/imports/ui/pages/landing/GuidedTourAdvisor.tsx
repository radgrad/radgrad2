import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../components/landing/LandingFooter';
import WhyRadGrad from '../../components/guidedtour/advisor/why-radgrad';
import Welcome from '../../components/guidedtour/advisor/welcome';
import DegreePlan from '../../components/guidedtour/advisor/degree-plan';
import Opportunities from '../../components/guidedtour/advisor/opportunities';
import ReviewModeration from '../../components/guidedtour/advisor/review-moderation';
import WhatsNext from '../../components/guidedtour/advisor/whats-next';

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
    <div style={styles.background}>
      <Container textAlign="center">
        <Segment padded={true} style={styles.background}>
            <WhyRadGrad/>
            <Welcome/>
            <DegreePlan/>
            <Opportunities/>
            <ReviewModeration/>
            <WhatsNext/>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">Return to RadGrad</List.Item>
        <p/>
      </Container>
      <LandingFooter/>
    </div>

  );
};

export default GuidedTourAdvisor;
/*
took out <Slider> because was getting a no properties in common error
<Slider {...settings}>
  <WhyRadGrad/>
  <Welcome/>
  <DegreePlan/>
  <Opportunities/>
  <ReviewModeration/>
  <WhatsNext/>
</Slider>*/
