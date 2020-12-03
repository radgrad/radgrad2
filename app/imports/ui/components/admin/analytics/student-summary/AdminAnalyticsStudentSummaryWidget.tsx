import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Segment, Header } from 'semantic-ui-react';
import { FAVORITE_TYPE } from '../../../../../api/favorite/FavoriteTypes';
import { ANALYTICS, EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import AdminAnalyticsDateSelectionWidget from '../AdminAnalyticsDateSelectionWidget';
import SummaryStatisticsTabs from './SummaryStatisticsTabs';
import { behaviorCategories } from './utilities/student-summary';
import { UserInteractionsTypes } from '../../../../../api/analytic/UserInteractionsTypes';
import { RootState } from '../../../../../redux/types';
import { IAdminAnalyticsDateRange, IAdminAnalyticsUserInteraction } from '../../../../../redux/admin/analytics/reducers';

interface IAdminAnalyticsStudentSummaryWidgetProps {
  dateRange: IAdminAnalyticsDateRange;
  userInteractions: IAdminAnalyticsUserInteraction;
}

const mapStateToProps = (state: RootState): {[key: string]: any} => ({
  dateRange: state.admin.analytics.studentSummary.dateRange,
  userInteractions: state.admin.analytics.studentSummary.userInteractions,
});

const dateRangeToString = (dateRange: IAdminAnalyticsDateRange): string | JSX.Element => {
  if (dateRange.startDate && dateRange.endDate) {
    const start = moment(dateRange.startDate).format('MM-DD-YYYY');
    const end = moment(dateRange.endDate).format('MM-DD-YYYY');
    return ` ${start} to ${end}`;
  }
  return <i>Select a Start date and End date above</i>;
};

const AdminAnalyticsStudentSummaryWidget = (props: IAdminAnalyticsStudentSummaryWidgetProps) => {
  const interactionsByUser = props.userInteractions;

  _.each(interactionsByUser, function (interactions, user) {
    if (_.some(interactions, { type: UserInteractionsTypes.LOGIN })) {
      behaviorCategories[0].count++;
      behaviorCategories[0].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === FAVORITE_TYPE.CAREERGOAL || i.type === FAVORITE_TYPE.INTEREST
      || i.type === FAVORITE_TYPE.ACADEMICPLAN)) {
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
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.LEVEL)) {
      behaviorCategories[6].count++;
      behaviorCategories[6].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.COMPLETEPLAN)) {
      behaviorCategories[7].count++;
      behaviorCategories[7].users.push(user);
    }
    if (_.some(interactions, (i: any) => i.type === UserInteractionsTypes.PICTURE || i.type === UserInteractionsTypes.WEBSITE)) {
      behaviorCategories[8].count++;
      behaviorCategories[8].users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.FAVORITEITEM })) {
      behaviorCategories[9].count++;
      behaviorCategories[9].users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.UNFAVORITEITEM })) {
      behaviorCategories[10].count++;
      behaviorCategories[10].users.push(user);
    }
    if (_.some(interactions, { type: UserInteractionsTypes.LOGOUT })) {
      behaviorCategories[11].count++;
      behaviorCategories[11].users.push(user);
    }
  });
  return (
    <div>
      <AdminAnalyticsDateSelectionWidget page={ANALYTICS.STUDENTSUMMARY} />
      <Segment>
        <Header as="h4" dividing>
          SUMMARY STATISTICS: {dateRangeToString(props.dateRange)}
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

const AdminAnalyticsStudentSummaryWidgetContainer = connect(mapStateToProps)(AdminAnalyticsStudentSummaryWidget);
export default AdminAnalyticsStudentSummaryWidgetContainer;
