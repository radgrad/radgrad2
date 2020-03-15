import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { History, createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import admin from './admin';
import advisor from './advisor';
import shared from './shared';
import student from './student';

/* global window */

export const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
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
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );
  return store;
}
