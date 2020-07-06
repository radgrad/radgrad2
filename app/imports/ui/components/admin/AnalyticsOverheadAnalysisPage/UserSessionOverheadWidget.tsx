import React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Tab, Table } from 'semantic-ui-react';
import { RootState } from '../../../../redux/types';
import { IAdminAnalyticsOverheadAnalysisData } from '../../../../redux/admin/analytics/reducers';

interface IUserSessionOverheadWidgetProps {
  overheadBuckets: number[];
  overheadData: IAdminAnalyticsOverheadAnalysisData[];
}

const mapStateToProps = (state: RootState): { [key: string]: any } => ({
  overheadBuckets: state.admin.analytics.overheadAnalysis.overheadBuckets,
  overheadData: state.admin.analytics.overheadAnalysis.overheadData,
});

const handleShowClick = (event) => {
  event.preventDefault();
};

const UserSessionOverheadWidget = (props: IUserSessionOverheadWidgetProps) => {
  const firstTableStyle = { width: '99%' };
  const secondTableStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflow: 'scroll',
  };

  return (
    <Tab.Pane attached={false}>
      <Container>
        <Table fixed celled striped style={firstTableStyle}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell># Sessions</Table.HeaderCell>
              <Table.HeaderCell># Docs</Table.HeaderCell>
              <Table.HeaderCell>Docs/Min</Table.HeaderCell>
              <Table.HeaderCell>Total Time</Table.HeaderCell>
              <Table.HeaderCell>Show Docs</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
      </Container>
      <Container style={secondTableStyle}>
        <Table fixed celled striped>
          <Table.Body>
            {props.overheadData.map((user) => (
              <Table.Row>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user['num-sessions']}</Table.Cell>
                <Table.Cell>{user['num-docs']}</Table.Cell>
                <Table.Cell>{user['docs-per-min']}</Table.Cell>
                <Table.Cell>{user['total-time']}</Table.Cell>
                {/* TODO MOdal */}
                <Table.Cell>
                  <Button size="tiny" color="green" basic fluid onClick={handleShowClick}>SHOW</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </Tab.Pane>
  );
};

export default connect(mapStateToProps, null)(UserSessionOverheadWidget);
