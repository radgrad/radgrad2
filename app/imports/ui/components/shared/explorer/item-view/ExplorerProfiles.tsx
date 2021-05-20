import React, { useState } from 'react';
import { Header, Divider, Segment } from 'semantic-ui-react';
import { ROLE } from '../../../../../api/role/Role';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import UserLabel from '../../profile/UserLabel';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { getVisibleUsernames } from '../../../../../api/user/profile-entries/ProfileAssociatedUsers.methods';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';

interface ExplorerProfileWidgetProps {
  item: Interest | CareerGoal | Course | Opportunity;
  explorerType: EXPLORER_TYPE;
}

const visibleUsersInitialState = {};
visibleUsersInitialState[ROLE.FACULTY] = [];
visibleUsersInitialState[ROLE.STUDENT] = [];
visibleUsersInitialState[ROLE.ADVISOR] = [];

const ExplorerProfiles: React.FC<ExplorerProfileWidgetProps> = ({ item, explorerType }) => {
  const [visibleUsers, setVisibleUsers] = useState(visibleUsersInitialState);
  const [fetched, setFetched] = useState(false);

  if (!fetched) {
    getVisibleUsernames.callPromise({ itemID: item._id, explorerType })
      .catch(error => console.log('Error: getVisibleUserIDs', error.message))
      .then(results => {
        setVisibleUsers(results);
        setFetched(true);
      });
  }

  return (
    <Segment>
      <Header as="h5" textAlign="center">
        (VISIBLE) STUDENTS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.STUDENT].length} />
      </Header>
      {visibleUsers[ROLE.STUDENT].map(username => <UserLabel key={username} username={username} />)}
      <Divider />
      <Header as="h5" textAlign="center">
        (RELATED) FACULTY MEMBERS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.FACULTY].length} />
      </Header>
      {visibleUsers[ROLE.FACULTY].map(username => <UserLabel key={username} username={username} />)}
      <Divider />
      <Header as="h5" textAlign="center">
        (RELATED) ADVISORS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.ADVISOR].length} />
      </Header>
      {visibleUsers[ROLE.ADVISOR].map(username => <UserLabel key={username} username={username} />)}
    </Segment>
  );
};

export default ExplorerProfiles;
