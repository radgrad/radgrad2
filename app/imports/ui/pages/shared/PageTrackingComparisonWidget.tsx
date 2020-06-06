import React, { useState } from 'react';
import { Dropdown, Grid, Menu, Table, Message, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import _ from 'lodash';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { RootState } from '../../../redux/types';
import {
  ICareerGoal,
  ICourse,
  IInterest,
  IOpportunity, IPageInterestInfo,
  IPageInterestsDailySnapshot,
} from '../../../typings/radgrad';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import {
  aggregateDailySnapshots, getCategory,
  IAggregatedDailySnapshot, parseName, slugIDToSlugName,
} from '../../components/shared/page-tracking-helper-functions';

interface IPageTrackingComparisonWidgetProps {
  pageInterestsDailySnapshots: IPageInterestsDailySnapshot[];
  comparisonMenuCategory: IPageInterestsCategoryTypes;
}

const mapStateToProps = (state: RootState) => ({
  comparisonMenuCategory: state.shared.pageTracking.comparisonMenuCategory,
});

const getOptions = (comparisonMenuCategory) => {
  switch (comparisonMenuCategory) {
    case PageInterestsCategoryTypes.CAREERGOAL:
      return getOptionsHelper(CareerGoals.find({}).fetch());
    case PageInterestsCategoryTypes.COURSE:
      return getOptionsHelper(Courses.find({}).fetch());
    case PageInterestsCategoryTypes.INTEREST:
      return getOptionsHelper(Interests.find({}).fetch());
    case PageInterestsCategoryTypes.OPPORTUNITY:
      return getOptionsHelper(Opportunities.find({}).fetch());
    default:
      console.error(`Bad comparisonMenuCategory: ${comparisonMenuCategory}`);
      return undefined;
  }
};

const getOptionsHelper = (docs: (ICareerGoal | ICourse | IInterest | IOpportunity)[]) => docs.map((doc) => ({
  key: doc._id,
  text: doc.name,
  value: doc.slugID,
}));

const PageTrackingComparisonWidget = (props: IPageTrackingComparisonWidgetProps) => {
  const { pageInterestsDailySnapshots, comparisonMenuCategory } = props;
  const aggregatedDailySnapshot: IAggregatedDailySnapshot = aggregateDailySnapshots(pageInterestsDailySnapshots);

  const [data, setData] = useState<IPageInterestInfo[]>(undefined);
  const [dataBeforeFilter, setDataBeforeFilter] = useState<IPageInterestInfo[]>(undefined);

  /* ######################### Table State ######################### */
  const [selectedOptions, setSelectedOptions] = useState<string[]>(null);
  const [column, setColumn] = useState<'name' | 'views'>(null);
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
  const setItemsToData = () => {
    const category = getCategory(comparisonMenuCategory);
    const snapshotItems: IPageInterestInfo[] = aggregatedDailySnapshot[category];
    const selectedSlugNames: string[] = [];
    selectedOptions.forEach((option) => {
      const slugName = slugIDToSlugName(option);
      selectedSlugNames.push(slugName);
    });
    const filteredItems: IPageInterestInfo[] = [];
    selectedSlugNames.forEach((slugName) => {
      snapshotItems.forEach((item) => {
        if (slugName === item.name) {
          filteredItems.push(item);
        }
      });
    });
    setData(filteredItems);
    setDataBeforeFilter(filteredItems);
  };

  const handleSearchSelectionChange = (e, { value }) => {
    e.preventDefault();
    setSelectedOptions(value);
  };

  const handleSort = (e, clickedColumn) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      const newData = _.sortBy(data, [clickedColumn]);
      setData(newData);
      setDirection('ascending');
      return;
    }
    const newData = data.slice().reverse();
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

  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setData(dataBeforeFilter);
  };

  return (
    <Grid columns={2}>
      <Grid.Column width={11}>
        <Grid.Row>
          <Grid.Column>
            <Dropdown
              placeholder="Search"
              onChange={handleSearchSelectionChange}
              fluid
              multiple
              search
              selection
              options={getOptions(comparisonMenuCategory)}
            />
          </Grid.Column>
          <Grid.Column>
            <Button onClick={setItemsToData}>Search</Button>
          </Grid.Column>
        </Grid.Row>
        {data ?
          (
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
                {data.map((item) => (
                  <Table.Row key={`${comparisonMenuCategory}-${item.name}:${item.views}`}>
                    <Table.Cell width={10}>{parseName(comparisonMenuCategory, item.name)}</Table.Cell>
                    <Table.Cell width={6}>{item.views}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )
          : <Message info>Search for items using the Dropdown above</Message>}
      </Grid.Column>

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

const PageTrackingComparisonWidgetCon = connect(mapStateToProps)(PageTrackingComparisonWidget);
const PageTrackingComparisonWidgetContainer = withTracker(() => {
  const pageInterestsDailySnapshots: IPageInterestsDailySnapshot[] = PageInterestsDailySnapshots.findNonRetired({});
  return {
    pageInterestsDailySnapshots,
  };
})(PageTrackingComparisonWidgetCon);

export default PageTrackingComparisonWidgetContainer;
