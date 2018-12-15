import * as React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import CourseOpportunityInspectorWidgetContainer from './CourseOpportunityInspectorWidget';

const TabbedPlanInspector = () => {
  const panes = [
    {
      menuItem: 'ACADEMIC PLAN',
      pane: (
        <Tab.Pane key="plan">
          Academic Plan
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'INSPECTOR',
      pane: (
        <Tab.Pane key="inspector">
          <CourseOpportunityInspectorWidgetContainer/>
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded={true}>
      <Tab panes={panes} renderActiveOnly={false}/>
    </Segment>
  );
};
export default TabbedPlanInspector;
