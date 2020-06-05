import React, { useState } from 'react';
import { Dropdown, Grid, Menu, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { RootState } from '../../../redux/types';
import { ICareerGoal, ICourse, IInterest, IOpportunity, IPageInterestsDailySnapshot } from '../../../typings/radgrad';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

interface IPageTrackingComparisonWidgetProps {
  pageInterestsDailySnapshots: IPageInterestsDailySnapshot[];
  comparisonMenuCategory: IPageInterestsCategoryTypes;
}

const mapStateToProps = (state: RootState) => ({
  comparisonMenuCategory: state.shared.pageTracking.comparisonMenuCategory,
});

const PageTrackingComparisonWidget = (props: IPageTrackingComparisonWidgetProps) => {
  const [data, setData] = useState(null);
  const [dataBeforeFilter] = useState(data);
  const [column, setColumn] = useState<'name' | 'views'>(null);
  const [direction, setDirection] = useState<'ascending' | 'descending'>(null);
  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);

  const getOptionsHelper = (docs: (ICareerGoal | ICourse | IInterest | IOpportunity)[]) => docs.map((doc) => ({
    key: doc._id,
    text: doc.name,
    value: doc.name,
  }));

  const getOptions = () => {
    switch (props.comparisonMenuCategory) {
      case PageInterestsCategoryTypes.CAREERGOAL:
        return getOptionsHelper(CareerGoals.find({}).fetch());
      case PageInterestsCategoryTypes.COURSE:
        return getOptionsHelper(Courses.find({}).fetch());
      case PageInterestsCategoryTypes.INTEREST:
        return getOptionsHelper(Interests.find({}).fetch());
      case PageInterestsCategoryTypes.OPPORTUNITY:
        return getOptionsHelper(Opportunities.find({}).fetch());
      default:
        console.error(`Bad comparisonMenuCategory: ${props.comparisonMenuCategory}`);
        return undefined;
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setData(dataBeforeFilter);
  };

  const handleFilter = () => {

  };

  const handleSort = (e, clickedColumn) => {

  };

  const tableBodyScrollStyle = {
    maxHeight: '10px',
    overflowY: 'scroll',
  };

  const searchDropdownOptions = getOptions();

  return (
    <Grid columns={2}>
      <Grid.Column width={11}>
        <Grid.Row>
          <Dropdown placeholder="Search" fluid multiple search selection options={searchDropdownOptions} />
        </Grid.Row>
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
            {/* {data.map((snapshot) => ( */}
            {/*  <Table.Row> */}
            {/*    <Table.Cell /> */}
            {/*    <Table.Cell /> */}
            {/*  </Table.Row> */}
            {/* ))} */}
          </Table.Body>
        </Table>
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
