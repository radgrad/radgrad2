import React from 'react';
// import { NavLink } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DegreePlanWork from './slides/DegreePlanWork';
import DegreePlanPane from './slides/DegreePlanPane';
import FavoritesPane from './slides/FavoritesPane';
import Recommendations from './slides/Recommendations';
import styles from '../../../pages/landing/utilities/guidedtour-style';

const GuidedTourDegreePlanner: React.FC = () => {
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
        <Segment padded style={styles.background} className="guidedTour">
          <Slider {...settings}>
            <DegreePlanWork />
            <DegreePlanPane />
            <FavoritesPane />
            <Recommendations />
          </Slider>
        </Segment>
      </Container>
    </div>
  );
};

export default GuidedTourDegreePlanner;
