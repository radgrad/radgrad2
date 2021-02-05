import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { getMenuWidget } from './utilities/getMenuWidget';

const NewsPage: React.FC = () => {
  const match = useRouteMatch();
  return (
    <div id="news-page">
      {getMenuWidget(match)}
      <Header>News Page Placeholder</Header>
    </div>
  );
};

export default NewsPage;
