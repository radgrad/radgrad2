import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from '../../ui/layouts/App';
import configureStore, { history } from '../../redux/store';

const store = configureStore({});

/** Startup the application by rendering the App layout component. */
Meteor.startup(() => {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  );
});

Meteor.startup(() =>  document.body.classList.add('radgrad-background-color'));
