import { COLORS } from '../../../../utilities/Colors';

enum DraggableColors {
  COURSE = COLORS.NAVY,
  OPPORTUNITY = COLORS.GREEN,
  INTERNSHIP = COLORS.PURPLE,
}

const grid = 2;

const getDraggableOpportunityPillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: COLORS.GREEN3,
  // change background colour if dragging
  background: COLORS.GREEN,
  borderStyle: 'solid',
  borderRadius: 12,
  borderColor: isDragging ? COLORS.BLACK : COLORS.GREEN,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getDraggableCoursePillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: COLORS.NAVY,
  // change background colour if dragging
  background: COLORS.NAVY,
  borderStyle: 'solid',
  borderRadius: 12,
  borderColor: isDragging ? COLORS.BLACK : COLORS.NAVY,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getDraggableInternshipPillStyle = (isDragging: boolean, draggableStyle: React.CSSProperties): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  color: COLORS.PURPLE,
  // change background colour if dragging
  background: COLORS.PURPLE,
  borderStyle: 'solid',
  borderRadius: 12,
  borderColor: isDragging ? COLORS.BLACK : COLORS.PURPLE,

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

const buttonStyle = {
  marginTop: 2,
  marginBottom: 2,
};

export {
  DraggableColors,
  getDraggableCoursePillStyle,
  getDraggableInternshipPillStyle,
  getDraggableOpportunityPillStyle,
  getInspectorDraggablePillStyle,
  getDroppableListStyle,
  getNotSatisfiedStyle,
  getSatisfiedStyle,
  cardStyle,
  contentStyle,
  buttonStyle,
};
