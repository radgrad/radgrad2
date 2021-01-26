import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Icon, Message } from 'semantic-ui-react';
import BaseCollection from '../../../../api/base/BaseCollection';
import { RootState } from '../../../../redux/types';

interface AdminPaginationWidgetProps {
  collection: BaseCollection;
  dispatch: any;
  pagination: any;
  setShowIndex: (collectionName: string, index: number) => any;
  setShowCount: (collectionName: string, count: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  pagination: state.admin.dataModel.pagination,
});

const handleFirstClick = (dispatch, setShowIndex: (collectionName: string, index: number) => any, collection: BaseCollection) => (event) => {
  event.preventDefault();
  // console.log('handleFirstClick(%o) props=%o', event, props);
  dispatch(setShowIndex(collection.getCollectionName(), 0));
};

const handlePrevClick = (pagination, collection, dispatch, setShowIndex) => (event) => {
  event.preventDefault();
  // console.log('handlePrevClick(%o) props=%o', event, props);
  const showIndex = pagination[collection.getCollectionName()].showIndex;
  const showCount = pagination[collection.getCollectionName()].showCount;
  dispatch(setShowIndex(collection.getCollectionName(), showIndex - showCount));
};

const handleNextClick = (pagination, collection, dispatch, setShowIndex) => (event) => {
  event.preventDefault();
  // console.log('handleNextClick(%o) props=%o', event, props);
  const showIndex = pagination[collection.getCollectionName()].showIndex;
  const showCount = pagination[collection.getCollectionName()].showCount;
  dispatch(setShowIndex(collection.getCollectionName(), showIndex + showCount));
};

const handleLastClick = (collection, pagination, dispatch, setShowIndex) => (event) => {
  event.preventDefault();
  // console.log('handleLastClick(%o) props=%o', event, props);
  const count = collection.count();
  const showCount = pagination[collection.getCollectionName()].showCount;
  dispatch(setShowIndex(collection.getCollectionName(), count - showCount));
};

const handleCountChange = (dispatch, setShowCount, collection) => (event) => {
  event.preventDefault();
  // console.log('handleCountChange count=%o', event.target.value);
  const count = parseInt(event.target.value, 10);
  dispatch(setShowCount(collection.getCollectionName(), count));
};

const AdminPaginationWidget: React.FC<AdminPaginationWidgetProps> = ({ pagination, dispatch, collection, setShowCount, setShowIndex }) => {
  // console.log('AdminPaginationWidget.render props=%o', props);
  const heightStyle = {
    height: 48,
  };
  const messageStyle = {
    height: 48,
    marginTop: 0,
    marginRight: '0.25em',
  };
  const showCount = pagination[collection.getCollectionName()].showCount;
  const count = collection.count();
  const startIndex = pagination[collection.getCollectionName()].showIndex;
  let endIndex = startIndex + pagination[collection.getCollectionName()].showCount;
  if (endIndex > count) {
    endIndex = count;
  }
  const label = count <= showCount ? 'Showing all' : `${startIndex + 1} - ${endIndex} of ${count}`;
  const firstDisabled = startIndex < showCount;
  const lastDisabled = count - startIndex <= showCount;
  return (
    <Grid.Row centered>
      <Button basic color="green" onClick={handleFirstClick(dispatch, setShowIndex, collection)} style={heightStyle}>
        <Icon name="fast backward" /> First
      </Button>
      <Button basic color="green" disabled={firstDisabled} onClick={handlePrevClick(pagination, collection, dispatch, setShowIndex)} style={heightStyle}>
        <Icon name="step backward" /> Prev
      </Button>
      <Message style={messageStyle}>{label}</Message>
      <Button basic color="green" disabled={lastDisabled} onClick={handleNextClick(pagination, collection, dispatch, setShowIndex)} style={heightStyle}>
        <Icon name="step forward" /> Next
      </Button>
      <Button basic color="green" onClick={handleLastClick(collection, pagination, dispatch, setShowIndex)} style={heightStyle}>
        <Icon name="fast forward" /> Last
      </Button>
      {/* <Dropdown selection={true} options={options} className="jsNum"/> */}
      <select className="ui dropdown jsNum" style={heightStyle} value={showCount} onChange={handleCountChange(dispatch, setShowCount, collection)}>
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
