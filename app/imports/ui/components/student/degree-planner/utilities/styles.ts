const grid = 2;

const getDraggablePillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
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

const getInspectorDraggablePillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
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

const getDroppableListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? '#348C72' : 'white',
  padding: grid,
  width: '100%',
});

const getSatisfiedStyle = (): React.CSSProperties => ({
  color: '#348C72',
});

const getNotSatisfiedStyle = (): React.CSSProperties => ({
  color: '#FF0000',
});

export {
  getDraggablePillStyle,
  getInspectorDraggablePillStyle,
  getDroppableListStyle,
  getNotSatisfiedStyle,
  getSatisfiedStyle,
};
