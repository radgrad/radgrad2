import {
  SET_DATE_SELECTION_START_DATE,
  SET_DATE_SELECTION_END_DATE,
} from "./adminAnalyticsDateSelectionActionTypes";
// can't decide if I want the start and end dates to come in as objects and then parse to string after or vice versa
export const setDateSelectionWidgetStartDate = (startDate: any) => ({
  type: SET_DATE_SELECTION_START_DATE,
  payload: startDate,
  startDate
});

export const setDateSelectionWidgetEndDate = (endDate: any) => ({
  type: SET_DATE_SELECTION_END_DATE,
  payload: endDate,
});
