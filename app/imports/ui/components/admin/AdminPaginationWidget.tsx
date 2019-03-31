import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Icon, Message } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../../../api/base/BaseCollection';

interface IAdminPaginationWidgetProps {
  collection: BaseCollection;
  setShowIndex: (index) => any;
  setShowCount: (count) => any;
}

interface IAdminPaginationWidgetState {
  firstDisabled: boolean;
  label: string;
  lastDisabled: boolean;
}

const mapStateToProps = (state) => {
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShowIndex: (index) => dispatch()
  };
};

class AdminPaginationWidget extends React.Component<{}, IAdminPaginationWidgetState> {
  constructor(props) {
    super(props);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
  }

  private handleFirstClick(event) {
    event.preventDefault();
    console.log('handleFirstClick(%o)', event);
  }

  private handlePrevClick(event) {
    event.preventDefault();
    console.log('handlePrevClick(%o)', event);
  }

  private handleNextClick(event) {
    event.preventDefault();
    console.log('handleNextClick(%o)', event);
  }

  private handleLastClick(event) {
    event.preventDefault();
    console.log('handleLastClick(%o)', event);
  }

  public render(): React.ReactNode {
    return (
      <Grid.Row>
        <Button basic={true} color="green" disabled={this.state.firstDisabled} onClick={this.handleFirstClick}><Icon
          name="fast backward"/> First</Button>
        <Button basic={true} color="green" disabled={this.state.firstDisabled} onClick={this.handlePrevClick}><Icon
          name="step backward"/> Prev</Button>
        <Message>{this.state.label}</Message>
        <Button basic={true} color="green" disabled={this.state.lastDisabled} onClick={this.handleNextClick}> Next</Button>
        <Button basic={true} color="green" disabled={this.state.lastDisabled} onClick={this.handleLastClick}> Last</Button>
      </Grid.Row>
    );
  }
}
