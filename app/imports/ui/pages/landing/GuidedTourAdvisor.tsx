import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../../components/landing/Footer';
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
          <Slider {...settings}>
            <WhyRadGrad/>
            <Welcome/>
            <DegreePlan/>
            <Opportunities/>
            <ReviewModeration/>
            <WhatsNext/>
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">Return to RadGrad</List.Item>
        <p/>
      </Container>
      <Footer/>
    </div>

  );
};

export default GuidedTourAdvisor;
