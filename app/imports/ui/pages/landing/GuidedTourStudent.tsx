import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Loader, Segment } from 'semantic-ui-react';
import Slider from 'react-slick';
import styles from './guidedtour-style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../../components/landing/Footer';
import WhyRadGrad from '../../components/guidedtour/student/why-radgrad';
import SetUp from '../../components/guidedtour/student/set-up';
import Interests from '../../components/guidedtour/student/interests';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

interface IGuidedTourStudentProps {
  interests: number;
  ready: boolean;
}

class GuidedTourStudent extends React.Component<IGuidedTourStudentProps> {
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {

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
              <Interests interests={this.props.interests}/>
              <div>2</div>
              <div>3</div>
            </Slider>
          </Segment>
        </Container>
      </div>
    );
  }
}

const GuidedTourStudentContainer = withTracker(() => {
  const subscription = Meteor.subscribe(PublicStats.getCollectionName());
  let key;
  let interests;
  if (subscription.ready()) {
    key = PublicStats.interestsTotalKey;
    interests = PublicStats.findDoc({ key }).value;
  }
  return {
    ready: subscription.ready(),
    interests,
  };
})(GuidedTourStudent);

export default GuidedTourStudentContainer;
