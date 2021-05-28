import _ from 'lodash';
import React from 'react';
import { Table } from 'semantic-ui-react';
import { USER_INTERACTION_DESCRIPTIONS } from '../../../../api/user-interaction/UserInteractionCollection';
import { UserInteraction } from '../../../../typings/radgrad';
import UserLabel from '../../shared/profile/UserLabel';

interface BehaviorTableProps {
  userInteractions: UserInteraction[];
}

/** Returns a table with the behaviors found in the passed list of UserInteractions, organized by type. */
const BehaviorTable: React.FC<BehaviorTableProps> = ({ userInteractions }) => {
  const groups = _.groupBy(userInteractions, 'type');
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Behavior</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Num Users</Table.HeaderCell>
          <Table.HeaderCell>Users</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.keys(groups).map(key => {
          const behavior = key;
          const description = USER_INTERACTION_DESCRIPTIONS[behavior];
          const users = groups[key].map(instance => instance.username).map(username => <UserLabel key={username} username={username}/>);
          // const users = _.map(groups[key], 'username').map(username => <UserLabel key={username} username={username}/>);
          // should this line be improved?
          return (
            <Table.Row key={behavior}>
              <Table.Cell>{behavior}</Table.Cell>
              <Table.Cell>{description}</Table.Cell>
              <Table.Cell>{users.length}</Table.Cell>
              <Table.Cell>{users}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default BehaviorTable;