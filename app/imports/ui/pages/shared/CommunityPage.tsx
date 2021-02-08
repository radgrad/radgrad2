import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { getMenuWidget } from './utilities/getMenuWidget';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'What\'s happening in RadGrad?';
const headerPaneBody = `
Here are the latest updates in RadGrad, plus overviews of the RadGrad community.
`;

const CommunityPage: React.FC = () => {
  const match = useRouteMatch();
  return (
    <div id="community-page">
      {getMenuWidget(match)}
      <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
      <div style={{marginRight: '10px', marginLeft: '10px'}}>
        <Header>Community Page Placeholder</Header>
      </div>
    </div>
  );
};

export default CommunityPage;
