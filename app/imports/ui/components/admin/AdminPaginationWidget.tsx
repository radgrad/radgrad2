import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Grid, Icon, Message } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../../../api/base/BaseCollection';

interface IAdminPaginationWidgetProps {
  collection: BaseCollection;
  dispatch: any;
  pagination: any;
  setShowIndex: (collectionName: string, index: number) => any;
  setShowCount: (collectionName: string, count: number) => any;
}

const mapStateToProps = (state) => {
  return {
    pagination: state.pagination,
  };
};

class AdminPaginationWidget extends React.Component<IAdminPaginationWidgetProps> {
  constructor(props) {
    super(props);
    // console.log('AdminPaginationWidget props=%o', props);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
    const count = props.collection.count();
    const startIndex = props.pagination[props.collection.getCollectionName()].showIndex;
    const endIndex = startIndex + props.pagination[props.collection.getCollectionName()].showCount;
    const label = count < props.pagination[props.collection.getCollectionName()].showCount ? 'Showing all' : `${startIndex} - ${endIndex} of ${count}`;
  }

  private handleFirstClick(event) {
    event.preventDefault();
    // console.log('handleFirstClick(%o) props=%o', event, this.props);
    this.props.dispatch(this.props.setShowIndex(this.props.collection.getCollectionName(), 0));
  }

  private handlePrevClick(event) {
    event.preventDefault();
    // console.log('handlePrevClick(%o) props=%o', event, this.props);
    const showIndex = this.props.pagination[this.props.collection.getCollectionName()].showIndex;
    const showCount = this.props.pagination[this.props.collection.getCollectionName()].showCount;
    this.props.dispatch(this.props.setShowIndex(this.props.collection.getCollectionName(), showIndex - showCount));
  }

  private handleNextClick(event) {
    event.preventDefault();
    // console.log('handleNextClick(%o) props=%o', event, this.props);
    const showIndex = this.props.pagination[this.props.collection.getCollectionName()].showIndex;
    const showCount = this.props.pagination[this.props.collection.getCollectionName()].showCount;
    this.props.dispatch(this.props.setShowIndex(this.props.collection.getCollectionName(), showIndex + showCount));
  }

  private handleLastClick(event) {
    event.preventDefault();
    console.log('handleLastClick(%o) props=%o', event, this.props);
    const count = this.props.collection.count();
    const showCount = this.props.pagination[this.props.collection.getCollectionName()].showCount;
    this.props.dispatch(this.props.setShowIndex(this.props.collection.getCollectionName(), count - showCount));
  }

  private handleCountChange(event) {
    event.preventDefault();
    // console.log('handleCountChange count=%o', event.target.value);
    const count = parseInt(event.target.value, 10);
    this.props.dispatch(this.props.setShowCount(this.props.collection.getCollectionName(), count));
  }

  public render(): React.ReactNode {
    // console.log('AdminPaginationWidget.render props=%o', this.props);
    const heightStyle = {
      height: 48,
    };
    const messageStyle = {
      height: 48,
      marginTop: 0,
      marginRight: '0.25em',
    };
    const options = [
      { key: 1, text: '100', value: 100 },
      { key: 2, text: '50', value: 50 },
      { key: 3, text: '25', value: 25 },
      { key: 4, text: '10', value: 10 },
    ];
    const showCount = this.props.pagination[this.props.collection.getCollectionName()].showCount;
    const count = this.props.collection.count();
    const startIndex = this.props.pagination[this.props.collection.getCollectionName()].showIndex;
    let endIndex = startIndex + this.props.pagination[this.props.collection.getCollectionName()].showCount;
    if (endIndex > count) {
      endIndex = count;
    }
    const label = count <= showCount ? 'Showing all' : `${startIndex + 1} - ${endIndex} of ${count}`;
    const firstDisabled = startIndex < showCount;
    const lastDisabled = (count - startIndex) <= showCount;
    return (
      <Grid.Row centered={true}>
        <Button basic={true} color="green" onClick={this.handleFirstClick}
                style={heightStyle}><Icon
          name="fast backward"/> First</Button>
        <Button basic={true} color="green" disabled={firstDisabled} onClick={this.handlePrevClick}
                style={heightStyle}><Icon
          name="step backward"/> Prev</Button>
        <Message style={messageStyle}>{label}</Message>
        <Button basic={true} color="green" disabled={lastDisabled}
                onClick={this.handleNextClick} style={heightStyle}><Icon
          name="step forward"/> Next</Button>
        <Button basic={true} color="green"
                onClick={this.handleLastClick} style={heightStyle}><Icon
          name="fast forward"/> Last</Button>
        {/*<Dropdown selection={true} options={options} className="jsNum"/>*/}
        <select className="ui dropdown jsNum" style={heightStyle} value={showCount} onChange={this.handleCountChange}>
          <option value={100}>100</option>
          <option value={50}>50</option>
          <option value={25}>25</option>
          <option value={10}>10</option>
        </select>
        <Message style={messageStyle}>Records / Page</Message>
      </Grid.Row>
    );
  }
}

export default connect(mapStateToProps)(AdminPaginationWidget);
