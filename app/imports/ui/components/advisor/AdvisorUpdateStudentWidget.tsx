import * as React from 'react';
import {connect} from 'react-redux';
import {Segment, Button, Image, Grid} from 'semantic-ui-react'

interface IAdvisorUpdateStudentWidgetProps {
  instanceCount: any;
  selectedUsername: string;
}

const mapStateToProps = (state) => ({
  instanceCount: state.page.advisor.home.count,
  selectedUsername: state.page.advisor.home.selectedUsername,
});

class AdvisorUpdateStudentWidget extends React.Component<IAdvisorUpdateStudentWidgetProps> {
  public render() {
    return ( (this.props.selectedUsername === '') ? '' : this.renderUpdateComponent());
  }
  
  public renderUpdateComponent() {
    return (
      <Segment>
        Selected {this.props.selectedUsername}
      </Segment>
    );
  }
}

export default connect(mapStateToProps)(AdvisorUpdateStudentWidget);
