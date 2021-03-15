import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Segment, Header } from 'semantic-ui-react';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { ANALYTICS, EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import AdminAnalyticsDateSelectionWidget from '../AdminAnalyticsDateSelectionWidget';
import SummaryStatisticsTabs from './SummaryStatisticsTabs';
import { behaviorCategories } from './utilities/student-summary';
import { UserInteractionsTypes } from '../../../../../api/analytic/UserInteractionsTypes';
import { RootState } from '../../../../../redux/types';
import { AdminAnalyticsDateRange, IAdminAnalyticsUserInteraction } from '../../../../../redux/admin/analytics/reducers';

interface AdminAnalyticsStudentSummaryProps {
  dateRange: AdminAnalyticsDateRange;
  userInteractions: IAdminAnalyticsUserInteraction;
}

const mapStateToProps = (state: RootState): { [key: string]: any } => ({
  dateRange: state.admin.analytics.studentSummary.dateRange,
  userInteractions: state.admin.analytics.studentSummary.userInteractions,
});

const dateRangeToString = (dateRange: AdminAnalyticsDateRange): string | JSX.Element => {
  if (dateRange.startDate && dateRange.endDate) {
    const start = moment(dateRange.startDate).format('MM-DD-YYYY');
    const end = moment(dateRange.endDate).format('MM-DD-YYYY');
    return ` ${start} to ${end}`;
  }
  return <i>Select a Start date and End date above</i>;
};

const AdminAnalyticsStudentSummary: React.FC<AdminAnalyticsStudentSummaryProps> = ({ dateRange, userInteractions }) => {
  const interactionsByUser = userInteractions;

  _.each(interactionsByUser, (interactions, user) => {
    if (_.some(interactions, { type: UserInteractionsTypes.LOGIN })) {
      behaviorCategories.LOGIN.count++;
      behaviorCategories.LOGIN.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === PROFILE_ENTRY_TYPE.CAREERGOAL || i.type === PROFILE_ENTRY_TYPE.INTEREST)) {
      behaviorCategories.OUTLOOK.count++;
      behaviorCategories.OUTLOOK.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.PAGE_VIEW && i.typeData[0].includes(`${EXPLORER_TYPE.HOME}/`))) {
      behaviorCategories.EXPLORATION.count++;
      behaviorCategories.EXPLORATION.users.push(user);
    }
    if (
      _.some(
        interactions,
        (i: any) =>
          i.type === UserInteractionsTypes.ADD_COURSE ||
          i.type === UserInteractionsTypes.REMOVE_COURSE ||
          i.type === UserInteractionsTypes.UPDATE_COURSE ||
          i.type === UserInteractionsTypes.ADD_OPPORTUNITY ||
          i.type === UserInteractionsTypes.REMOVE_OPPORTUNITY ||
          i.type === UserInteractionsTypes.UPDATE_OPPORTUNITY,
      )
    ) {
      behaviorCategories.PLANNING.count++;
      behaviorCategories.PLANNING.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.VERIFY_REQUEST)) {
      behaviorCategories.VERIFICATION.count++;
      behaviorCategories.VERIFICATION.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.ADD_REVIEW)) {
      behaviorCategories.REVIEWING.count++;
      behaviorCategories.REVIEWING.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.LEVEL)) {
      behaviorCategories.LEVEL.count++;
      behaviorCategories.LEVEL.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.COMPLETE_PLAN)) {
      behaviorCategories.COMPLETE_PLAN.count++;
      behaviorCategories.COMPLETE_PLAN.users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.PICTURE || i.type === UserInteractionsTypes.WEBSITE)) {
      behaviorCategories.PROFILE.count++;
      behaviorCategories.PROFILE.users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.ADD_TO_PROFILE })) {
      behaviorCategories.ADD_TO_PROFILE.count++;
      behaviorCategories.ADD_TO_PROFILE.users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.REMOVE_FROM_PROFILE })) {
      behaviorCategories.REMOVE_FROM_PROFILE.count++;
      behaviorCategories.REMOVE_FROM_PROFILE.users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.LOGOUT })) {
      behaviorCategories.LOGOUT.count++;
      behaviorCategories.LOGOUT.users.push(user);
    }
  });
  return (
    <div>
      <AdminAnalyticsDateSelectionWidget page={ANALYTICS.STUDENT_SUMMARY} />
      <Segment>
        <Header as="h4" dividing>
          SUMMARY STATISTICS: {dateRangeToString(dateRange)}
        </Header>
        <SummaryStatisticsTabs behaviors={behaviorCategories} startDate={dateRange.startDate} endDate={dateRange.endDate} interactionsByUser={interactionsByUser} />
      </Segment>
    </div>
  );
};

const AdminAnalyticsStudentSummaryWidgetContainer = connect(mapStateToProps)(AdminAnalyticsStudentSummary);
export default AdminAnalyticsStudentSummaryWidgetContainer;
