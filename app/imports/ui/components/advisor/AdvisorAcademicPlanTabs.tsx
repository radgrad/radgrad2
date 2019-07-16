import * as React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
import AdvisorAcademicPlanViewerWidget from './AdvisorAcademicPlanViewerWidget';
import AdvisorAPBuilderWidget from './AdvisorAPBuilderWidget';

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
        <Tab.Pane><AdvisorAPBuilderWidget/></Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded={true}>
      <Tab panes={panes}/>
    </Segment>);
};

export default AdvisorAcademicPlanTabs;
