import React from 'react';
import { Button, Grid, Icon, Message } from 'semantic-ui-react';
import BaseCollection from '../../../../api/base/BaseCollection';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import { useStickyState } from '../../../utilities/StickyState';

interface AdminPaginationWidgetProps {
  collection: BaseCollection;
}

const AdminPaginationWidget: React.FC<AdminPaginationWidgetProps> = ({ collection }) => {
  // console.log('AdminPaginationWidget.render props=%o', props);
  const heightStyle = { height: 48 };
  const messageStyle = { height: 48, marginTop: 0, marginRight: '0.25em' };
  const collectionName = collection.getCollectionName();
  const [startIndex, setStartIndex] = useStickyState(`Pagination.${collectionName}.index`, 0);
  const [showCount, setShowCount] = useStickyState(`Pagination.${collectionName}.count`, 25);
  const count = collection.count();
  let endIndex = startIndex + showCount;
  if (endIndex > count) {
    endIndex = count;
  }
  const label = count <= showCount ? 'Showing all' : `${startIndex + 1} - ${endIndex} of ${count}`;
  const firstDisabled = startIndex < showCount;
  const lastDisabled = count - startIndex <= showCount;

  const handleFirstClick = (event) => { event.preventDefault(); setStartIndex(0); };
  const handlePrevClick = (event) => { event.preventDefault(); setStartIndex(startIndex - showCount); };
  const handleNextClick = (event) => { event.preventDefault(); setStartIndex(startIndex + showCount); };
  const handleLastClick = (event) => { event.preventDefault(); setStartIndex(count - showCount); };
  const handleCountChange = (event) => {event.preventDefault(); setShowCount(parseInt(event.target.value, 10)); };

  return (
    <Grid.Row centered>
      <Button basic color="green" onClick={handleFirstClick} style={heightStyle}>
        <Icon name="fast backward" /> First
      </Button>
      <Button basic color="green" disabled={firstDisabled} onClick={handlePrevClick} style={heightStyle}>
        <Icon name="step backward" /> Prev
      </Button>
      <Message style={messageStyle}>{label}</Message>
      <Button basic color="green" disabled={lastDisabled} onClick={handleNextClick} style={heightStyle}>
        <Icon name="step forward" /> Next
      </Button>
      <Button id={COMPONENTIDS.DATA_MODEL_PAGINATION_LAST} basic color="green" onClick={handleLastClick} style={heightStyle}>
        <Icon name="fast forward" /> Last
      </Button>
      {/* <Dropdown selection={true} options={options} className="jsNum"/> */}
      <select className="ui dropdown jsNum" style={heightStyle} value={showCount} onChange={handleCountChange}>
        <option value={100}>100</option>
        <option value={50}>50</option>
        <option value={25}>25</option>
        <option value={10}>10</option>
      </select>
      <Message style={messageStyle}>Records / Page</Message>
    </Grid.Row>
  );
};

export default AdminPaginationWidget;
