import * as React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import { DragDropContext } from 'react-beautiful-dnd';
import AdvisorAcademicPlanViewerWidget from './AdvisorAcademicPlanViewerWidget';
import AdvisorAcademicPlanBuilderWidget from './AdvisorAcademicPlanBuilderWidget';

const onDragEnd = (result) => {
  console.log(result);
  if (!result.destination) {
    return null;
  }
  return 'hi';
};

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
        <Tab.Pane><AdvisorAcademicPlanBuilderWidget/></Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded={true}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Tab panes={panes}/>
      </DragDropContext>
    </Segment>);
};

export default AdvisorAcademicPlanTabs;
