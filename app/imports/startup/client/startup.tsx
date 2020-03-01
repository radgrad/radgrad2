import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import App from '../../ui/layouts/App';

/** Startup the application by rendering the App layout component. */
Meteor.startup(() => {
  render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
});
