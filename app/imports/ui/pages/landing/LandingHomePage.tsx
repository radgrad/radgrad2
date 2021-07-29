import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Factoids } from '../../../api/factoid/FactoidCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { ROLE } from '../../../api/role/Role';
import {
  InterestOrCareerGoalFactoidProps,
  LevelFactoidProps,
  OpportunityFactoidProps,
  ReviewFactoidProps,
} from '../../../typings/radgrad';
import LandingNavBar from '../../components/landing/LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';
import LandingSection3 from '../../components/landing/LandingSection3';
import LandingSection9Container from '../../components/landing/LandingSection9';
import PageFooter from '../../components/shared/PageFooter';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { PAGEIDS } from '../../utilities/PageIDs';

interface LandingHomeProps {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
  currentUser: string;
  iconName: string;
  role: string;
  tagline: string;
  instanceName: string;
  landingSubject: string;
  userGuideURL: string;
  location: {
    state?: {
      from?: {
        pathname: string;
      };
    }
  };
  careerGoalFactoid: InterestOrCareerGoalFactoidProps,
  interestFactoid: InterestOrCareerGoalFactoidProps,
  levelFactoid: LevelFactoidProps,
  opportunityFactoid: OpportunityFactoidProps,
  reviewFactoid: ReviewFactoidProps,
}

/* A simple static component to render some text for the landing page. */
const LandingHomePage: React.FC<LandingHomeProps> = ({ currentUser, opportunities, interests, careerGoals, users, role, iconName, location, tagline, instanceName, landingSubject, userGuideURL, careerGoalFactoid, interestFactoid, levelFactoid, opportunityFactoid, reviewFactoid }) => {
  // CAM: This is set in the Redirect from StudentProtectedRoutes on a reload. We want to go back to the page we came from.
  if (location?.state?.from) {
    return (<Redirect to={{ pathname: `${location.state.from.pathname}` }} />);
  }
  return (<div id={PAGEIDS.LANDING_HOME}>
    <LandingNavBar currentUser={currentUser} iconName={iconName} role={role} instanceName={instanceName} />
    <LandingSection1 tagline={tagline} instanceName={instanceName} careerGoalFactoid={careerGoalFactoid} interestFactoid={interestFactoid} levelFactoid={levelFactoid} opportunityFactoid={opportunityFactoid} reviewFactoid={reviewFactoid} />
    <LandingSection2 careerGoals={careerGoals} interests={interests} opportunities={opportunities} users={users} />
    <LandingSection3 landingSubject={landingSubject} instanceName={instanceName} />
    <LandingSection9Container instanceName={instanceName} userGuideURL={userGuideURL} />
    <PageFooter />

    <BackToTopButton />
  </div>);
};

/* withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingHomeContainer = withTracker(() => {
  let role = 'student';
  if (Meteor.userId()) {
    if (Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN])) {
      role = 'admin';
    } else if (Roles.userIsInRole(Meteor.userId(), [ROLE.ADVISOR])) {
      role = 'advisor';
    } else if (Roles.userIsInRole(Meteor.userId(), [ROLE.FACULTY])) {
      role = 'faculty';
    } else if (Roles.userIsInRole(Meteor.userId(), [ROLE.ALUMNI])) {
      role = 'alumni';
    }
  }
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const iconName = role === 'admin' ? 'user plus' : 'user';
  const careerGoals = PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey);
  const interests = PublicStats.getPublicStat(PublicStats.interestsTotalKey);
  const opportunities = PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey);
  const users = PublicStats.getPublicStat(PublicStats.usersTotalKey);
  const tagline = Meteor.settings.public.tagline;
  const instanceName = Meteor.settings.public.instanceName;
  const landingSubject = Meteor.settings.public.landingSubject;
  const userGuideURL = Meteor.settings.public.userGuideURL;
  const careerGoalFactoid = Factoids.getCareerGoalFactoid();
  const interestFactoid = Factoids.getInterestFactoid();
  const levelFactoid = Factoids.getLevelFactoid();
  const opportunityFactoid = Factoids.getOpportunityFactoid();
  const reviewFactoid = Factoids.getReviewFactoid();
  return {
    currentUser,
    iconName,
    role,
    careerGoals,
    interests,
    opportunities,
    users,
    tagline,
    instanceName,
    landingSubject,
    userGuideURL,
    careerGoalFactoid,
    interestFactoid,
    levelFactoid,
    opportunityFactoid,
    reviewFactoid,
  };
})(LandingHomePage);

export default withListSubscriptions(LandingHomeContainer, [
  PublicStats.getPublicationName(),
  Factoids.getPublicationName(),
]);
