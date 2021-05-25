import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import { updateLastVisited } from '../../api/user/BaseProfileCollection.methods';
import { Users } from '../../api/user/UserCollection';
import HeaderPane from '../components/shared/HeaderPane';
import PageFooter from '../components/shared/PageFooter';
import { getMenuWidget } from './shared/utilities/getMenuWidget';

interface PageLayoutProps {
  id: string,
  headerPaneImage?: string,
  headerPaneTitle: string,
  headerPaneBody?: string,
  headerPaneButton?: React.ReactNode,
  children?: React.ReactNode,
}

// TODO: id should become pageID with type PAGEIDS.
const PageLayout: React.FC<PageLayoutProps> = ({ id, headerPaneImage, headerPaneTitle, headerPaneBody = '', children, headerPaneButton }) => {
  const match = useRouteMatch();
  const padding = { paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px', paddingBottom: '20px' };
  // The next 9 lines update the lastVisited entry for this page if necessary.
  const { username } = useParams();
  if (username && Users.hasProfile(username)) {
    const profile = Users.getProfile(username);
    const lastVisitedEntry = profile.lastVisited && profile.lastVisited[id];
    const now = moment().format('YYYY-MM-DD');
    if (now !== lastVisitedEntry) {
      updateLastVisited.callPromise({ pageID: id });
    }
  }
  return (
    <div id={id}>
      {getMenuWidget(match)}
      <HeaderPane image={headerPaneImage} title={headerPaneTitle} body={headerPaneBody} bodyButton={headerPaneButton}/>
      <div style={padding}>
        {children}
      </div>
      <PageFooter/>
    </div>
  );
};

export default PageLayout;