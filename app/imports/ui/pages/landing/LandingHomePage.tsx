import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { ROLE } from '../../../api/role/Role';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import LandingNavBar from '../../components/landing/LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';
import LandingSection3 from '../../components/landing/LandingSection3';
import LandingSection9Container from '../../components/landing/LandingSection9';
import LandingFooter from '../../components/landing/LandingFooter';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface LandingHomeProps {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
  currentUser: string;
  iconName: string;
  role: string;
}

/* A simple static component to render some text for the landing page. */
const LandingHomePage: React.FC<LandingHomeProps> = ({ currentUser, opportunities, interests, careerGoals, users, role, iconName }) => (
  <div id="landing-page">
    <LandingNavBar currentUser={currentUser} iconName={iconName} role={role} />
    <LandingSection1 />
    <LandingSection2 careerGoals={careerGoals} interests={interests} opportunities={opportunities} users={users} />
    <LandingSection3 />
    <LandingSection9Container />
    <LandingFooter />

    <BackToTopButton />
  </div>
);

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
    }
  }
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const iconName = role === 'admin' ? 'user plus' : 'user';
  const careerGoals = PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey);
  const interests = PublicStats.getPublicStat(PublicStats.interestsTotalKey);
  const opportunities = PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey);
  const users = PublicStats.getPublicStat(PublicStats.usersTotalKey);
  return {
    currentUser,
    iconName,
    role,
    careerGoals,
    interests,
    opportunities,
    users,
  };
})(LandingHomePage);

export default withListSubscriptions(LandingHomeContainer, [PublicStats.getPublicationName(), Users.getPublicationName(), AdvisorProfiles.getPublicationName(), FacultyProfiles.getPublicationName(), StudentProfiles.getPublicationName()]);
