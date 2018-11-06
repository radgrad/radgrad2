import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../../components/landing/Footer';
import WhyRadGrad from '../../components/guidedtour/faculty/why-radgrad';
import SetUp from '../../components/guidedtour/faculty/set-up';
import Opportunities from '../../components/guidedtour/faculty/opportunities';
import Verification from '../../components/guidedtour/faculty/verification';
import Explorer from '../../components/guidedtour/faculty/explorer';
import WhatsNext from '../../components/guidedtour/faculty/whats-next';

const GuidedTourFaculty = () => {

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
            <SetUp/>
            <Opportunities/>
            <Verification/>
            <Explorer/>
            <WhatsNext/>
          </Slider>
        </Segment>
        <List.Item style={styles.a} as={NavLink} to="/">Return to RadGrad</List.Item>
      </Container>
      <Footer/>
    </div>
  );
};

export default GuidedTourFaculty;
