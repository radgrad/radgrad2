import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { ROLE } from '../../../api/role/Role';
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
  careerGoalsCount: string;
  interestsCount: string;
  opportunitiesCount: string;
  usersCount: string;
  currentUser: string;
  roleName: string;
  role: string;
}

/** A simple static component to render some text for the landing page. */
const LandingHomePage: React.FC<LandingHomeProps> = ({ currentUser, opportunitiesCount, interestsCount, careerGoalsCount, usersCount, role, roleName }) => (
  <div id="landing-page">
    <LandingNavBar
      currentUser={currentUser}
      roleName={roleName}
      role={role}
    />
    <LandingSection1 />
    <LandingSection2
      careerGoals={careerGoalsCount}
      interests={interestsCount}
      opportunities={opportunitiesCount}
      users={usersCount}
    />
    <LandingSection3 />
    <LandingSection9Container />
    <LandingFooter />

    <BackToTopButton />
  </div>
);

/* withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingHomeContainer =
  withTracker(() => {
    let role;
    if (Meteor.userId()) {
      const profile = Users.getProfile(Meteor.userId());
      if (profile.role === ROLE.ADMIN) {
        role = 'admin';
      }
      if (profile.role === ROLE.ADVISOR) {
        role = 'advisor';
      }
      if (profile.role === ROLE.ALUMNI) {
        role = 'alumni';
      }
      if (profile.role === ROLE.FACULTY) {
        role = 'faculty';
      }
      if (profile.role === ROLE.STUDENT) {
        role = 'student';
      }
    }
    const roleName = (role === 'admin') ? 'user plus' : 'user';
    const currentUser = Meteor.user() ? Meteor.user().username : '';
    const careerGoalsCount = PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey);
    const interestsCount = PublicStats.getPublicStat(PublicStats.interestsTotalKey);
    const opportunitiesCount = PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey);
    const usersCount = PublicStats.getPublicStat(PublicStats.usersTotalKey);
    return {
      currentUser,
      roleName,
      role,
      careerGoalsCount,
      interestsCount,
      opportunitiesCount,
      usersCount,
    };
  })(LandingHomePage);

export default withListSubscriptions(LandingHomeContainer, [PublicStats.getPublicationName()]);
