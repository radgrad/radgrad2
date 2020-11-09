import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import LandingNavBarContainer from '../../components/landing/LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';
import LandingSection3 from '../../components/landing/LandingSection3';
import LandingSection9Container from '../../components/landing/LandingSection9';
import LandingFooter from '../../components/landing/LandingFooter';
import { withListSubscriptions } from '../../layouts/shared/SubscriptionListHOC';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ILandingHomeProps {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
}

/** A simple static component to render some text for the landing page. */
const LandingHomePage = (props: ILandingHomeProps) => (
  <div id="landing-page">
    <LandingNavBarContainer />
    <LandingSection1 />
    <LandingSection2
      careerGoals={props.careerGoals}
      interests={props.interests}
      opportunities={props.opportunities}
      users={props.users}
    />
    <LandingSection3 />
    <LandingSection9Container />
    <LandingFooter />

    <BackToTopButton />
  </div>
);

const WithSubs = withListSubscriptions(LandingHomePage, [PublicStats.getPublicationName()]);

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingHomeContainer =
  withTracker(() => ({
    careerGoals: PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey),
    interests: PublicStats.getPublicStat(PublicStats.interestsTotalKey),
    opportunities: PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey),
    users: PublicStats.getPublicStat(PublicStats.usersTotalKey),
  }))(WithSubs);

export default LandingHomeContainer;
