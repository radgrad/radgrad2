import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import { connectRouter, LOCATION_CHANGE, routerMiddleware } from 'connected-react-router';
import admin from './admin';
import advisor from './advisor';
import shared from './shared';
import student from './student';
import routeTracker from './router';

/* global window */

export const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  routeTracker,
  admin,
  advisor,
  shared,
  student,
});

export const history = createHashHistory();

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer(history),
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
      ),
      // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
  );
  return store;
}

// const store = createStore(
//   rootReducer,
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
// );
