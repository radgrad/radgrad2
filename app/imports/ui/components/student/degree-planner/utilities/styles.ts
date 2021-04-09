import { COLORS } from '../../../../utilities/Colors';

const grid = 2;

const getDraggablePillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: COLORS.GREEN3,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : COLORS.GREY2,
  borderStyle: 'solid',
  borderRadius: 1,
  borderColor: isDragging ? 'lightgreen' : COLORS.GREY2,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getInspectorDraggablePillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: COLORS.GREEN3,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : COLORS.GREY2,
  borderStyle: 'solid',
  borderRadius: 1,
  borderColor: isDragging ? 'lightgreen' : COLORS.GREY2,
  width: '50%',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getDroppableListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? COLORS.GREEN3 : COLORS.WHITE,
  padding: grid,
  width: '100%',
});

const getSatisfiedStyle = (): React.CSSProperties => ({
  color: COLORS.GREEN3,
});

const getNotSatisfiedStyle = (): React.CSSProperties => ({
  color: COLORS.RED,
});

const cardStyle = {
  marginTop: 5,
  marginBottom: 5,
};
const contentStyle = {
  paddingTop: 2,
  paddingBottom: 2,
};

export {
  getDraggablePillStyle,
  getInspectorDraggablePillStyle,
  getDroppableListStyle,
  getNotSatisfiedStyle,
  getSatisfiedStyle,
  cardStyle,
  contentStyle,
};
