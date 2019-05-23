import {
  SET_STUDENT_HOME_WIDGET_HIDDEN,
} from './studentHomePageActionTypes';

export const setStudentHomeWidgetHidden = (hidden: boolean) => ({
  type: SET_STUDENT_HOME_WIDGET_HIDDEN,
  payload: hidden,
});
