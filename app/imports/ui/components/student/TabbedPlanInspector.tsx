import * as React from 'react';
import { Grid, Tab } from 'semantic-ui-react';
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
    <Tab panes={panes} renderActiveOnly={false}/>
  );
};
export default TabbedPlanInspector;
