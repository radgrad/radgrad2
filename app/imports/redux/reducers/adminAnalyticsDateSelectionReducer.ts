import {
  SET_DATE_SELECTION_START_DATE,
  SET_DATE_SELECTION_END_DATE,
} from "../actions/adminAnalyticsDateSelectionActionTypes";

const initialState={
  startDate: '',
  endDate: '',
}

const dateSelectionWidgetReducer = (state=initialState, action) => {
  const newState={...state};
 switch(action.type){
   case SET_DATE_SELECTION_START_DATE:
     newState.startDate = action.payload;
     return newState;
   case SET_DATE_SELECTION_END_DATE:
     newState.endDate = action.payload;
     return newState;
 }
};
export default dateSelectionWidgetReducer;
