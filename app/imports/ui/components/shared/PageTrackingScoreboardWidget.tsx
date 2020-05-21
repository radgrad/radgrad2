import React from 'react';
import { Grid, Table, Form, Menu, Radio } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { withTracker } from 'meteor/react-meteor-data';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';

interface IPageTrackingScoreboardWidgetProps {
}

const PageTrackingScoreboardWidget = (props: IPageTrackingScoreboardWidgetProps) => {
  const tableBodyScrollStyle = {
    maxHeight: '10px',
    overflowY: 'scroll',
  };

  return (
    <React.Fragment>
      <Grid columns={2}>
        <Grid.Column width={11}>
          <Table style={tableBodyScrollStyle}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Interests</Table.HeaderCell>
                <Table.HeaderCell>Page Views</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Algorithms</Table.Cell>
                <Table.Cell>47</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>

        <Grid.Column width={5}>
          <Menu text vertical fluid>
            <Menu.Item header>SORT BY</Menu.Item>
            <Form>
              <Form.Field>
                <Radio checked label="Alphabetical Order" />
              </Form.Field>

              <Form.Field>
                <Radio label="Most Views" />
              </Form.Field>

              <Form.Field>
                <Radio label="Least Views" />
              </Form.Field>
            </Form>
            <br />
            <Menu.Item header>FILTER BY DATE</Menu.Item>
            <DatePicker />
            <DatePicker />
            <Menu.Item>Past Month</Menu.Item>
            <Menu.Item>By Semester</Menu.Item>
            <Menu.Item>By Academic Year</Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
};

const PageTrackingScoreboardWidgetContainer = withTracker(() => {
  const pageInterestsDailySnapshots = PageInterestsDailySnapshots.findNonRetired({});
  return {
    pageInterestsDailySnapshots,
  };
})(PageTrackingScoreboardWidget);

export default PageTrackingScoreboardWidgetContainer;
