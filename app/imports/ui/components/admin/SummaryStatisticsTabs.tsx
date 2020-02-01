import React from 'react';
import { Menu, Segment, Tab } from 'semantic-ui-react';
import { IBehavior } from './AdminAnalyticsStudentSummaryWidget';
import StudentSummaryTab from './StudentSummaryTab';

interface ISummaryStatisticsTabsProps {
  startDate: string;
  endDate: string;
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
        <StudentSummaryTab behaviors={props.behaviors} startDate={props.startDate} endDate={props.endDate} interactionsByUser={props.interactionsByUser} key="summaryTab" />
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
