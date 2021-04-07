import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Users } from '../../api/user/UserCollection';
import { AdvisorOrFacultyProfile, StudentProfile } from '../../typings/radgrad';
import HeaderPane from '../components/shared/HeaderPane';
import { getMenuWidget } from './shared/utilities/getMenuWidget';

interface PageLayoutProps {
  id: string,
  profile: StudentProfile | AdvisorOrFacultyProfile;
  headerPaneImage?: string,
  headerPaneTitle: string,
  headerPaneBody?: string,
  headerPaneButton?: React.ReactNode,
  children?: React.ReactNode,
  disableMargin?: boolean,
}

const PageLayout: React.FC<PageLayoutProps> = ({ id, headerPaneImage, headerPaneTitle, headerPaneBody = '', children, disableMargin = false, headerPaneButton, profile }) => {
  console.log(`PageLayout, ${profile}`);
  const match = useRouteMatch();
  const margin = disableMargin ? {} : { marginRight: '20px', marginLeft: '20px', marginTop: '10px' };
  return (
    <div id={id}>
      {getMenuWidget(match, profile)}
      <HeaderPane image={headerPaneImage} title={headerPaneTitle} body={headerPaneBody} bodyButton={headerPaneButton}/>
      <div style={margin}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
