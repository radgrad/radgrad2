import * as React from 'react';
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

class TabbedPlanInspector extends React.Component<ITabbedPlanInspectorProps> {
  constructor(props) {
    super(props);
  }

  private handleTabChange = (e, { activeIndex }) => {
    e.preventDefault();
    console.log(`handleTabChange ${activeIndex}`);
    switch (activeIndex) {
      case 0:
        this.props.selectPlanTab();
        break;
      case 1:
        this.props.selectInspectorTab();
        break;
      default:
        console.error(`Bad tab index ${activeIndex}`);
    }
  }

  public render() {
    const activeIndex = this.props.selectedTab === SELECT_PLAN ? 0 : 1;
    // console.log('TabbedPlanInspector.render props=%o, activeIndex=%o', this.props, activeIndex);
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
        <Tab panes={panes} renderActiveOnly={false} onTabChange={this.handleTabChange} activeIndex={activeIndex}/>
      </Segment>
    );
  }
}

const TabbedPlanInspectorContainer = connect(mapStateToProps, mapDispatchToProps)(TabbedPlanInspector);
export default TabbedPlanInspectorContainer;
