import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { IAdminAnalyticsUserInteraction } from '../../../../redux/admin/analytics/reducers';
import { StudentSummaryBehaviorTypes } from './admin-analytics-student-summary-helper-functions';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';
import { IUserInteraction } from '../../../../typings/radgrad';

interface ITimelineChartTabProps {
  startDate?: Date;
  endDate?: Date;
  interactionsByUser: IAdminAnalyticsUserInteraction;
}

const TimelineChartTab = (props: ITimelineChartTabProps) => {
  let chartOptions: object = { title: { text: null } };
  if (props.interactionsByUser) {
    const startDate = moment(props.startDate, 'MMMM D, YYYY');
    const endDate = moment(props.endDate, 'MMMM D, YYYY');
    const numDays = endDate.diff(startDate, 'days') + 1;
    const behaviorsByDate: { [key: string]: string[] } = {};
    _.times(numDays, function (index) {
      const date = moment(startDate).add(index, 'days');
      behaviorsByDate[moment(date).format('MMM D, YYYY')] = [];
    });
    const behaviorList = [
      StudentSummaryBehaviorTypes.LOGIN,
      StudentSummaryBehaviorTypes.OUTLOOK,
      StudentSummaryBehaviorTypes.EXPLORATION,
      StudentSummaryBehaviorTypes.PLANNING,
      StudentSummaryBehaviorTypes.VERIFICATION,
      StudentSummaryBehaviorTypes.REVIEWING,
      StudentSummaryBehaviorTypes.LEVEL,
      StudentSummaryBehaviorTypes.COMPLETEPLAN,
      StudentSummaryBehaviorTypes.PROFILE,
      StudentSummaryBehaviorTypes.FAVORITE,
      StudentSummaryBehaviorTypes.UNFAVORITE,
      StudentSummaryBehaviorTypes.LOGOUT,
    ];
    _.each(behaviorsByDate, function (array, date, obj) {
      _.each(props.interactionsByUser, function (interactions: IUserInteraction[]) {
        const interactionsWithinDate: IUserInteraction[] = _.filter(interactions, function (interaction) {
          const interactionDate = moment(interaction.timestamp).format('MMM D, YYYY');
          return interactionDate === date;
        });
        if (_.some(interactionsWithinDate, { type: UserInteractionsTypes.LOGIN })) {
          obj[date].push(behaviorList[0]);
        }
        // FIXME careerGoalIDs, interestIDs, and academicPlanID is now deprecated. Change this to use favorites instead
        if (_.some(interactionsWithinDate, (i) => i.type === 'careerGoalIDs' || i.type === 'interestIDs'
          || i.type === 'academicPlanID')) {
          obj[date].push(behaviorList[1]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.PAGEVIEW && i.typeData[0].includes(`${EXPLORER_TYPE.HOME}/`))) {
          obj[date].push(behaviorList[2]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.ADDCOURSE
          || i.type === UserInteractionsTypes.REMOVECOURSE
          || i.type === UserInteractionsTypes.UPDATECOURSE
          || i.type === UserInteractionsTypes.ADDOPPORTUNITY
          || i.type === UserInteractionsTypes.REMOVEOPPORTUNITY
          || i.type === UserInteractionsTypes.UPDATEOPPORTUNITY)) {
          obj[date].push(behaviorList[3]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.VERIFYREQUEST)) {
          obj[date].push(behaviorList[4]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.ADDREVIEW)) {
          obj[date].push(behaviorList[5]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.LEVEL)) {
          obj[date].push(behaviorList[6]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.COMPLETEPLAN)) {
          obj[date].push(behaviorList[7]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.PICTURE || i.type === UserInteractionsTypes.WEBSITE)) {
          obj[date].push(behaviorList[8]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.FAVORITEITEM)) {
          obj[date].push(behaviorList[9]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.UNFAVORITEITEM)) {
          obj[date].push(behaviorList[10]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.LOGOUT)) {
          obj[date].push(behaviorList[11]);
        }
      });
    });
    // console.log(behaviorsByDate);
    const categories = _.map(behaviorsByDate, function (behaviors, date) {
      const shortDate = date.substring(0, date.length - 6);
      return shortDate;
    });
    const series = _.map(behaviorList, function (behavior) {
      return { name: behavior, data: [] };
    });
    _.each(behaviorsByDate, function (behaviors) {
      const groupedBehaviors = _.groupBy(behaviors);
      _.each(behaviorList, function (behavior) {
        const behaviorCount = groupedBehaviors[behavior];
        const behaviorSeries = _.find(series, { name: behavior });
        if (behaviorCount) {
          behaviorSeries.data.push((behaviorCount.length / StudentProfiles.find({ isAlumni: false }).fetch().length) * 100);
        } else {
          behaviorSeries.data.push(0);
        }
      });
    });
    chartOptions = {
      title: { text: null },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      xAxis: {
        categories,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percent Number Of Students',
        },
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      series,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        }],
      },
      credits: {
        enabled: false,
      },
    };
  }
  return (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  );
};

export default TimelineChartTab;
