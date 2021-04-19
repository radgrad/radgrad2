import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import { ROLE } from '../../api/role/Role';
import { updateLastVisited, updateLastVisitedMethod } from '../../api/user/BaseProfileCollection.methods';
import { StudentProfiles } from '../../api/user/StudentProfileCollection';
import { Users } from '../../api/user/UserCollection';
import HeaderPane from '../components/shared/HeaderPane';
import { EXPLORER_TYPE } from '../layouts/utilities/route-constants';
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
  const padding = { paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px' };
  const { username } = useParams();
  if (Users.hasProfile(username)) {
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
    </div>
  );
};

export default PageLayout;