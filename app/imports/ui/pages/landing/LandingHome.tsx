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
  academicPlans: string;
  careerGoalNames: string;
  careerGoals: string;
  courseReviews?: string;
  interests: string;
  levelOne?: string;
  levelTwo?: string;
  levelThree?: string;
  levelFour?: string;
  levelFive?: string;
  levelSix?: string;
  locations?: string;
  mentors?: string;
  opportunities: string;
  users: string;
}

/** A simple static component to render some text for the landing page. */
const LandingHome = (props: ILandingHomeProps) => (
  <div>
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

const WithSubs = withListSubscriptions(LandingHome, [PublicStats.getPublicationName()]);

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingHomeContainer = // console.log(`LandingHomeContainer withTracker()`);
  withTracker(() => ({
    academicPlans: PublicStats.getPublicStat(PublicStats.academicPlansTotalKey),
    careerGoalNames: PublicStats.getPublicStat(PublicStats.careerGoalsListKey),
    careerGoals: PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey),
    courseReviews: PublicStats.getPublicStat(PublicStats.courseReviewsTotalKey),
    interests: PublicStats.getPublicStat(PublicStats.interestsTotalKey),
    levelOne: PublicStats.getPublicStat(PublicStats.levelOneTotalKey),
    levelTwo: PublicStats.getPublicStat(PublicStats.levelTwoTotalKey),
    levelThree: PublicStats.getPublicStat(PublicStats.levelThreeTotalKey),
    levelFour: PublicStats.getPublicStat(PublicStats.levelFourTotalKey),
    levelFive: PublicStats.getPublicStat(PublicStats.levelFiveTotalKey),
    levelSix: PublicStats.getPublicStat(PublicStats.levelSixTotalKey),
    locations: PublicStats.getPublicStat(PublicStats.usersMentorsLocationsKey),
    mentors: PublicStats.getPublicStat(PublicStats.usersMentorsTotalKey),
    opportunities: PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey),
    users: PublicStats.getPublicStat(PublicStats.usersTotalKey),
  }))(WithSubs);

export default LandingHomeContainer;
