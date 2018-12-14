import * as React from 'react';
import { connect } from 'react-redux';

interface ITabbedPlanInspectorProps {
  selectedCourseID: string;
  selectedCourseInstanceID: string;
  selectedOpportunityID: string;
  selectedOpportunityInstanceID: string;
}

const mapStateToProps = (state) => {
  return {
    selectedCourseID: state.selectedCourseID,
    selectedCourseInstanceID: state.selectedCourseInstanceID,
    selectedOpportunityID: state.selectedOpportunityID,
    selectedOpportunityInstanceID: state.selectedOpportunityInstanceID,
  };
};

class ConnectedTabbedPlanInspector extends React.Component<ITabbedPlanInspectorProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        Selected Course ID: {this.props.selectedCourseID}<br/>
        Selected Course Instance ID: {this.props.selectedCourseInstanceID}<br/>
        Selected Opportunity ID: {this.props.selectedOpportunityID}<br/>
        Selected Opportunity Instance ID: {this.props.selectedOpportunityInstanceID}
      </div>);
  }
}

const TabbedPlanInspector = connect(mapStateToProps)(ConnectedTabbedPlanInspector);

export default TabbedPlanInspector;
