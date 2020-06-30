import moment from 'moment';
import React, { useState } from 'react';
import { Menu, Segment, Tab } from 'semantic-ui-react';
import StudentSummaryTab from './StudentSummaryTab';
import TimelineChartTab from './TimelineChartTab';
import { IStudentSummaryBehaviorCategory } from './admin-analytics-student-summary-helper-functions';

interface ISummaryStatisticsTabsProps {
  startDate?: Date;
  endDate: Date;
  behaviors: IStudentSummaryBehaviorCategory[];
  interactionsByUser: object;
}

const SummaryStatisticsTabs = (props: ISummaryStatisticsTabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const panes = [
    {
      menuItem: (
        <Menu.Item key="Behaviors" onClick={handleClick} active={activeIndex === 0}>
          Student Summary
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane key="summaryTabPane" active={activeIndex === 0}>
          <StudentSummaryTab
            behaviors={props.behaviors}
            startDate={props.startDate ? moment(props.startDate).format('MM-DD-YYYY') : ''}
            endDate={props.endDate ? moment(props.endDate).format('MM-DD-YYYY') : ''}
            interactionsByUser={props.interactionsByUser}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="timeline" onClick={handleClick} active={activeIndex === 1}>
          Timeline Chart
        </Menu.Item>
      ),
      pane: (
        <Tab.Pane key="timelineTab" active={activeIndex === 1}>
          <TimelineChartTab
            interactionsByUser={props.interactionsByUser}
            startDate={props.startDate}
            endDate={props.endDate}
            key="timeline-chart-tab-pane"
          />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment>
      <Tab panes={panes} defaultActiveIndex={0} renderActiveOnly={false} />
    </Segment>
  );
};

export default SummaryStatisticsTabs;
