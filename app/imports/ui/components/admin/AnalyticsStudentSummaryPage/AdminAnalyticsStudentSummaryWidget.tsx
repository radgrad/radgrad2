import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Segment, Header } from 'semantic-ui-react';
import { ANALYTICS } from '../../../../startup/client/route-constants';
import AdminAnalyticsDateSelectionWidget from '../AdminAnalyticsDateSelectionWidget';
import SummaryStatisticsTabs from './SummaryStatisticsTabs';
import { IBehavior, IDateRange } from '../../../../typings/radgrad';

interface IAdminAnalyticsStudentSummaryWidgetProps {
  dateRange: IDateRange;
  userInteractions: _.Dictionary<any[]>;
}

const mapStateToProps = (state) => ({
  dateRange: state.admin.analytics.studentSummary.dateRange,
  userInteractions: state.admin.analytics.studentSummary.userInteractions,
});

const dateRangeString = (dateRange: IDateRange): string => {
  if (dateRange) {
    const start = moment(dateRange.startDate).format('MM-DD-YYYY');
    const end = moment(dateRange.endDate).format('MM-DD-YYYY');
    return ` ${start} to ${end}`;
  }
  return '';
};

const AdminAnalyticsStudentSummaryWidget = (props: IAdminAnalyticsStudentSummaryWidgetProps) => {
  const dateRangeStr = dateRangeString(props.dateRange);
  const interactionsByUser = props.userInteractions;
  const behaviors: IBehavior[] = [
    {
      type: 'Log In', count: 0, users: [], description: 'Logged into application',
    },
    {
      type: 'Change Outlook', count: 0, users: [], description: 'Updated interests, career goals, or degree',
    },
    {
      type: 'Exploration', count: 0, users: [], description: 'Viewed entries in Explorer',
    },
    {
      type: 'Planning', count: 0, users: [], description: 'Added or removed course/opportunity',
    },
    {
      type: 'Verification', count: 0, users: [], description: 'Requested verification',
    },
    {
      type: 'Reviewing', count: 0, users: [], description: 'Reviewed a course',
    },
    {
      type: 'Mentorship', count: 0, users: [], description: 'Visited the MentorSpace page or asked a question',
    },
    {
      type: 'Level Up', count: 0, users: [], description: 'Leveled up',
    },
    {
      type: 'Complete Plan', count: 0, users: [], description: 'Created a plan with 100 ICE',
    },
    {
      type: 'Profile', count: 0, users: [], description: 'Updated personal image or website url',
    },
    {
      type: 'Favorite Item', count: 0, users: [], description: 'Favorited an item',
    },
    {
      type: 'Unfavorite Item', count: 0, users: [], description: 'Unfavorited an item',
    },
    {
      type: 'Log Out', count: 0, users: [], description: 'Logged out',
    }];
  _.each(interactionsByUser, function (interactions, user) {
    if (_.some(interactions, { type: 'login' })) {
      behaviors[0].count++;
      behaviors[0].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'careerGoalIDs' || i.type === 'interestIDs'
      || i.type === 'academicPlanID')) {
      behaviors[1].count++;
      behaviors[1].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'pageView' && i.typeData[0].includes('explorer/'))) {
      behaviors[2].count++;
      behaviors[2].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'addCourse' || i.type === 'removeCourse'
      || i.type === 'addOpportunity' || i.type === 'removeOpportunity')) {
      behaviors[3].count++;
      behaviors[3].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'verifyRequest')) {
      behaviors[4].count++;
      behaviors[4].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'addReview')) {
      behaviors[5].count++;
      behaviors[5].users.push(user);
    }
    if (_.some(interactions, (i: any) => (i.type === 'pageView' && i.typeData[0].includes('mentor-space'))
      || i.type === 'askQuestion')) {
      behaviors[6].count++;
      behaviors[6].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'level')) {
      behaviors[7].count++;
      behaviors[7].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'completePlan')) {
      behaviors[8].count++;
      behaviors[8].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === 'picture' || i.type === 'website')) {
      behaviors[9].count++;
      behaviors[9].users.push(user);
    }
    if (_.some(interactions, { type: 'favoriteItem' })) {
      behaviors[10].count++;
      behaviors[10].users.push(user);
    }
    if (_.some(interactions, { type: 'unFavoriteItem' })) {
      behaviors[11].count++;
      behaviors[11].users.push(user);
    }
    if (_.some(interactions, { type: 'logout' })) {
      behaviors[12].count++;
      behaviors[12].users.push(user);
    }
  });
  return (
    <div>
      <AdminAnalyticsDateSelectionWidget page={ANALYTICS.STUDENTSUMMARY} />
      <Segment>
        <Header as="h4" dividing>
          SUMMARY STATISTICS:
          {dateRangeStr}
        </Header>
        <SummaryStatisticsTabs
          behaviors={behaviors}
          startDate={props.dateRange.startDate}
          endDate={props.dateRange.endDate}
          interactionsByUser={interactionsByUser}
        />
      </Segment>
    </div>
  );
};

const AdminAnalyticsStudentSummaryWidgetCon = connect(mapStateToProps)(AdminAnalyticsStudentSummaryWidget);
export default withRouter(AdminAnalyticsStudentSummaryWidgetCon);
