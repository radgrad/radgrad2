import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
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

const handleShowClick = (event): void => {
  event.preventDefault();
};

type tableColumns = 'username' | 'sessions' | 'num-docs' | 'docs-per-min' | 'total-time';

const UserSessionOverheadWidget = (props: IUserSessionOverheadWidgetProps) => {
  const [data, setData] = useState<IAdminAnalyticsOverheadAnalysisData[]>(props.overheadData);
  const [column, setColumn] = useState<tableColumns>(undefined);
  const [direction, setDirection] = useState<'ascending' | 'descending'>(undefined);

  // If Date Selection gets re-fired, update data
  useEffect(() => {
    setData(props.overheadData);
  }, [props.overheadData]);

  const handleSort = (event, clickedColumn: tableColumns): void => {
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
        {/* TODO sortable */}
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
                {/* TODO Modal */}
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
