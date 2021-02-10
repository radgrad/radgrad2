import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from '../guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LandingFooter from '../../../app/imports/ui/components/landing/LandingFooter';
import WhyRadGrad from '../guided-tour/faculty/why-radgrad';
import SetUp from '../guided-tour/faculty/set-up';
import Opportunities from '../guided-tour/faculty/opportunities';
import Verification from '../guided-tour/faculty/verification';
import Explorer from '../guided-tour/faculty/explorer';
import WhatsNext from '../guided-tour/faculty/whats-next';

const LandingGuidedTourFacultyPage: React.FC = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };
  return (
    <div id="landing-guided-tour-faculty-page" style={styles.background}>
      <Container textAlign="center">
        <Segment padded style={styles.background}>
          <Slider {...settings}>
            <WhyRadGrad />
            <SetUp />
            <Opportunities />
            <Verification />
            <Explorer />
            <WhatsNext />
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">
          Return to RadGrad
        </List.Item>
      </Container>
      <LandingFooter />
    </div>
  );
};

export default LandingGuidedTourFacultyPage;
