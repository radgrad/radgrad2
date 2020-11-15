import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Icon, Message } from 'semantic-ui-react';
import BaseCollection from '../../../../api/base/BaseCollection';
import { RootState } from '../../../../redux/types';

interface IAdminPaginationWidgetProps {
  collection: BaseCollection;
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: any;
  pagination: any;
  // eslint-disable-next-line react/no-unused-prop-types
  setShowIndex: (collectionName: string, index: number) => any;
  // eslint-disable-next-line react/no-unused-prop-types
  setShowCount: (collectionName: string, count: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  pagination: state.admin.dataModel.pagination,
});

const handleFirstClick = (props: IAdminPaginationWidgetProps) => (event) => {
  event.preventDefault();
  // console.log('handleFirstClick(%o) props=%o', event, props);
  props.dispatch(props.setShowIndex(props.collection.getCollectionName(), 0));
};

const handlePrevClick = (props: IAdminPaginationWidgetProps) => (event) => {
  event.preventDefault();
  // console.log('handlePrevClick(%o) props=%o', event, props);
  const showIndex = props.pagination[props.collection.getCollectionName()].showIndex;
  const showCount = props.pagination[props.collection.getCollectionName()].showCount;
  props.dispatch(props.setShowIndex(props.collection.getCollectionName(), showIndex - showCount));
};

const handleNextClick = (props: IAdminPaginationWidgetProps) => (event) => {
  event.preventDefault();
  // console.log('handleNextClick(%o) props=%o', event, props);
  const showIndex = props.pagination[props.collection.getCollectionName()].showIndex;
  const showCount = props.pagination[props.collection.getCollectionName()].showCount;
  props.dispatch(props.setShowIndex(props.collection.getCollectionName(), showIndex + showCount));
};

const handleLastClick = (props: IAdminPaginationWidgetProps) => (event) => {
  event.preventDefault();
  // console.log('handleLastClick(%o) props=%o', event, props);
  const count = props.collection.count();
  const showCount = props.pagination[props.collection.getCollectionName()].showCount;
  props.dispatch(props.setShowIndex(props.collection.getCollectionName(), count - showCount));
};

const handleCountChange = (props: IAdminPaginationWidgetProps) => (event) => {
  event.preventDefault();
  // console.log('handleCountChange count=%o', event.target.value);
  const count = parseInt(event.target.value, 10);
  props.dispatch(props.setShowCount(props.collection.getCollectionName(), count));
};

const AdminPaginationWidget = (props: IAdminPaginationWidgetProps) => {
  // console.log('AdminPaginationWidget.render props=%o', props);
  const heightStyle = {
    height: 48,
  };
  const messageStyle = {
    height: 48,
    marginTop: 0,
    marginRight: '0.25em',
  };
  const showCount = props.pagination[props.collection.getCollectionName()].showCount;
  const count = props.collection.count();
  const startIndex = props.pagination[props.collection.getCollectionName()].showIndex;
  let endIndex = startIndex + props.pagination[props.collection.getCollectionName()].showCount;
  if (endIndex > count) {
    endIndex = count;
  }
  const label = count <= showCount ? 'Showing all' : `${startIndex + 1} - ${endIndex} of ${count}`;
  const firstDisabled = startIndex < showCount;
  const lastDisabled = (count - startIndex) <= showCount;
  return (
    <Grid.Row centered>
      <Button
        basic
        color="green"
        onClick={handleFirstClick(props)}
        style={heightStyle}
      >
        <Icon
          name="fast backward"
        /> First
      </Button>
      <Button
        basic
        color="green"
        disabled={firstDisabled}
        onClick={handlePrevClick(props)}
        style={heightStyle}
      >
        <Icon name="step backward" /> Prev
      </Button>
      <Message style={messageStyle}>{label}</Message>
      <Button
        basic
        color="green"
        disabled={lastDisabled}
        onClick={handleNextClick(props)}
        style={heightStyle}
      >
        <Icon name="step forward" /> Next
      </Button>
      <Button
        basic
        color="green"
        onClick={handleLastClick(props)}
        style={heightStyle}
      >
        <Icon name="fast forward" /> Last
      </Button>
      {/* <Dropdown selection={true} options={options} className="jsNum"/> */}
      <select className="ui dropdown jsNum" style={heightStyle} value={showCount} onChange={handleCountChange(props)}>
        <option value={100}>100</option>
        <option value={50}>50</option>
        <option value={25}>25</option>
        <option value={10}>10</option>
      </select>
      <Message style={messageStyle}>Records / Page</Message>
    </Grid.Row>
  );
};

export default connect(mapStateToProps)(AdminPaginationWidget);
