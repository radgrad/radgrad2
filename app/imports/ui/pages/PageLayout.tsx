import React from 'react';
import {useRouteMatch} from 'react-router-dom';
import HeaderPane from '../components/shared/HeaderPane';
import {getMenuWidget} from './shared/utilities/getMenuWidget';

interface PageLayoutProps {
  id: string,
  headerPaneImage?: string,
  headerPaneTitle: string,
  headerPaneBody?: string,
  headerPaneButton?: React.ReactNode,
  children?: React.ReactNode,
  disableMargin?: boolean,
}

const PageLayout: React.FC<PageLayoutProps> = ({id, headerPaneImage, headerPaneTitle, headerPaneBody = '', children, disableMargin = false, headerPaneButton}) => {
  const match = useRouteMatch();
  const margin = disableMargin ? {} : {marginRight: '20px', marginLeft: '20px'};
  return (
    <div id={id}>
      {getMenuWidget(match)}
      <HeaderPane image={headerPaneImage} title={headerPaneTitle} body={headerPaneBody} bodyButton={headerPaneButton}/>
      <div style={margin}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
