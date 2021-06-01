import React from 'react';
import { Card, Menu, Tab } from 'semantic-ui-react';
import { HomePageProps } from '../../utilities/HomePageProps';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import RadGradTabHeader from './RadGradTabHeader';

const HomePageChecklistSegment: React.FC<HomePageProps> = ({ okItems, reviewItems, improveItems }) => {
  const improveTabHeader = <RadGradTabHeader title={`High Priority (${improveItems.length})`} icon='exclamation circle' />;
  const reviewTabHeader = <RadGradTabHeader title={`Medium Priority (${reviewItems.length})`} icon='question circle' />;
  const okTabHeader = <RadGradTabHeader title={`Completed (${okItems.length})`} icon='check circle' />;

  const improvePane = {
    menuItem: <Menu.Item key='improveTab'>{improveTabHeader}</Menu.Item>,
    render: () => (
      <Tab.Pane key='ImprovePane'>
        <Card.Group style={{ marginTop: '0px' }}>
          {improveItems}
        </Card.Group>
      </Tab.Pane>
    ),
  };

  const reviewPane = {
    menuItem: <Menu.Item key='reviewTab'>{reviewTabHeader}</Menu.Item>,
    render: () => (
      <Tab.Pane key='ReviewPane'>
        <Card.Group style={{ marginTop: '0px' }}>
          {reviewItems}
        </Card.Group>
      </Tab.Pane>
    ),
  };

  const okPane = {
    menuItem: <Menu.Item key='okTab'>{okTabHeader}</Menu.Item>,
    render: () => (
      <Tab.Pane key='OKPane'>
        <Card.Group style={{ marginTop: '0px' }}>
          {okItems}
        </Card.Group>
      </Tab.Pane>
    ),
  };

  let activeIndex = 0;
  if ((improveItems.length === 0) && (reviewItems.length > 0)) {
    activeIndex = 1;
  } else if ((improveItems.length === 0) && (reviewItems.length === 0)) {
    activeIndex = 2;
  }

  const header = <RadGradHeader title='Your Personal To Do List' />;
  return (
    <RadGradSegment header={header}>
      <Tab panes={[improvePane, reviewPane, okPane]} defaultActiveIndex={activeIndex} />
    </RadGradSegment>
  );
};

export default HomePageChecklistSegment;
