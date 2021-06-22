import React, { useState } from 'react';
import { Header, Divider, Segment, Button, Grid } from 'semantic-ui-react';
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
const allStudents = {};
allStudents[ROLE.STUDENT] = [];

const ExplorerProfiles: React.FC<ExplorerProfileWidgetProps> = ({ item, explorerType }) => {
  const [visibleUsers, setVisibleUsers] = useState(visibleUsersInitialState);
  const [numberOfStudents, setNumberOfStudents] = useState(allStudents);
  const [fetched, setFetched] = useState(false);
  const [visibleStudents, setVisibleStudents] = useState(10);
  const [buttonText, setButtonText] = useState('Show More');

  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    visibleStudents === 10 ? (
      setVisibleStudents(visibleUsers[ROLE.STUDENT].length),
      setButtonText('Show Less')
    ) : (
      setVisibleStudents(10),
      setButtonText('Show More Students')
    );
  };

  if (!fetched) {
    getVisibleUsernames.callPromise({ itemID: item._id, explorerType })
      .catch(error => console.log('Error: getVisibleUserIDs', error.message))
      .then(results => {
        setVisibleUsers(results);
        setNumberOfStudents(results);
        setFetched(true);
      });
  }

  return (
    <Segment>
      <Header as="h5">
        (VISIBLE) STUDENTS <WidgetHeaderNumber inputValue={numberOfStudents[ROLE.STUDENT].length} />
      </Header>
      {visibleUsers[ROLE.STUDENT].slice(0, visibleStudents).map(username => <UserLabel key={username} username={username} />)}
      {visibleUsers[ROLE.STUDENT].length > 10 &&
      <Grid>
        <Grid.Column>
          <Button onClick={handleClick}>{buttonText}</Button>
        </Grid.Column>
      </Grid>
      }
      <Divider />
      <Header as="h5">
        (RELATED) FACULTY MEMBERS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.FACULTY].length} />
      </Header>
      {visibleUsers[ROLE.FACULTY].map(username => <UserLabel key={username} username={username} />)}
      <Divider />
      <Header as="h5">
        (RELATED) ADVISORS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.ADVISOR].length} />
      </Header>
      {visibleUsers[ROLE.ADVISOR].map(username => <UserLabel key={username} username={username} />)}
    </Segment>
  );
};

export default ExplorerProfiles;
