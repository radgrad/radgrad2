import _ from 'lodash';
import React from 'react';
import { Table } from 'semantic-ui-react';
import { USER_INTERACTION_DESCRIPTIONS } from '../../../../api/user-interaction/UserInteractionCollection';
import { UserInteraction } from '../../../../typings/radgrad';

interface BehaviorAggregatesProps {
  userInteractions: UserInteraction[];
}

/** Returns a table with the behaviors found in the passed list of UserInteractions, organized by type. */
const BehaviorAggregates: React.FC<BehaviorAggregatesProps> = ({ userInteractions }) => {
  const groups = _.groupBy(userInteractions, 'type');
  return (
    <Table basic>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Behavior</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Users</Table.HeaderCell>
        </Table.Row>
        {Object.keys(groups).map(key => {
          const behavior = key;
          const description = USER_INTERACTION_DESCRIPTIONS[behavior];
          const users = _.map(groups[key], 'username').toString();
          return (
            <Table.Row key={behavior}>
              <Table.Cell>{behavior}</Table.Cell>
              <Table.Cell>{description}</Table.Cell>
              <Table.Cell>{users}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Header>
    </Table>
  );
};

export default BehaviorAggregates;