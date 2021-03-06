import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from '../guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../../app/imports/ui/components/landing/LandingFooter';
import WhyRadGrad from '../guided-tour/advisor/why-radgrad';
import Welcome from '../guided-tour/advisor/welcome';
import DegreePlan from '../guided-tour/advisor/degree-plan';
import Opportunities from '../guided-tour/advisor/opportunities';
import ReviewModeration from '../guided-tour/advisor/review-moderation';
import WhatsNext from '../guided-tour/advisor/whats-next';

const LandingGuidedTourAdvisorPage: React.FC = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <div id="landing-guided-tour-advisor-page" style={styles.background}>
      <Container textAlign="center">
        <Segment padded style={styles.background}>
          <Slider {...settings}>
            <WhyRadGrad />
            <Welcome />
            <DegreePlan />
            <Opportunities />
            <ReviewModeration />
            <WhatsNext />
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">
          Return to RadGrad
        </List.Item>
        <p />
      </Container>
      <LandingFooter />
    </div>
  );
};

export default LandingGuidedTourAdvisorPage;
