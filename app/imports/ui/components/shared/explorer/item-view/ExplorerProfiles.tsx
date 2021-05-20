import React, { useState } from 'react';
import { Container, Header, Divider, Segment } from 'semantic-ui-react';
import { ROLE } from '../../../../../api/role/Role';
import { Users } from '../../../../../api/user/UserCollection';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import UserLabel from '../../profile/UserLabel';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { getUserIDsWithProfileExplorerMethod, getVisibleUsernames } from '../../../../../api/user/profile-entries/ProfileAssociatedUsers.methods';
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
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState(visibleUsersInitialState);
  const [fetched, setFetched] = useState(false);

  getUserIDsWithProfileExplorerMethod.callPromise({ itemID: item._id, role: ROLE.FACULTY, explorerType  })
    .then(res => (res && faculty.length !== res.length) && setFaculty(res.map((id) => Users.getProfile(id))));

  getUserIDsWithProfileExplorerMethod.callPromise({ itemID: item._id, role: ROLE.STUDENT, explorerType })
    .then(res => (res && students.length !== res.length) && setStudents(res.map((id) => Users.getProfile(id))));

  getUserIDsWithProfileExplorerMethod.callPromise({ itemID: item._id, role: ROLE.ADVISOR, explorerType })
    .then(res => (res && advisors.length !== res.length) && setAdvisors(res.map((id) => Users.getProfile(id))));

  if (!fetched) {
    getVisibleUsernames.callPromise({ itemID: item._id, explorerType })
      .catch(error => console.log('Error: getVisibleUserIDs', error.message))
      .then(results => { setVisibleUsers(results); setFetched(true); });
  }
  console.log(visibleUsers);

  return (
        <Segment>
            <Header as="h5" textAlign="center">
                (VISIBLE) STUDENTS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.STUDENT].length} />
            </Header>
            <Container>
                {visibleUsers[ROLE.STUDENT].map((student) => (
                    <UserLabel key={student} username={student} />
                ))}
            </Container>
            <Divider />
            <Header as="h5" textAlign="center">
                FACULTY MEMBERS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.FACULTY].length} />
            </Header>
            <Container>
                {visibleUsers[ROLE.FACULTY].map((fac) => (
                    <UserLabel username={fac} key={fac} />
                ))}
            </Container>
            <Divider />
            <Header as="h5" textAlign="center">
                ADVISORS <WidgetHeaderNumber inputValue={visibleUsers[ROLE.ADVISOR].length} />
            </Header>
            <Container>
                {visibleUsers[ROLE.ADVISOR].map((fac) => (
                    <UserLabel username={fac} key={fac} />
                ))}
            </Container>
        </Segment>
  );
};

export default ExplorerProfiles;
