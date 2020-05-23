import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, Grid, Menu, Radio, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { withTracker } from 'meteor/react-meteor-data';
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
      if (foundCareerGoals.indexOf(careerGoal.name) === -1) {
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
      if (foundCourses.indexOf(course.name) === -1) {
        foundCourses.push(courseInstance);
        aggregatedSnapshot.courses.push(courseInstance);
      } else {
        aggregatedSnapshot.courses.filter((c) => course.name === c.name)[0].views += course.views;
      }
    });
    // Interests
    snapshot.interests.forEach((interest) => {
      const interestInstance: IPageInterestInfo = { name: interest.name, views: interest.views };
      if (foundInterests.indexOf(interest.name) === -1) {
        foundInterests.push(interestInstance);
        aggregatedSnapshot.interests.push(interestInstance);
      } else {
        aggregatedSnapshot.interests.filter((i) => interest.name === i.name)[0].views += interest.views;
      }
    });
    // Opportunities
    snapshot.opportunities.forEach((opportunity) => {
      const opportunityInstance: IPageInterestInfo = { name: opportunity.name, views: opportunity.views };
      if (foundOpportunities.indexOf(opportunity.name) === -1) {
        foundOpportunities.push(opportunityInstance);
        aggregatedSnapshot.opportunities.push(opportunityInstance);
      } else {
        aggregatedSnapshot.opportunities.filter((opp) => opportunity.name === opp.name)[0].views += opportunity.views;
      }
    });
  });
  return aggregatedSnapshot;
};

const PageTrackingScoreboardWidget = (props: IPageTrackingScoreboardWidgetProps) => {
  const { pageInterestsDailySnapshots, scoreboardMenuCategory } = props;
  const [column, setColumn] = useState(null);
  const [data, setData] = useState(null);
  const [direction, setDirection] = useState(null);

  const tableBodyScrollStyle = {
    maxHeight: '10px',
    overflowY: 'scroll',
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

  const category = getCategory(scoreboardMenuCategory);
  const aggregatedDailySnapshot: IAggregatedDailySnapshot = aggregateDailySnapshots(pageInterestsDailySnapshots);

  const handleSort = (e, clickedColumn) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      aggregatedDailySnapshot[category] = _.sortBy(aggregatedDailySnapshot[category], [clickedColumn]);
      setData(aggregatedDailySnapshot);
      setDirection('ascending');
      return;
    }

    // Create new data by first creating a slice of data[category] so we do not mutate state directly,
    // and then reverse that slice. Then rebuild a new data object by combining old data with the new reversed data.
    const newData = { ...data, [category]: data[category].slice().reverse() };
    setData(newData);
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };

  const items = data === null ? aggregatedDailySnapshot : data;

  return (
    <React.Fragment>
      <Grid columns={2}>
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
              {items[category].map((snapshot, index) => (
                <Table.Row key={`${category}-${snapshot.name}:${snapshot.views}`}>
                  <Table.Cell>{parseName(scoreboardMenuCategory, snapshot.name)}</Table.Cell>
                  <Table.Cell>{snapshot.views}</Table.Cell>
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
  const pageInterestsDailySnapshots: IPageInterestsDailySnapshot[] = PageInterestsDailySnapshots.findNonRetired({});
  return {
    pageInterestsDailySnapshots,
  };
})(PageTrackingScoreboardWidgetCon);

export default PageTrackingScoreboardWidgetContainer;
