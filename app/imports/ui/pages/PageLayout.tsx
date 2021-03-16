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
  disableMargin?: boolean,
}

const PageLayout: React.FC<PageLayoutProps> = ({id, headerPaneImage, headerPaneTitle, headerPaneBody = '', children, disableMargin = false}) => {
  const match = useRouteMatch();
  const margin = disableMargin ? {} : {marginRight: '20px', marginLeft: '20px'};
  return (
    <div id={id}>
      {getMenuWidget(match)}
      <HeaderPane image={headerPaneImage} title={headerPaneTitle} body={headerPaneBody}/>
      <div style={margin}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
