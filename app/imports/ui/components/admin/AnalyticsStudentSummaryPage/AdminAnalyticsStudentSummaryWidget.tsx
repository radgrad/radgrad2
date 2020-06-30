import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Segment, Header } from 'semantic-ui-react';
import { ANALYTICS, EXPLORER_TYPE, MENTOR_SPACE } from '../../../../startup/client/route-constants';
import AdminAnalyticsDateSelectionWidget from '../AdminAnalyticsDateSelectionWidget';
import SummaryStatisticsTabs from './SummaryStatisticsTabs';
import { behaviorCategories } from './admin-analytics-student-summary-helper-functions';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { RootState } from '../../../../redux/types';
import { IAdminAnalyticsDateRange, IAdminAnalyticsUserInteraction } from '../../../../redux/admin/analytics/reducers';

interface IAdminAnalyticsStudentSummaryWidgetProps {
  dateRange: IAdminAnalyticsDateRange;
  userInteractions: IAdminAnalyticsUserInteraction;
}

const mapStateToProps = (state: RootState) => ({
  dateRange: state.admin.analytics.studentSummary.dateRange,
  userInteractions: state.admin.analytics.studentSummary.userInteractions,
});

const dateRangeString = (dateRange: IAdminAnalyticsDateRange): string | JSX.Element => {
  if (dateRange.startDate && dateRange.endDate) {
    const start = moment(dateRange.startDate).format('MM-DD-YYYY');
    const end = moment(dateRange.endDate).format('MM-DD-YYYY');
    return ` ${start} to ${end}`;
  }
  return <i>Select a Start date and an End date above</i>;
};

const AdminAnalyticsStudentSummaryWidget = (props: IAdminAnalyticsStudentSummaryWidgetProps) => {
  const dateRangeStr = dateRangeString(props.dateRange);
  const interactionsByUser = props.userInteractions;

  _.each(interactionsByUser, function (interactions, user) {
    if (_.some(interactions, { type: UserInteractionsTypes.LOGIN })) {
      behaviorCategories[0].count++;
      behaviorCategories[0].users.push(user);
    }
    // FIXME careerGoalIDs, interestIDs, and academicPlanID is now deprecated. Change this to use favorites instead
    if (_.some(interactions, (i: any) => i.type === 'careerGoalIDs' || i.type === 'interestIDs'
      || i.type === 'academicPlanID')) {
      behaviorCategories[1].count++;
      behaviorCategories[1].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.PAGEVIEW && i.typeData[0].includes(`${EXPLORER_TYPE.HOME}/`))) {
      behaviorCategories[2].count++;
      behaviorCategories[2].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.ADDCOURSE
      || i.type === UserInteractionsTypes.REMOVECOURSE
      || i.type === UserInteractionsTypes.UPDATECOURSE
      || i.type === UserInteractionsTypes.ADDOPPORTUNITY
      || i.type === UserInteractionsTypes.REMOVEOPPORTUNITY
      || i.type === UserInteractionsTypes.UPDATEOPPORTUNITY)) {
      behaviorCategories[3].count++;
      behaviorCategories[3].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.VERIFYREQUEST)) {
      behaviorCategories[4].count++;
      behaviorCategories[4].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.ADDREVIEW)) {
      behaviorCategories[5].count++;
      behaviorCategories[5].users.push(user);
    }
    if (_.some(interactions, (i: any) => (i.type === UserInteractionsTypes.PAGEVIEW && i.typeData[0].includes(MENTOR_SPACE))
      || i.type === UserInteractionsTypes.ASKQUESTION)) {
      behaviorCategories[6].count++;
      behaviorCategories[6].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.LEVEL)) {
      behaviorCategories[7].count++;
      behaviorCategories[7].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.COMPLETEPLAN)) {
      behaviorCategories[8].count++;
      behaviorCategories[8].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.PICTURE || i.type === UserInteractionsTypes.WEBSITE)) {
      behaviorCategories[9].count++;
      behaviorCategories[9].users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.FAVORITEITEM })) {
      behaviorCategories[10].count++;
      behaviorCategories[10].users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.UNFAVORITEITEM })) {
      behaviorCategories[11].count++;
      behaviorCategories[11].users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.LOGOUT })) {
      behaviorCategories[12].count++;
      behaviorCategories[12].users.push(user);
    }
  });
  return (
    <div>
      <AdminAnalyticsDateSelectionWidget page={ANALYTICS.STUDENTSUMMARY} />
      <Segment>
        <Header as="h4" dividing>
          SUMMARY STATISTICS: {dateRangeStr}
        </Header>
        <SummaryStatisticsTabs
          behaviors={behaviorCategories}
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
