import React from 'react';
import { Button, Modal, Table } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import { UserInteraction } from '../../../../../typings/radgrad';
import { Users } from '../../../../../api/user/UserCollection';

interface UserSessionOverheadModalProps {
  username: string;
  userInteractionsByUser: UserInteraction[];
}

const formatDate = (date: Date): string => moment(date).format('MM/DD/YY HH:mm');

const UserSessionOverheadModal: React.FC<UserSessionOverheadModalProps> = ({ username, userInteractionsByUser }) => {
  const fullName = Users.getFullName(username);

  const fullNameStyle: React.CSSProperties = { color: '#6FBE44' };
  const tableStyle: React.CSSProperties = {
    height: '350px',
    overflowX: 'scroll',
    width: '100%',
  };

  return (
    <Modal trigger={<Button size="tiny" color="green" basic fluid>SHOW</Button>}>
      <Modal.Header>User Interactions: <span style={fullNameStyle}>{fullName}</span></Modal.Header>
      <Modal.Content>
        <div style={tableStyle}>
          <Table celled padded columns={3}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Type Data</Table.HeaderCell>
                <Table.HeaderCell>Timestamp</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {userInteractionsByUser.map((interaction) => (
                <Table.Row key={_.uniqueId(`${interaction.username}-${interaction.type}`)}>
                  <Table.Cell>{interaction.type}</Table.Cell>
                  <Table.Cell>{interaction.typeData.join(', ')}</Table.Cell>
                  <Table.Cell>{formatDate(interaction.timestamp)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default UserSessionOverheadModal;
