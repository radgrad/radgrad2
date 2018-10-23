import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';

function createUser(email, password, role) {
  console.log(`  Creating user ${email}.`); // tslint:disable-line
  const userID = Accounts.createUser({
    email,
    password,
    username: email,
  });
  if (role === 'ADMIN') {
    const allDefinedRoles = Roles.getAllRoles().fetch();
    if (!_.includes(allDefinedRoles, 'ADMIN')) {
      Roles.createRole('ADMIN');
    }
    Roles.addUsersToRoles(userID, 'ADMIN');
  }
}

/** When running app for first time, pass a settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)'); // tslint:disable-line
    Meteor.settings.defaultAccounts.map(({ email, password, role }) => createUser(email, password, role));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.'); // tslint:disable-line
  }
}
