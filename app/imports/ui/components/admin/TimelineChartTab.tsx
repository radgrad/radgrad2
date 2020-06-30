import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

interface ITimelineChartTabProps {
  startDate?: Date;
  endDate?: Date;
  interactionsByUser: object;
}

const TimelineChartTab = (props: ITimelineChartTabProps) => {
  let chartOptions: object = { title: { text: null } };
  if (props.interactionsByUser) {
    const startDate = moment(props.startDate, 'MMMM D, YYYY');
    const endDate = moment(props.endDate, 'MMMM D, YYYY');
    const numDays = endDate.diff(startDate, 'days') + 1;
    const behaviorsByDate = {};
    _.times(numDays, function (index) {
      const date = moment(startDate).add(index, 'days');
      behaviorsByDate[moment(date).format('MMM D, YYYY')] = [];
    });
    const behaviorList = ['Log In', 'Change Outlook', 'Exploration', 'Planning', 'Verification',
      'Reviewing', 'Mentorship', 'Level Up', 'Complete Plan', 'Profile', 'Favorite Item', 'Unfavorite Item', 'Log Out'];
    _.each(behaviorsByDate, function (array, date, obj) {
      _.each(props.interactionsByUser, function (interactions: any) {
        const interactionsWithinDate = _.filter(interactions, function (interaction) {
          const interactionDate = moment(interaction.timestamp).format('MMM D, YYYY');
          return interactionDate === date;
        });
        if (_.some(interactionsWithinDate, { type: 'login' })) {
          obj[date].push(behaviorList[0]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'careerGoalIDs' || i.type === 'interestIDs'
          || i.type === 'academicPlanID')) {
          obj[date].push(behaviorList[1]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'pageView' && i.typeData[0].includes('explorer/'))) {
          obj[date].push(behaviorList[2]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'addCourse' || i.type === 'removeCourse'
          || i.type === 'addOpportunity' || i.type === 'removeOpportunity')) {
          obj[date].push(behaviorList[3]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'verifyRequest')) {
          obj[date].push(behaviorList[4]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'addReview')) {
          obj[date].push(behaviorList[5]);
        }
        if (_.some(interactionsWithinDate, (i) => (i.type === 'pageView'
          && i.typeData[0].includes('mentor-space')) || i.type === 'askQuestion')) {
          obj[date].push(behaviorList[6]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'level')) {
          obj[date].push(behaviorList[7]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'completePlan')) {
          obj[date].push(behaviorList[8]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'picture' || i.type === 'website')) {
          obj[date].push(behaviorList[9]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'favoriteItem')) {
          obj[date].push(behaviorList[10]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'unFavoriteItem')) {
          obj[date].push(behaviorList[11]);
        }
        if (_.some(interactionsWithinDate, (i) => i.type === 'logout')) {
          obj[date].push(behaviorList[12]);
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
      // console.log(groupedBehaviors);
      _.each(behaviorList, function (behavior) {
        const behaviorCount = groupedBehaviors[behavior];
        const behaviorSeries = _.find(series, { name: behavior });
        if (behaviorCount) {
          behaviorSeries.data.push((behaviorCount.length / StudentProfiles.findNonRetired({ isAlumni: false }).length) * 100);
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
