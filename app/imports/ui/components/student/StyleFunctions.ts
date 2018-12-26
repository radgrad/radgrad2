const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: '#348C72',
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#F2F2F2',
  borderStyle: 'solid',
  borderRadius: 1,
  borderColor: isDragging ? 'lightgreen' : '#F2F2F2',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getInspectorViewItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: '#348C72',
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#F2F2F2',
  borderStyle: 'solid',
  borderRadius: 1,
  borderColor: isDragging ? 'lightgreen' : '#F2F2F2',
  width: '50%',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#348C72' : 'white',
  padding: grid,
  width: '100%',
});

export { getItemStyle, getInspectorViewItemStyle, getListStyle };
