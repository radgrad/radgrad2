import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Icon, Message } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../../../api/base/BaseCollection';

interface IAdminPaginationWidgetProps {
  collection: BaseCollection;
  dispatch: any;
  pagination: any;
  setShowIndex: (index) => any;
}

interface IAdminPaginationWidgetState {
  firstDisabled: boolean;
  label: string;
  lastDisabled: boolean;
}

const mapStateToProps = (state) => {
  return {
    pagination: state.pagination,
  };
};

class AdminPaginationWidget extends React.Component<{}, IAdminPaginationWidgetState> {
  constructor(props) {
    super(props);
    console.log('AdminPaginationWidget props=%o', props);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    const count = props.collection.count();
    const startIndex = props.pagination[props.collection.getCollectionName()].showIndex;
    const endIndex = startIndex + props.pagination[props.collection.getCollectionName()].showCount;
    const label = count < props.pagination[props.collection.getCollectionName()].showCount ? 'Showing all' : `${startIndex} - ${endIndex} of ${count}`;
    this.state = {
      firstDisabled: true,
      label,
      lastDisabled: false,
    };
  }

  private handleFirstClick(event) {
    event.preventDefault();
    console.log('handleFirstClick(%o) props=%o', event, this.props);
  }

  private handlePrevClick(event) {
    event.preventDefault();
    console.log('handlePrevClick(%o) props=%o', event, this.props);
  }

  private handleNextClick(event) {
    event.preventDefault();
    console.log('handleNextClick(%o) props=%o', event, this.props);
  }

  private handleLastClick(event) {
    event.preventDefault();
    console.log('handleLastClick(%o) props=%o', event, this.props);
  }

  public render(): React.ReactNode {
    return (
      <Grid.Row centered={true}>
        <Button basic={true} color="green" disabled={this.state.firstDisabled} onClick={this.handleFirstClick}><Icon
          name="fast backward"/> First</Button>
        <Button basic={true} color="green" disabled={this.state.firstDisabled} onClick={this.handlePrevClick}><Icon
          name="step backward"/> Prev</Button>
        <Message>{this.state.label}</Message>
        <Button basic={true} color="green" disabled={this.state.lastDisabled}
                onClick={this.handleNextClick}><Icon
          name="step forward"/> Next</Button>
        <Button basic={true} color="green" disabled={this.state.lastDisabled}
                onClick={this.handleLastClick}><Icon
          name="fast forward"/> Last</Button>
      </Grid.Row>
    );
  }
}

export default connect(mapStateToProps)(AdminPaginationWidget);
