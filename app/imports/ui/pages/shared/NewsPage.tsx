import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { getMenuWidget } from './utilities/getMenuWidget';
import HeaderPane from '../../components/shared/HeaderPane';

const NewsPage: React.FC = () => {
  const match = useRouteMatch();
  return (
    <div id="news-page">
      {getMenuWidget(match)}
      <HeaderPane
        title="News Page"
        line1="What's happening in RadGrad?"
        line2="This page let's you know about new and upcoming events in RadGrad."
      />
      <div style={{marginRight: '10px', marginLeft: '10px'}}>
        <Header>News Page Placeholder</Header>
      </div>
    </div>
  );
};

export default NewsPage;
