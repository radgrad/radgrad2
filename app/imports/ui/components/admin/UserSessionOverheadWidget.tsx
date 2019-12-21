import * as React from 'react';
import { Container, Tab, Table } from 'semantic-ui-react';

const UserSessionOverheadWidget = () => {
  const tableStyle = { width: '99%' };
  const tableBodyStyle = {
    maxHeight: '400px',
    overflow: 'scroll',
  };

  return (
    <Tab.Pane attached={false}>
      <Container>
        <Table fixed celled striped style={tableStyle}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell># Sessions</Table.HeaderCell>
              <Table.HeaderCell># Docs</Table.HeaderCell>
              <Table.HeaderCell>Docs/Min</Table.HeaderCell>
              <Table.HeaderCell>Total Time</Table.HeaderCell>
              <Table.HeaderCell>Show Docs</Table.HeaderCell>
            </Table.Row>
            {}
          </Table.Header>
          <Table.Body style={tableBodyStyle}>

          </Table.Body>
        </Table>
      </Container>
    </Tab.Pane>
  );
};

export default UserSessionOverheadWidget;
