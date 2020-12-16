import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { Container, Tab, Table } from 'semantic-ui-react';
import { RootState } from '../../../../../redux/types';
import { AdminAnalyticsOverheadAnalysisData } from '../../../../../redux/admin/analytics/reducers';
import { UserInteraction } from '../../../../../typings/radgrad';
import UserSessionOverheadModal from './UserSessionOverheadModal';

interface UserSessionOverheadWidgetProps {
  overheadData: AdminAnalyticsOverheadAnalysisData[];
  userInteractions: { [username: string]: UserInteraction[] };
}

const mapStateToProps = (state: RootState): { [key: string]: any } => ({
  overheadData: state.admin.analytics.overheadAnalysis.overheadData,
  userInteractions: state.admin.analytics.overheadAnalysis.userInteractions,
});

type TableColumns = 'username' | 'sessions' | 'num-docs' | 'docs-per-min' | 'total-time';

const UserSessionOverheadWidget: React.FC<UserSessionOverheadWidgetProps> = ({ overheadData, userInteractions }) => {
  const [data, setData] = useState<AdminAnalyticsOverheadAnalysisData[]>(overheadData);
  const [column, setColumn] = useState<TableColumns>(undefined);
  const [direction, setDirection] = useState<'ascending' | 'descending'>(undefined);

  // If Date Selection gets re-fired, update data
  useEffect(() => {
    setData(overheadData);
  }, [overheadData]);

  const handleSort = (event, clickedColumn: TableColumns): void => {
    event.preventDefault();
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      setData(_.sortBy(data, [clickedColumn]));
      setDirection('ascending');
      return;
    }
    setData(data.reverse());
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };

  const firstTableStyle = { width: '99%' };
  const secondTableStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflow: 'scroll',
  };

  return (
    <Tab.Pane attached={false}>
      <Container>
        <Table fixed celled striped sortable style={firstTableStyle}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'username' ? direction : undefined}
                onClick={(e) => handleSort(e, 'username')}
              >
                Username
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'sessions' ? direction : undefined}
                onClick={(e) => handleSort(e, 'sessions')}
              >
                # Sessions
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'num-docs' ? direction : undefined}
                onClick={(e) => handleSort(e, 'num-docs')}
              >
                # Docs
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'docs-per-min' ? direction : undefined}
                onClick={(e) => handleSort(e, 'docs-per-min')}
              >
                Docs/Min
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'total-time' ? direction : undefined}
                onClick={(e) => handleSort(e, 'total-time')}
              >
                Total Time
              </Table.HeaderCell>
              <Table.HeaderCell>Show Docs</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
      </Container>
      <Container style={secondTableStyle}>
        <Table fixed celled striped>
          <Table.Body>
            {data.map((user) => (
              <Table.Row key={_.uniqueId(user.username)}>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user['num-sessions']}</Table.Cell>
                <Table.Cell>{user['num-docs']}</Table.Cell>
                <Table.Cell>{user['docs-per-min']}</Table.Cell>
                <Table.Cell>{user['total-time']}</Table.Cell>
                <Table.Cell>
                  <UserSessionOverheadModal
                    username={user.username}
                    userInteractionsByUser={userInteractions[user.username]}
                  />
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
