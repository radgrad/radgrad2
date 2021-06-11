import React from 'react';
import { Form } from 'semantic-ui-react';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';

interface AdvisorFilterStudentsProps {
  firstName: string;
  setFirstName: (name) => void;
  lastName: string;
  setLastName: (name) => void;
  username: string;
  setUserName: (name) => void;
  numStudents: number;
}

const AdvisorFilterStudents: React.FC<AdvisorFilterStudentsProps> = ({
  firstName,
  setFirstName,
  lastName,
  setUserName,
  username,
  setLastName,
  numStudents,
}) => {
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleChangeUserName = (event) => {
    setUserName(event.target.value);
  };

  const clearFilter = () => {
    setFirstName('');
    setLastName('');
    setUserName('');
  };
  const header = <RadGradHeader title='students' count={numStudents} />;
  return (
    <RadGradSegment header={header} style={{ backgroundColor: '#EDF6F5' }}>
      <Form onSubmit={clearFilter}>
        <Form.Group inline>
          <Form.Field>
            <Form.Input id={COMPONENTIDS.ADVISOR_FILTER_FIRST_NAME} name="firstName" label={{ basic: 'true', children: 'First Name:' }} value={firstName} onChange={handleChangeFirstName} />
          </Form.Field>
          <Form.Field>
            <Form.Input id={COMPONENTIDS.ADVISOR_FILTER_LAST_NAME} name="lastName" label={{ basic: 'true', children: 'Last Name:' }} value={lastName} onChange={handleChangeLastName} />
          </Form.Field>
          <Form.Field>
            <Form.Input id={COMPONENTIDS.ADVISOR_FILTER_USERNAME} name="userName" label={{ basic: 'true', children: 'Username:' }} value={username} onChange={handleChangeUserName} />
          </Form.Field>
          <Form.Button basic color="green" content="Clear Filter" />
        </Form.Group>
      </Form>
    </RadGradSegment>
  );
};

export default AdvisorFilterStudents;
