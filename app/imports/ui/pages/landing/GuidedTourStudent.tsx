import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../../components/landing/Footer';
import WhyRadGrad from '../../components/guidedtour/student/why-radgrad';
import SetUp from '../../components/guidedtour/student/set-up';
import Interests from '../../components/guidedtour/student/interests';

const GuidedTourStudent = () => {

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
            <Interests interests={65}/>
            <div>2</div>
            <div>3</div>
          </Slider>
        </Segment>
      </Container>
    </div>
  );
};

export default GuidedTourStudent;
