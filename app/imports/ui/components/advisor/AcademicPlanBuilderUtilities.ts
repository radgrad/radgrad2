export const PLAN_AREA = 'PLAN';
export const CHOICE_AREA = 'CHOICE';
export const COMBINE_AREA = 'COMBINE';
export const DELETE_AREA = 'DELETE';
export const PLAN_CHOICE = 'PLAN_CHOICE';
const SEPARATOR = '-';

export function getDropDestinationArea(destinationId) {
  return destinationId.split(SEPARATOR)[0];
}

export function getPlanAreaTermYear(planDroppableId) {
  return planDroppableId.split(SEPARATOR)[1];
}

export function getPlanAreaTermNumber(planDroppableId) {
  return planDroppableId.split(SEPARATOR)[2];
}

export function buildPlanAreaDroppableId(year: number, termNumber: number): string {
  return `${PLAN_AREA}-${year}-${termNumber}`;
}

export function buildPlanAreaDraggableId(choice: string): string {
  return `${PLAN_CHOICE}-${choice}`;
}

export function buildCombineAreaDraggableId(choice: string): string {
  return `${COMBINE_AREA}-${choice}`;
}

export function getPlanChoiceFromDraggableId(draggableId) {
  const index = draggableId.indexOf(SEPARATOR);
  return draggableId.substring(index + 1);
}

export const stripPrefix = (str) => {
  const index = str.indexOf(SEPARATOR);
  if (index !== -1) {
    return str.substring(index + 1);
  }
  return str;
};
