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
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
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

/** A simple static component to render some text for the landing page. */
const LandingHomePage: React.FC<LandingHomeProps> = ({ currentUser, opportunities, interests, careerGoals, users, role, iconName }) => (
  <div id="landing-page">
    <LandingNavBar
      currentUser={currentUser}
      iconName={iconName}
      role={role}
    />
    <LandingSection1 />
    <LandingSection2
      careerGoals={careerGoals}
      interests={interests}
      opportunities={opportunities}
      users={users}
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
    return {
      currentUser: Meteor.user() ? Meteor.user().username : '',
      iconName: (role === 'admin') ? 'user plus' : 'user',
      role,
      careerGoals: PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey),
      interests: PublicStats.getPublicStat(PublicStats.interestsTotalKey),
      opportunities: PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey),
      users: PublicStats.getPublicStat(PublicStats.usersTotalKey),
    };
  })(WithSubs);

export default LandingHomeContainer;
