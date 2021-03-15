import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { IAdminAnalyticsUserInteraction } from '../../../../../redux/admin/analytics/reducers';
import { StudentSummaryBehaviorTypes } from './utilities/student-summary';
import { UserInteractionsTypes } from '../../../../../api/analytic/UserInteractionsTypes';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { UserInteraction } from '../../../../../typings/radgrad';

interface TimelineChartTabProps {
  startDate?: Date;
  endDate?: Date;
  interactionsByUser: IAdminAnalyticsUserInteraction;
}

const TimelineChartTab: React.FC<TimelineChartTabProps> = ({ startDate, endDate, interactionsByUser }) => {
  let chartOptions: { [key: string]: unknown } = { title: { text: null } };
  if (interactionsByUser) {
    const startDataMoment = moment(startDate, 'MMMM D, YYYY');
    const endDateMoment = moment(endDate, 'MMMM D, YYYY');
    const numDays = endDateMoment.diff(startDataMoment, 'days') + 1;
    const behaviorsByDate: { [key: string]: string[] } = {};
    _.times(numDays, (index) => {
      const date = moment(startDataMoment).add(index, 'days');
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
      StudentSummaryBehaviorTypes.COMPLETE_PLAN,
      StudentSummaryBehaviorTypes.PROFILE,
      StudentSummaryBehaviorTypes.ADD_TO_PROFILE,
      StudentSummaryBehaviorTypes.REMOVE_FROM_PROFILE,
      StudentSummaryBehaviorTypes.LOGOUT,
    ];
    _.each(behaviorsByDate, (array, date, obj) => {
      _.each(interactionsByUser, (interactions: UserInteraction[]) => {
        const interactionsWithinDate: UserInteraction[] = interactions.filter((interaction) => {
          const interactionDate = moment(interaction.timestamp).format('MMM D, YYYY');
          return interactionDate === date;
        });
        if (_.some(interactionsWithinDate, { type: UserInteractionsTypes.LOGIN })) {
          obj[date].push(behaviorList[0]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === PROFILE_ENTRY_TYPE.CAREERGOAL || i.type === PROFILE_ENTRY_TYPE.INTEREST)) {
          obj[date].push(behaviorList[1]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.PAGE_VIEW && i.typeData[0].includes(`${EXPLORER_TYPE.HOME}/`))) {
          obj[date].push(behaviorList[2]);
        }
        if (
          _.some(
            interactionsWithinDate,
            (i) =>
              i.type === UserInteractionsTypes.ADD_COURSE ||
              i.type === UserInteractionsTypes.REMOVE_COURSE ||
              i.type === UserInteractionsTypes.UPDATE_COURSE ||
              i.type === UserInteractionsTypes.ADD_OPPORTUNITY ||
              i.type === UserInteractionsTypes.REMOVE_OPPORTUNITY ||
              i.type === UserInteractionsTypes.UPDATE_OPPORTUNITY,
          )
        ) {
          obj[date].push(behaviorList[3]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.VERIFY_REQUEST)) {
          obj[date].push(behaviorList[4]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.ADD_REVIEW)) {
          obj[date].push(behaviorList[5]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.LEVEL)) {
          obj[date].push(behaviorList[6]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.COMPLETE_PLAN)) {
          obj[date].push(behaviorList[7]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.PICTURE || i.type === UserInteractionsTypes.WEBSITE)) {
          obj[date].push(behaviorList[8]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.ADD_TO_PROFILE)) {
          obj[date].push(behaviorList[9]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.REMOVE_FROM_PROFILE)) {
          obj[date].push(behaviorList[10]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === UserInteractionsTypes.LOGOUT)) {
          obj[date].push(behaviorList[11]);
        }
      });
    });
    // console.log(behaviorsByDate);
    const categories = _.map(behaviorsByDate, (behaviors, date) => {
      const shortDate = date.substring(0, date.length - 6);
      return shortDate;
    });
    const series = _.map(behaviorList, (behavior) => ({ name: behavior, data: [] }));
    _.each(behaviorsByDate, (behaviors) => {
      const groupedBehaviors = _.groupBy(behaviors);
      _.each(behaviorList, (behavior) => {
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
        rules: [
          {
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
          },
        ],
      },
      credits: {
        enabled: false,
      },
    };
  }
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default TimelineChartTab;
