import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Menu, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import moment from 'moment';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import {
  ICareerGoal,
  ICourse,
  IInterest, IOpportunity,
  IPageInterestInfo,
  IPageInterestsDailySnapshot,
} from '../../../typings/radgrad';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { RootState } from '../../../redux/types';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

interface IPageTrackingScoreboardWidgetProps {
  pageInterestsDailySnapshots: IPageInterestsDailySnapshot[];
  scoreboardMenuCategory: IPageInterestsCategoryTypes;
}

const mapStateToProps = (state: RootState) => ({
  scoreboardMenuCategory: state.shared.pageTracking.scoreboardMenuCategory,
});

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

interface IAggregatedDailySnapshot {
  careerGoals: IPageInterestInfo[];
  courses: IPageInterestInfo[];
  interests: IPageInterestInfo[];
  opportunities: IPageInterestInfo[];
}

const containsKey = (object: IPageInterestInfo, arr: IPageInterestInfo[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === object.name) {
      return true;
    }
  }
  return false;
};

const aggregateDailySnapshots = (snapshots: IPageInterestsDailySnapshot[]): IAggregatedDailySnapshot => {
  const aggregatedSnapshot: IAggregatedDailySnapshot = {
    careerGoals: [],
    courses: [],
    interests: [],
    opportunities: [],
  };
  // Arrays that contain areas that have already been iterated through for each corresponding topic category
  const foundCareerGoals = [];
  const foundCourses = [];
  const foundInterests = [];
  const foundOpportunities = [];
  snapshots.forEach((snapshot) => {
    // Career Goals
    snapshot.careerGoals.forEach((careerGoal) => {
      const careerGoalInstance: IPageInterestInfo = { name: careerGoal.name, views: careerGoal.views };
      // If we haven't iterated through this career goal, push it to the aggregated snapshot and found career goals.
      if (!containsKey(careerGoal, foundCareerGoals)) {
        foundCareerGoals.push(careerGoalInstance);
        aggregatedSnapshot.careerGoals.push(careerGoalInstance);
        // Otherwise, simply increment the career goal already pushed to the aggregated snapshot with the number of views appropriately
      } else {
        aggregatedSnapshot.careerGoals.filter((cg) => careerGoal.name === cg.name)[0].views += careerGoal.views;
      }
    });
    // Courses
    snapshot.courses.forEach((course) => {
      const courseInstance: IPageInterestInfo = { name: course.name, views: course.views };
      if (!containsKey(course, foundCourses)) {
        foundCourses.push(courseInstance);
        aggregatedSnapshot.courses.push(courseInstance);
      } else {
        aggregatedSnapshot.courses.filter((c) => course.name === c.name)[0].views += course.views;
      }
    });
    // Interests
    snapshot.interests.forEach((interest) => {
      const interestInstance: IPageInterestInfo = { name: interest.name, views: interest.views };
      if (!containsKey(interest, foundInterests)) {
        foundInterests.push(interestInstance);
        aggregatedSnapshot.interests.push(interestInstance);
      } else {
        aggregatedSnapshot.interests.filter((i) => interest.name === i.name)[0].views += interest.views;
      }
    });
    // Opportunities
    snapshot.opportunities.forEach((opportunity) => {
      const opportunityInstance: IPageInterestInfo = { name: opportunity.name, views: opportunity.views };
      if (!containsKey(opportunity, foundOpportunities)) {
        foundOpportunities.push(opportunityInstance);
        aggregatedSnapshot.opportunities.push(opportunityInstance);
      } else {
        aggregatedSnapshot.opportunities.filter((opp) => opportunity.name === opp.name)[0].views += opportunity.views;
      }
    });
  });
  return aggregatedSnapshot;
};

const parseName = (category: IPageInterestsCategoryTypes, slug: string): string => {
  let doc: (ICareerGoal | ICourse | IInterest | IOpportunity);
  switch (category) {
    case PageInterestsCategoryTypes.CAREERGOAL:
      doc = CareerGoals.findDocBySlug(slug);
      break;
    case PageInterestsCategoryTypes.COURSE:
      doc = Courses.findDocBySlug(slug);
      break;
    case PageInterestsCategoryTypes.INTEREST:
      doc = Interests.findDocBySlug(slug);
      break;
    case PageInterestsCategoryTypes.OPPORTUNITY:
      doc = Opportunities.findDocBySlug(slug);
      break;
    default:
      console.error(`Bad category: ${category}`);
      break;
  }
  return doc.name;
};

const PageTrackingScoreboardWidget = (props: IPageTrackingScoreboardWidgetProps) => {
  const { pageInterestsDailySnapshots, scoreboardMenuCategory } = props;
  const aggregatedDailySnapshot: IAggregatedDailySnapshot = aggregateDailySnapshots(pageInterestsDailySnapshots);

  // Scoreboard View
  const [column, setColumn] = useState<'name' | 'views'>(null);
  const [data, setData] = useState<IAggregatedDailySnapshot>(aggregatedDailySnapshot);
  const [dataBeforeFilter] = useState<IAggregatedDailySnapshot>(data);
  const [direction, setDirection] = useState<'ascending' | 'descending'>(null);
  // Filters
  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);

  const tableBodyScrollStyle = {
    maxHeight: '10px',
    overflowY: 'scroll',
  };

  const category = getCategory(scoreboardMenuCategory);

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

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setData(dataBeforeFilter);
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

  return (
    <React.Fragment>
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
              {data[category].map((snapshot, index) => (
                <Table.Row key={`${category}-${snapshot.name}:${snapshot.views}`}>
                  <Table.Cell>{parseName(scoreboardMenuCategory, snapshot.name)}</Table.Cell>
                  <Table.Cell>{snapshot.views}</Table.Cell>
                </Table.Row>
              ))}
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
    </React.Fragment>
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
