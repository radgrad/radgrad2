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

interface ISummaryStatisticsTabsState {
  activeIndex: number;
}

// const SummaryStatisticsTabs = (props: ISummaryStatisticsTabsProps) => {
class SummaryStatisticsTabs extends React.Component<ISummaryStatisticsTabsProps, ISummaryStatisticsTabsState> {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  public render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const panes = [
      {
        menuItem: (
          <Menu.Item key="Behaviors" onClick={this.handleClick} active={this.state.activeIndex === 0}>
            Student Summary
          </Menu.Item>
        ),
        pane: (
          <Tab.Pane key="summaryTabPane" active={this.state.activeIndex === 0}>
            <StudentSummaryTab
              behaviors={this.props.behaviors}
              startDate={this.props.startDate ? moment(this.props.startDate).format('MM-DD-YYYY') : ''}
              endDate={this.props.endDate ? moment(this.props.endDate).format('MM-DD-YYYY') : ''}
              interactionsByUser={this.props.interactionsByUser}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: (
          <Menu.Item key="timeline" onClick={this.handleClick} active={this.state.activeIndex === 1}>
            Timeline Chart
          </Menu.Item>
        ),
        pane: (
          <Tab.Pane key="timelineTab" active={this.state.activeIndex === 1}>
            <TimelineChartTab interactionsByUser={this.props.interactionsByUser} startDate={this.props.startDate} endDate={this.props.endDate} key="timeline-chart-tab-pane" />
          </Tab.Pane>
        ),
      },
    ];
    return (
      <Segment>
        <Tab panes={panes} defaultActiveIndex={0} renderActiveOnly={false} />
      </Segment>
    );

  }

};

export default SummaryStatisticsTabs;
