import React, { useState } from 'react';
import { Container, Header, Divider, Segment } from 'semantic-ui-react';
import { ROLE } from '../../../../../api/role/Role';
import { Users } from '../../../../../api/user/UserCollection';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import UserLabel from '../../profile/UserLabel';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import { getUserIDsWithProfileExplorerMethod } from '../../../../../api/user/profile-entries/ProfileAssociatedUsers.methods';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';

interface ExplorerProfileWidgetProps {
  item: Interest | CareerGoal | Course | Opportunity;
  explorerType: EXPLORER_TYPE;
}

const ExplorerProfiles: React.FC<ExplorerProfileWidgetProps> = ({ item, explorerType }) => {
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  getUserIDsWithProfileExplorerMethod.callPromise({ itemID: item._id, role: ROLE.FACULTY, explorerType  })
    .then(res => (res && faculty.length !== res.length) && setFaculty(res.map((id) => Users.getProfile(id))));

  getUserIDsWithProfileExplorerMethod.callPromise({ itemID: item._id, role: ROLE.STUDENT, explorerType })
    .then(res => (res && students.length !== res.length) && setStudents(res.map((id) => Users.getProfile(id))));

  getUserIDsWithProfileExplorerMethod.callPromise({ itemID: item._id, role: ROLE.ADVISOR, explorerType })
    .then(res => (res && advisors.length !== res.length) && setAdvisors(res.map((id) => Users.getProfile(id))));

  return (
        <Segment>
            <Header as="h5" textAlign="center">
                (VISIBLE) STUDENTS <WidgetHeaderNumber inputValue={students.length} />
            </Header>
            <Container>
                {students.map((student) => (
                    <UserLabel key={student.username} username={student.username} />
                ))}
            </Container>
            <Divider />
            <Header as="h5" textAlign="center">
                FACULTY MEMBERS <WidgetHeaderNumber inputValue={faculty.length} />
            </Header>
            <Container>
                {faculty.map((fac) => (
                    <UserLabel username={fac.username} key={fac.username} />
                ))}
            </Container>
            <Divider />
            <Header as="h5" textAlign="center">
                ADVISORS <WidgetHeaderNumber inputValue={advisors.length} />
            </Header>
            <Container>
                {advisors.map((fac) => (
                    <UserLabel username={fac.username} key={fac.username} />
                ))}
            </Container>
        </Segment>
  );
};

export default ExplorerProfiles;
