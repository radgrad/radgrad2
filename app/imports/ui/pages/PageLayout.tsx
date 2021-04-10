import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import HeaderPane from '../components/shared/HeaderPane';
import { getMenuWidget } from './shared/utilities/getMenuWidget';

interface PageLayoutProps {
  id: string,
  headerPaneImage?: string,
  headerPaneTitle: string,
  headerPaneBody?: string,
  headerPaneButton?: React.ReactNode,
  children?: React.ReactNode,
}

const PageLayout: React.FC<PageLayoutProps> = ({ id, headerPaneImage, headerPaneTitle, headerPaneBody = '', children, headerPaneButton }) => {
  const match = useRouteMatch();
  const padding = { paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px' };
  return (
    <div id={id}>
      {getMenuWidget(match)}
      <HeaderPane image={headerPaneImage} title={headerPaneTitle} body={headerPaneBody} bodyButton={headerPaneButton}/>
      <div style={padding}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
