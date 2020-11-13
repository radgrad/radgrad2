import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import CommunityRadGradVideosWidget from '../../components/shared/CommunityRadGradVideosPage/CommunityRadGradVideosWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import { URL_ROLES } from '../../../startup/client/route-constants';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { IMatchProps } from '../../components/shared/RouterHelperFunctions';

interface ICommunityRadGradVideosPageProps {
  match: IMatchProps;
}

const CommunityRadGradVideosPage = (props: ICommunityRadGradVideosPageProps) => {
  const { match } = props;
  const getMenuWidget = (): JSX.Element => {
    const role = Router.getRoleByUrl(match);
    switch (role) {
      case URL_ROLES.STUDENT:
        return <StudentPageMenuWidget />;
      case URL_ROLES.FACULTY:
        return <FacultyPageMenuWidget />;
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

export default withRouter(CommunityRadGradVideosPage);
