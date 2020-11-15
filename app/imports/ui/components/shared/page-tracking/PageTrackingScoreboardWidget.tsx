import React, { useState } from 'react';
import _ from 'lodash';
import { Grid, Table, Header, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import moment from 'moment';
import { PageInterestsDailySnapshots } from '../../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { IPageInterestsDailySnapshot } from '../../../../typings/radgrad';
import {
  aggregateDailySnapshots,
  getCategory, getUrlCategory,
  IAggregatedDailySnapshot,
  parseName,
} from './page-tracking-helper-functions';
import { IMatchProps } from '../utilities/router';
import { IPageInterestsCategoryTypes } from '../../../../api/page-tracking/PageInterestsCategoryTypes';
import PageTrackingWidgetMessage from './PageTrackingWidgetMessage';

interface IPageTrackingScoreboardWidgetProps {
  match: IMatchProps;
  pageInterestsDailySnapshots: IPageInterestsDailySnapshot[];
}

const PageTrackingScoreboardWidget = (props: IPageTrackingScoreboardWidgetProps) => {
  const { pageInterestsDailySnapshots, match } = props;
  const urlCategory: IPageInterestsCategoryTypes = getUrlCategory(match);
  // See page-tracking-general.ts to see urlCategory vs category
  const category = getCategory(urlCategory);

  const aggregatedDailySnapshot: IAggregatedDailySnapshot = aggregateDailySnapshots(pageInterestsDailySnapshots);

  /* ######################### Table State ######################### */
  const [data, setData] = useState<IAggregatedDailySnapshot>(aggregatedDailySnapshot);
  const [dataBeforeFilter] = useState<IAggregatedDailySnapshot>(data);
  const [column, setColumn] = useState<'name' | 'views'>(undefined);
  const [direction, setDirection] = useState<'ascending' | 'descending'>(undefined);
  /* ######################### Date Picker State ######################### */
  const [startDate, setStartDate] = useState<Date>(undefined);
  const [endDate, setEndDate] = useState<Date>(undefined);

  /* ######################### Styles ######################### */
  const tableStyle: React.CSSProperties = { maxHeight: '400px', overflowY: 'auto' };
  const marginBottomStyle: React.CSSProperties = { marginBottom: '5px' };

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
    if (startDate === undefined || endDate === undefined) {
      Swal.fire({
        title: 'Date Selection Required',
        text: 'A Start and End Date selection is required.',
        icon: 'error',
      });
      return;
    }
    const filteredDailySnapshots: IPageInterestsDailySnapshot[] = PageInterestsDailySnapshots.find({
      timestamp: {
        $gte: startDate,
        $lte: moment(endDate).endOf('day').toDate(),
      },
    }).fetch();
    const filteredAggregatedDailySnapshots: IAggregatedDailySnapshot = aggregateDailySnapshots(filteredDailySnapshots);
    // Handle sort to main sort properties (ascending/descending for a clicked column) when we filter data
    if (column !== undefined) {
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
    setStartDate(undefined);
    setEndDate(undefined);
    setData(dataBeforeFilter);
  };

  return (
    <Grid columns={2}>
      {/* Table View */}
      <Grid.Column width={11}>
        <div style={tableStyle}>
          <Table celled striped sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'name' ? direction : undefined}
                  onClick={(e) => handleSort(e, 'name')}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'views' ? direction : undefined}
                  onClick={(e) => handleSort(e, 'views')}
                >
                  Page Views
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data[category].length > 0 ?
                (
                  <React.Fragment>
                    {data[category].map((snapshot) => (
                      <Table.Row key={`${category}-${snapshot.name}:${snapshot.views}`}>
                        <Table.Cell width={10}>{parseName(urlCategory, snapshot.name)}</Table.Cell>
                        <Table.Cell width={6}>{snapshot.views}</Table.Cell>
                      </Table.Row>
                    ))}
                  </React.Fragment>
                )
                : undefined}
            </Table.Body>
          </Table>
        </div>
        <PageTrackingWidgetMessage />
      </Grid.Column>

      {/* Date Filter */}
      <Grid.Column width={5}>
        <Header>FILTER BY DATE</Header>
        <Grid.Row style={marginBottomStyle}>
          <Button size="mini" onClick={handleFilter}>Filter</Button>
          <Button size="mini" onClick={handleClear}>Clear</Button>
        </Grid.Row>
        <Grid.Row>
          <DatePicker
            selectsStart
            showMonthDropdown
            showYearDropdown
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate || new Date()}
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
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

const PageTrackingScoreboardWidgetCon = withTracker(() => {
  const pageInterestsDailySnapshots: IPageInterestsDailySnapshot[] = PageInterestsDailySnapshots.find({}).fetch();
  return {
    pageInterestsDailySnapshots,
  };
})(PageTrackingScoreboardWidget);
const PageTrackingScoreboardWidgetContainer = withRouter(PageTrackingScoreboardWidgetCon);
export default PageTrackingScoreboardWidgetContainer;
