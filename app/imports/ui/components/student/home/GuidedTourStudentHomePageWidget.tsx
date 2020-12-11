import React from 'react';
import { Container } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from '../../../pages/landing/utilities/guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WhyRadGrad from './home-why-radgrad';
import Interests from './home-interests';
import CareerPath from './home-career-goals';
import Courses from './home-courses';

interface IGuidedTourStudentProps {
  interests: number;
  careerGoals: string;
  courses: number;
  opportunities: number;
}

const GuidedTourStudentHomePageWidget: React.FC<IGuidedTourStudentProps> = (props) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  return (
    <div style={styles.background} className="guidedTour">
      <Container>
        <Slider {...settings}>
          <WhyRadGrad />
          <Interests interests={props.interests} />
          <CareerPath careerGoals={props.careerGoals} />
          <Courses courses={props.courses} />
        </Slider>
      </Container>
    </div>
  );
};

export default GuidedTourStudentHomePageWidget;
