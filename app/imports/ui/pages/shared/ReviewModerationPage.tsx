import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { getMenuWidget } from './utilities/getMenuWidget';
import HeaderPane from '../../components/shared/HeaderPane';

const headerPaneTitle = 'Moderate student-submitted reviews';
const headerPaneBody = `
Students can submit reviews of courses and opportunities. 

Faculty and advisors should check these reviews to ensure they are appropriate for public display.
`;

const ReviewModerationPage: React.FC = () => {
  const match = useRouteMatch();
  return (
    <div id="review-moderation-page">
      {getMenuWidget(match)}
      <HeaderPane title={headerPaneTitle} body={headerPaneBody}/>
      <div style={{marginRight: '10px', marginLeft: '10px'}}>
        <Header>Review Moderation Page Placeholder</Header>
      </div>
    </div>
  );
};

export default ReviewModerationPage;
