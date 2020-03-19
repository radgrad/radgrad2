import { rootReducer } from './store';

export type State = ReturnType<typeof rootReducer>; // FIXME this is broken now with the new changes from #167
