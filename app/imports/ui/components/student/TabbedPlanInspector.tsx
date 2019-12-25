import React from 'react';
import { connect } from 'react-redux';
import { Segment, Tab } from 'semantic-ui-react';
import CourseOpportunityInspectorWidgetContainer from './CourseOpportunityInspectorWidget';
import AcademicPlanViewerContainer from './AcademicPlanViewer';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { SELECT_PLAN } from '../../../redux/student/degree-planner/types';

interface ITabbedPlanInspectorProps {
  selectedTab: string;
  selectInspectorTab: () => any;
  selectPlanTab: () => any;
}

const mapStateToProps = (state) => ({
  selectedTab: state.student.degreePlanner.tab.selectedTab,
});

const mapDispatchToProps = (dispatch) => ({
  selectPlanTab: () => dispatch(degreePlannerActions.selectPlanTab()),
  selectInspectorTab: () => dispatch(degreePlannerActions.selectInspectorTab()),
});

const handleTabChange = (props: ITabbedPlanInspectorProps) => (e, { activeIndex }) => {
  e.preventDefault();
  console.log(`handleTabChange ${activeIndex}`);
  switch (activeIndex) {
    case 0:
      props.selectPlanTab();
      break;
    case 1:
      props.selectInspectorTab();
      break;
    default:
      console.error(`Bad tab index ${activeIndex}`);
  }
};


const TabbedPlanInspector = (props: ITabbedPlanInspectorProps) => {
  const activeIndex = props.selectedTab === SELECT_PLAN ? 0 : 1;
  // console.log('TabbedPlanInspector.render props=%o, activeIndex=%o', props, activeIndex);
  const panes = [
    {
      menuItem: 'ACADEMIC PLAN',
      pane: (
        <Tab.Pane key="plan" active={activeIndex === 0}>
          <AcademicPlanViewerContainer/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'INSPECTOR',
      pane: (
        <Tab.Pane key="inspector" active={activeIndex === 1}>
          <CourseOpportunityInspectorWidgetContainer/>
        </Tab.Pane>
      ),
    },
  ];
  // console.log(`TabbedPlanInspector activeIndex=${activeIndex}`);
  return (
    <Segment padded={true}>
      <Tab panes={panes} renderActiveOnly={false} onTabChange={handleTabChange(props)} activeIndex={activeIndex}/>
    </Segment>
  );
};

const TabbedPlanInspectorContainer = connect(mapStateToProps, mapDispatchToProps)(TabbedPlanInspector);
export default TabbedPlanInspectorContainer;
