import moment from 'moment';
import React from 'react';
import { Menu, Segment, Tab } from 'semantic-ui-react';
import StudentSummaryTab from './StudentSummaryTab';
import { IBehavior } from '../../../typings/radgrad';
import TimelineChartTab from './TimelineChartTab';

interface ISummaryStatisticsTabsProps {
  startDate?: Date;
  endDate: Date;
  behaviors: IBehavior[];
  interactionsByUser: object;
}

const SummaryStatisticsTabs = (props: ISummaryStatisticsTabsProps) => {
  const panes = [
    {
      menuItem: (
        <Menu.Item key="Behaviors">
          Student Summary
        </Menu.Item>
      ),
      pane: (
        <StudentSummaryTab behaviors={props.behaviors}
                           startDate={props.startDate ? moment(props.startDate).format('MM-DD-YYYY') : ''}
                           endDate={props.endDate ? moment(props.endDate).format('MM-DD-YYYY') : ''}
                           interactionsByUser={props.interactionsByUser} key="summaryTab" />
      ),
    },
    {
      menuItem: 'Timeline Chart',
      pane: (
        <Tab.Pane key="timeline-chart-tab-pane">
          <TimelineChartTab interactionsByUser={props.interactionsByUser} />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment>
      <Tab panes={panes} renderActiveOnly={false} />
    </Segment>
  );
};

export default SummaryStatisticsTabs;
