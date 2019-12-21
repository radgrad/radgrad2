import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import LandingNavBarContainer from '../../components/landing/LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';
import LandingSection3 from '../../components/landing/LandingSection3';
import LandingSection4 from '../../components/landing/LandingSection4';
import LandingSection5 from '../../components/landing/LandingSection5';
import LandingSection6 from '../../components/landing/LandingSection6';
import LandingSection7 from '../../components/landing/LandingSection7';
import LandingSection8 from '../../components/landing/LandingSection8';
import LandingSection9Container from '../../components/landing/LandingSection9';
import LandingFooter from '../../components/landing/LandingFooter';
import { withListSubscriptions } from '../../layouts/shared/SubscriptionListHOC';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ILandingHomeProps {
  careerGoalNames: string;
  careerGoals: string;
  courseReviews?: string;
  degrees?: string;
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
    <LandingSection3
      careerGoals={props.careerGoals}
      degrees={props.degrees}
      interests={props.interests}
    />
    <LandingSection4 opportunities={props.opportunities} />
    <LandingSection5 />
    <LandingSection6
      levelOne={props.levelOne}
      levelTwo={props.levelTwo}
      levelThree={props.levelThree}
      levelFour={props.levelFour}
      levelFive={props.levelFive}
      levelSix={props.levelSix}
    />
    <LandingSection7 careerGoalNames={props.careerGoalNames} />
    <LandingSection8
      courseReviews={props.courseReviews}
      locations={props.locations}
      mentors={props.mentors}
    />
    <LandingSection9Container />
    <LandingFooter />

    <BackToTopButton />
  </div>
);

const WithSubs = withListSubscriptions(LandingHome, [PublicStats.getPublicationName(), RadGradSettings.getPublicationName()]);

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingHomeContainer = // console.log(`LandingHomeContainer withTracker()`);
  withTracker(() => ({
    careerGoalNames: PublicStats.getPublicStat(PublicStats.careerGoalsListKey),
    careerGoals: PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey),
    courseReviews: PublicStats.getPublicStat(PublicStats.courseReviewsTotalKey),
    degrees: PublicStats.getPublicStat(PublicStats.desiredDegreesTotalKey),
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
