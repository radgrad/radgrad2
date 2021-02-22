import React from 'react';
import {useRouteMatch} from 'react-router-dom';
import HeaderPane from '../components/shared/HeaderPane';
import {getMenuWidget} from './shared/utilities/getMenuWidget';

interface PageLayoutProps {
  id: string,
  headerPaneImage?: string,
  headerPaneTitle: string,
  headerPaneBody?: string,
  children?: React.ReactNode,
}

const PageLayout: React.FC<PageLayoutProps> = ({id, headerPaneImage, headerPaneTitle, headerPaneBody = '', children}) => {
  const match = useRouteMatch();
  return (
    <div id={id}>
      {getMenuWidget(match)}
      <HeaderPane image={headerPaneImage} title={headerPaneTitle} body={headerPaneBody}/>
      <div style={{marginRight: '20px', marginLeft: '20px'}}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
