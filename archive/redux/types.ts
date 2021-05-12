import { StateType } from 'typesafe-actions';
import { rootReducer } from './store';

export type RootState = StateType<ReturnType<typeof rootReducer>>;
