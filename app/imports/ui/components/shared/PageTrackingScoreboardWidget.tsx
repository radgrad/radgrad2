import React from 'react';
import { connect } from 'react-redux';
import { Form, Grid, Menu, Radio, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { withTracker } from 'meteor/react-meteor-data';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { IPageInterestsDailySnapshot } from '../../../typings/radgrad';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { RootState } from '../../../redux/types';

interface IPageTrackingScoreboardWidgetProps {
  pageInterestsDailySnapshots: IPageInterestsDailySnapshot[];
  scoreboardMenuCategory: IPageInterestsCategoryTypes;
}

const mapStateToProps = (state: RootState) => ({
  scoreboardMenuCategory: state.shared.pageTracking.scoreboardMenuCategory,
});

const PageTrackingScoreboardWidget = (props: IPageTrackingScoreboardWidgetProps) => {
  console.log('snapshots %o', props.pageInterestsDailySnapshots);
  const tableBodyScrollStyle = {
    maxHeight: '10px',
    overflowY: 'scroll',
  };

  const getCategory = (selectedCategory: IPageInterestsCategoryTypes): string => {
    switch (selectedCategory) {
      case PageInterestsCategoryTypes.CAREERGOAL:
        return 'careerGoals';
      case PageInterestsCategoryTypes.COURSE:
        return 'courses';
      case PageInterestsCategoryTypes.INTEREST:
        return 'interests';
      case PageInterestsCategoryTypes.OPPORTUNITY:
        return 'opportunities';
      default:
        console.error(`Bad selectedCategory: ${selectedCategory}`);
        break;
    }
    return undefined;
  };

  const category = getCategory(props.scoreboardMenuCategory);
  console.log(PageInterestsDailySnapshots.find({}).fetch());
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
              {props.pageInterestsDailySnapshots.map((snapshot, index) => (
                <Table.Row>
                  <Table.Cell>{snapshot[category].name}</Table.Cell>
                  <Table.Cell>{snapshot[category].views}</Table.Cell>
                </Table.Row>
              ))}
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

const PageTrackingScoreboardWidgetCon = connect(mapStateToProps)(PageTrackingScoreboardWidget);
const PageTrackingScoreboardWidgetContainer = withTracker(() => {
  const pageInterestsDailySnapshots = PageInterestsDailySnapshots.findNonRetired({});
  return {
    pageInterestsDailySnapshots,
  };
})(PageTrackingScoreboardWidgetCon);

export default PageTrackingScoreboardWidgetContainer;
