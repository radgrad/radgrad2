import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import CommunityRadGradVideosWidget from '../../components/shared/community-radgrad-videos/CommunityRadGradVideosWidget';
import * as Router from '../../components/shared/utilities/router';
import { URL_ROLES } from '../../layouts/utilities/route-constants';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { Reviews } from '../../../api/review/ReviewCollection';

const CommunityRadGradVideosPage: React.FC = () => {
  const match = useRouteMatch();
  const getMenuWidget = (): JSX.Element => {
    const role = Router.getRoleByUrl(match);
    switch (role) {
      case URL_ROLES.STUDENT:
        return <StudentPageMenuWidget />;
      case URL_ROLES.FACULTY:
        return <FacultyPageMenuWidget />;
      case URL_ROLES.ADVISOR:
        return <AdvisorPageMenuWidget />;
      default:
        return <React.Fragment />;
    }
  };

  const menuWidget = getMenuWidget();
  return (
    <div id="community-radgrad-videos-page">
      {menuWidget}

      <Container>
        <Header as="h1">RadGrad Videos</Header>
        <CommunityRadGradVideosWidget />
      </Container>
      <BackToTopButton />
    </div>
  );
};

export default withListSubscriptions(CommunityRadGradVideosPage, [
  AdvisorProfiles.getPublicationName(), // for Advisor Menu
  FacultyProfiles.getPublicationName(), // for Faculty Menu
  Opportunities.getPublicationName(), // for Faculty Menu
  OpportunityInstances.getPublicationName(), // for Faculty Menu
  Reviews.getPublicationName(), // for Advisor Menu
  StudentProfiles.getPublicationName(), // for Student Menu
  VerificationRequests.getPublicationName(), // for Advisor, Faculty Menus
]);
