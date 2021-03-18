import React from 'react';
import { connect } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import { RootState } from '../../../../../redux/types';
import { IAdminAnalyticsOverheadAnalysisBuckets } from '../../../../../redux/admin/analytics/reducers';

interface OverallServerLoadWidgetProps {
  overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets;
}

const mapStateToProps = (state: RootState): { [key: string]: any } => ({
  overheadBuckets: state.admin.analytics.overheadAnalysis.overheadBuckets,
});

const createChartOptions = (overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets) => {
  // CAM have to leave _.map since overheadBuckets isn't an array
  const buckets = _.map(overheadBuckets, (value, index: number) => {
    const minRange = index * 10;
    const maxRange = minRange + 9;
    return `${minRange}-${maxRange}`;
  });
  // CAM have to leave _.map since overheadBuckets isn't an array
  const data = _.map(overheadBuckets, (value) => value);
  return {
    chart: { type: 'column' },
    title: { text: null },
    colors: ['rgb(79, 168, 143, 0.80)'],
    legend: { enabled: false },
    xAxis: {
      title: {
        text: 'Number of Documents Per Minute',
        style: {
          color: '#000',
        },
      },
      categories: buckets,
    },
    yAxis: {
      title: {
        text: 'Occurrence',
        style: {
          color: '#000',
        },
      },
      min: 0,
    },
    tooltip: {
      headerFormat: '<span style="font-size: 12px">Docs/Min: <b>{point.key}</b></span><br/>',
      pointFormat: '<span style="font-size: 12px">Occurrence: <b>{point.y}</b></span><br/>',
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
    },
    series: [{ data: data }],
    credits: {
      enabled: false,
    },
  };
};

const OverallServerLoadWidget: React.FC<OverallServerLoadWidgetProps> = ({ overheadBuckets }) => {
  const chartOptions = createChartOptions(overheadBuckets);
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default connect(mapStateToProps, null)(OverallServerLoadWidget);
