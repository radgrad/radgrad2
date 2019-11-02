export const PLAN_AREA = 'PLAN';
export const CHOICE_AREA = 'CHOICE';
export const COMBINE_AREA = 'COMBINE';
export const DELETE_AREA = 'DELETE';
export const PLAN_CHOICE = 'PLAN_CHOICE';
const SEPARATOR = '-';

export const getDropDestinationArea = (destinationId) => destinationId.split(SEPARATOR)[0];

export const getPlanAreaTermYear = (planDroppableId) => planDroppableId.split(SEPARATOR)[1];

export const getPlanAreaTermNumber = (planDroppableId) => planDroppableId.split(SEPARATOR)[2];

export const buildPlanAreaDroppableId = (year: number, termNumber: number): string => `${PLAN_AREA}-${year}-${termNumber}`;

export const buildPlanAreaDraggableId = (choice: string): string => `${PLAN_CHOICE}-${choice}`;

export const buildCombineAreaDraggableId = (choice: string): string => `${COMBINE_AREA}-${choice}`;

export const getPlanChoiceFromDraggableId = (draggableId) => {
  const index = draggableId.indexOf(SEPARATOR);
  return draggableId.substring(index + 1);
};

export const stripPrefix = (str) => {
  const index = str.indexOf(SEPARATOR);
  if (index !== -1) {
    return str.substring(index + 1);
  }
  return str;
};
