import * as React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import AdvisorAcademicPlanViewerWidget from './AdvisorAcademicPlanViewerWidget';


const AdvisorAcademicPlanTabs = () => {
  const panes = [
    {
      menuItem: 'Viewer',
      render: () => ( // eslint-disable-line react/display-name
        <Tab.Pane><AdvisorAcademicPlanViewerWidget/></Tab.Pane>
      ),
    },
    {
      menuItem: 'Builder',
      render: () => ( // eslint-disable-line react/display-name
        <Tab.Pane>Plan builder widget</Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded={true}><Tab panes={panes}/></Segment>);
};

export default AdvisorAcademicPlanTabs;
