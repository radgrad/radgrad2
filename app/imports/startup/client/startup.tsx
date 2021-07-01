import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import App from '../../ui/layouts/App';

/** Startup the application by rendering the App layout component. */
Meteor.startup(() => {
  render(
    <App />,
    document.getElementById('root'),
  );
});

Meteor.startup(() =>  document.body.classList.add('radgrad-background-color'));
Meteor.startup(() =>  { document.title = `RadGrad (${Meteor.settings.public.instanceName})`; });
