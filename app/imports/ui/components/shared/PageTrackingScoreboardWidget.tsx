import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Menu, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import moment from 'moment';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { IPageInterestsDailySnapshot } from '../../../typings/radgrad';
import { IPageInterestsCategoryTypes } from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { RootState } from '../../../redux/types';
import {
  aggregateDailySnapshots,
  getCategory,
  IAggregatedDailySnapshot,
  parseName,
} from './page-tracking-helper-functions';

interface IPageTrackingScoreboardWidgetProps {
  pageInterestsDailySnapshots: IPageInterestsDailySnapshot[];
  scoreboardMenuCategory: IPageInterestsCategoryTypes;
}

const mapStateToProps = (state: RootState) => ({
  scoreboardMenuCategory: state.shared.pageTracking.scoreboardMenuCategory,
});

const PageTrackingScoreboardWidget = (props: IPageTrackingScoreboardWidgetProps) => {
  const { pageInterestsDailySnapshots, scoreboardMenuCategory } = props;
  const aggregatedDailySnapshot: IAggregatedDailySnapshot = aggregateDailySnapshots(pageInterestsDailySnapshots);

  /* ######################### Table State ######################### */
  const [column, setColumn] = useState<'name' | 'views'>(null);
  const [data, setData] = useState<IAggregatedDailySnapshot>(aggregatedDailySnapshot);
  const dataBeforeFilter: IAggregatedDailySnapshot = data;
  const [direction, setDirection] = useState<'ascending' | 'descending'>(null);
  /* ######################### Date Picker State ######################### */
  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);

  /* ######################### Styles ######################### */
  const tableBodyScrollStyle = {
    maxHeight: '10px',
    overflowY: 'scroll',
  };

  /* ######################### Event Handlers ######################### */
  const handleSort = (e, clickedColumn) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      const newData: IAggregatedDailySnapshot = { ...data, [category]: _.sortBy(data[category], [clickedColumn]) };
      setData(newData);
      setDirection('ascending');
      return;
    }

    // Create new data by first creating a slice of data[category] so we do not mutate state directly,
    // and then reverse that slice. Then rebuild a new data object by combining old data with the new reversed data.
    const newData: IAggregatedDailySnapshot = { ...data, [category]: data[category].slice().reverse() };
    setData(newData);
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };

  const handleFilter = () => {
    if (startDate === null || endDate === null) {
      Swal.fire({
        title: 'Date Selection Required',
        text: 'A Start and End Date selection is required.',
        icon: 'error',
      });
      return;
    }
    const filteredDailySnapshots: IPageInterestsDailySnapshot[] = PageInterestsDailySnapshots.findNonRetired({
      timestamp: {
        $gte: startDate,
        $lte: moment(endDate).endOf('day').toDate(),
      },
    });
    const filteredAggregatedDailySnapshots: IAggregatedDailySnapshot = aggregateDailySnapshots(filteredDailySnapshots);
    // Handle sort
    if (column !== null) {
      const newData: IAggregatedDailySnapshot = {
        ...filteredAggregatedDailySnapshots,
        [category]: _.sortBy(filteredAggregatedDailySnapshots[category], [column]),
      };
      setData(newData);
    } else {
      setData(filteredAggregatedDailySnapshots);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setData(dataBeforeFilter);
  };

  /* ######################### Variables ######################### */
  const category = getCategory(scoreboardMenuCategory);

  return (
    <Grid columns={2}>
      {/* Scoreboard View */}
      <Grid.Column width={11}>
        <Table striped sortable style={tableBodyScrollStyle}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={(e) => handleSort(e, 'name')}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'views' ? direction : null}
                onClick={(e) => handleSort(e, 'views')}
              >
                Page Views
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* TODO Show items that have 0 views */}
            {data[category].length > 0 ?
              (
                <React.Fragment>
                  {data[category].map((snapshot) => (
                    <Table.Row key={`${category}-${snapshot.name}:${snapshot.views}`}>
                      <Table.Cell width={10}>{parseName(scoreboardMenuCategory, snapshot.name)}</Table.Cell>
                      <Table.Cell width={6}>{snapshot.views}</Table.Cell>
                    </Table.Row>
                  ))}
                </React.Fragment>
              )
              : 'There are no items in this category that have more than 0 views.'}
          </Table.Body>
        </Table>
      </Grid.Column>

      {/* Filters */}
      <Grid.Column width={5}>
        <Menu text vertical fluid>
          <Menu.Item header>FILTER BY DATE</Menu.Item>
          <Grid.Row>
            <Grid columns={2}>
              <Grid.Column><Menu.Item onClick={handleFilter}>Filter</Menu.Item></Grid.Column>
              <Grid.Column><Menu.Item onClick={handleClear}>Clear</Menu.Item></Grid.Column>
            </Grid>
          </Grid.Row>
          <DatePicker
            selectsStart
            showMonthDropdown
            showYearDropdown
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
          />
          <DatePicker
            selectsEnd
            showMonthDropdown
            showYearDropdown
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            selected={endDate}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
          />
        </Menu>
      </Grid.Column>
    </Grid>
  );
};

const PageTrackingScoreboardWidgetCon = connect(mapStateToProps)(PageTrackingScoreboardWidget);
const PageTrackingScoreboardWidgetContainer = withTracker(() => {
  const pageInterestsDailySnapshots: IPageInterestsDailySnapshot[] = PageInterestsDailySnapshots.findNonRetired({});
  return {
    pageInterestsDailySnapshots,
  };
})(PageTrackingScoreboardWidgetCon);

export default PageTrackingScoreboardWidgetContainer;
