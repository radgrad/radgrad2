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
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface ILandingHomeProps {
  numCareerGoals: string;
  numInterests: string;
  numOpportunities: string;
  numUsers: string;
  currentUsername: string;
  iconName: string;
  role: string;
}

/** A simple static component to render some text for the landing page. */
const LandingHomePage: React.FC<ILandingHomeProps> = ({ currentUsername, numOpportunities, numInterests, numCareerGoals, numUsers, role, iconName }) => (
  <div id="landing-page">
    <LandingNavBar
      currentUser={currentUsername}
      iconName={iconName}
      role={role}
    />
    <LandingSection1 />
    <LandingSection2
      careerGoals={numCareerGoals}
      interests={numInterests}
      opportunities={numOpportunities}
      users={numUsers}
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
    const currentUsername = Meteor.user() ? Meteor.user().username : '';
    const iconName = (role === 'admin') ? 'user plus' : 'user';
    const numCareerGoals = PublicStats.getPublicStat(PublicStats.careerGoalsTotalKey);
    const numInterest = PublicStats.getPublicStat(PublicStats.interestsTotalKey);
    const numOpportunities = PublicStats.getPublicStat(PublicStats.opportunitiesTotalKey);
    const numUsers = PublicStats.getPublicStat(PublicStats.usersTotalKey);
    return {
      currentUsername,
      iconName,
      role,
      numCareerGoals,
      numInterest,
      numOpportunities,
      numUsers,
    };
  })(LandingHomePage);

export default withListSubscriptions(LandingHomeContainer, [
  PublicStats.getPublicationName(),
  Users.getPublicationName(),
  AdminProfiles.getPublicationName(),
  AdvisorProfiles.getPublicationName(),
  FacultyProfiles.getPublicationName(),
  StudentProfiles.getPublicationName(),
]);
