import React, { useState } from 'react';
import { Dropdown, Grid, Table, Button, Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import { IPageInterestsCategoryTypes, PageInterestsCategoryTypes } from '../../../../api/page-tracking/PageInterestsCategoryTypes';
import { CareerGoal, Course, Interest, Opportunity, PageInterestInfo, PageInterestsDailySnapshot } from '../../../../typings/radgrad';
import { PageInterestsDailySnapshots } from '../../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { aggregateDailySnapshots, getCategory, getUrlCategory, AggregatedDailySnapshot, parseName, slugIDToSlugName } from './utilities/page-tracking';
import PageTrackingWidgetMessage from './PageTrackingWidgetMessage';
import RadGradAlert from "../../../app/imports/ui/utilities/RadGradAlert";

interface PageTrackingComparisonWidgetProps {
  pageInterestsDailySnapshots: PageInterestsDailySnapshot[];
}
const getOptions = (urlCategory: IPageInterestsCategoryTypes) => {
  switch (urlCategory) {
    case PageInterestsCategoryTypes.CAREERGOAL:
      return getOptionsHelper(CareerGoals.findNonRetired({}));
    case PageInterestsCategoryTypes.COURSE:
      return getOptionsHelper(Courses.findNonRetired({}));
    case PageInterestsCategoryTypes.INTEREST:
      return getOptionsHelper(Interests.findNonRetired({}));
    case PageInterestsCategoryTypes.OPPORTUNITY:
      return getOptionsHelper(Opportunities.findNonRetired({}));
    default:
      console.error(`Bad category: ${urlCategory}`);
      return undefined;
  }
};

const getOptionsHelper = (docs: (CareerGoal | Course | Interest | Opportunity)[]) =>
  docs.map((doc) => ({
    key: doc._id,
    text: doc.name,
    value: doc.slugID,
  }));

const PageTrackingComparisonWidget: React.FC<PageTrackingComparisonWidgetProps> = ({ pageInterestsDailySnapshots }) => {
  const match = useRouteMatch();
  const urlCategory: IPageInterestsCategoryTypes = getUrlCategory(match);

  const [data, setData] = useState<PageInterestInfo[]>(undefined);
  const [dataBeforeFilter, setDataBeforeFilter] = useState<PageInterestInfo[]>(undefined);

  /* ######################### Table State ######################### */
  const [selectedOptions, setSelectedOptions] = useState<string[]>(undefined);
  const [column, setColumn] = useState<'name' | 'views'>(undefined);
  const [direction, setDirection] = useState<'ascending' | 'descending'>(undefined);

  /* ######################### Date Picker State ######################### */
  const [startDate, setStartDate] = useState<Date>(undefined);
  const [endDate, setEndDate] = useState<Date>(undefined);

  /* ######################### Styles ######################### */
  const tableStyle: React.CSSProperties = { maxHeight: '400px', overflowY: 'auto', marginTop: '5px' };
  const marginBottomStyle: React.CSSProperties = { marginBottom: '5px' };

  /* ######################### Event Handlers ######################### */
  const setItemsToData = (event: React.SyntheticEvent, filtered: boolean) => {
    event.preventDefault();
    const category: string = getCategory(urlCategory);
    let aggregatedSnapshot: PageInterestInfo[] | AggregatedDailySnapshot;
    if (filtered) {
      const filteredDailySnapshots: PageInterestsDailySnapshot[] = PageInterestsDailySnapshots.find({
        timestamp: {
          $gte: startDate,
          $lte: moment(endDate).endOf('day').toDate(),
        },
      }).fetch();
      aggregatedSnapshot = aggregateDailySnapshots(filteredDailySnapshots);
    } else {
      aggregatedSnapshot = aggregateDailySnapshots(pageInterestsDailySnapshots);
    }
    const snapshotItems: PageInterestInfo[] = aggregatedSnapshot[category];
    const selectedSlugNames: string[] = [];
    selectedOptions.forEach((option) => {
      const slugName = slugIDToSlugName(option);
      selectedSlugNames.push(slugName);
    });
    const filteredItems: PageInterestInfo[] = [];
    selectedSlugNames.forEach((slugName) => {
      snapshotItems.forEach((item) => {
        if (slugName === item.name) {
          filteredItems.push(item);
        }
      });
    });
    // Handle sort to main sort properties (ascending/descending for a clicked column) when we filter data
    if (column !== undefined) {
      const sortedFilteredItems: PageInterestInfo[] = _.sortBy(filteredItems, [column]);
      setData(sortedFilteredItems);
    } else {
      setData(filteredItems);
    }
    if (!filtered) {
      setDataBeforeFilter(filteredItems);
    }
  };

  const handleChange = (event: React.SyntheticEvent, { value }): void => {
    event.preventDefault();
    setSelectedOptions(value);
  };

  const handleSort = (event, clickedColumn: 'name' | 'views'): void => {
    event.preventDefault();
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      const newData: PageInterestInfo[] = _.sortBy(data, [clickedColumn]);
      setData(newData);
      setDirection('ascending');
      return;
    }
    const newData: PageInterestInfo[] = data.slice().reverse();
    setData(newData);
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };

  const handleFilter = (event: React.SyntheticEvent): void => {
    if (startDate === undefined || endDate === undefined) {
      RadGradAlert.failure('Date Selection Required', 'A Start and End Date selection is required.');
      return;
    }
    setItemsToData(event, true);
  };

  const handleClear = (): void => {
    setStartDate(undefined);
    setEndDate(undefined);
    setData(dataBeforeFilter);
  };

  return (
    <Grid columns={2}>
      <Grid.Column width={11}>
        {/* Search Dropdown */}
        <Grid.Row>
          <Grid.Column>
            <Dropdown placeholder="Search" onChange={handleChange} fluid multiple search selection options={getOptions(urlCategory)} />
          </Grid.Column>
        </Grid.Row>
        {/* Table View */}
        {data ? (
          <>
            <div style={tableStyle}>
              <Table celled striped sortable style={tableStyle}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell sorted={column === 'name' ? direction : undefined} onClick={(e) => handleSort(e, 'name')}>
                      Name
                    </Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'views' ? direction : undefined} onClick={(e) => handleSort(e, 'views')}>
                      Page Views
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {/* TODO Show items that have 0 views */}
                  {data.map((item) => (
                    <Table.Row key={`${urlCategory}-${item.name}:${item.views}`}>
                      <Table.Cell width={10}>{parseName(urlCategory, item.name)}</Table.Cell>
                      <Table.Cell width={6}>{item.views}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <PageTrackingWidgetMessage />
          </>
        ) : undefined}
      </Grid.Column>

      <Grid.Column width={5}>
        {/* Search Button */}
        <Grid.Row>
          <Button onClick={(e) => setItemsToData(e, false)}>Search</Button>
        </Grid.Row>
        {/* Date Filter */}
        <Header>FILTER BY DATE</Header>
        <Grid.Row style={marginBottomStyle}>
          <Button size="mini" onClick={handleFilter}>
            Filter
          </Button>
          <Button size="mini" onClick={handleClear}>
            Clear
          </Button>
        </Grid.Row>
        <Grid.Row>
          <DatePicker selectsStart showMonthDropdown showYearDropdown onChange={(date) => setStartDate(date)} placeholderText="Start Date" selected={startDate} startDate={startDate} endDate={endDate} maxDate={endDate || new Date()} />
          <DatePicker selectsEnd showMonthDropdown showYearDropdown onChange={(date) => setEndDate(date)} placeholderText="End Date" selected={endDate} startDate={startDate} endDate={endDate} minDate={startDate} maxDate={new Date()} />
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default PageTrackingComparisonWidget;
