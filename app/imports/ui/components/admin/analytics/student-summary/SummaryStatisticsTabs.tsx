import moment from 'moment';
import React, { useState } from 'react';
import { Menu, Segment, Tab } from 'semantic-ui-react';
import StudentSummaryTab from './StudentSummaryTab';
import TimelineChartTab from './TimelineChartTab';
import { StudentSummaryBehaviorCategory } from './utilities/student-summary';
import { IAdminAnalyticsUserInteraction } from '../../../../../redux/admin/analytics/reducers';

interface SummaryStatisticsTabsProps {
  startDate?: Date;
  endDate: Date;
  behaviors: StudentSummaryBehaviorCategory[];
  interactionsByUser: IAdminAnalyticsUserInteraction;
}

const SummaryStatisticsTabs: React.FC<SummaryStatisticsTabsProps> = ({ startDate, endDate, behaviors, interactionsByUser }) => {
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
            behaviors={behaviors}
            startDate={startDate ? moment(startDate).format('MM-DD-YYYY') : ''}
            endDate={endDate ? moment(endDate).format('MM-DD-YYYY') : ''}
            interactionsByUser={interactionsByUser}
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
            interactionsByUser={interactionsByUser}
            startDate={startDate}
            endDate={endDate}
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
