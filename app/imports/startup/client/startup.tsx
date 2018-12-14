import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from '../../ui/layouts/App';
import store from '../../redux/store';

/** Startup the application by rendering the App layout component. */
Meteor.startup(() => {
  render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
});
