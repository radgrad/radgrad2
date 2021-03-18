import { Accounts } from 'meteor/accounts-base';
import { ROLE } from '../../api/role/Role';
import { UserInteractionDefine } from '../../typings/radgrad';
import { USER_INTERACTIONS_NO_TYPE_DATA, UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../api/analytic/UserInteractionCollection.methods';

Accounts.config({
  forbidClientAccountCreation: true,
});

Accounts.onLogout(function logout() {
  const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  if (isStudent) {
    const username = Meteor.user().username;
    const interactionData: UserInteractionDefine = {
      username,
      type: UserInteractionsTypes.LOGOUT,
      typeData: [USER_INTERACTIONS_NO_TYPE_DATA],
    };
    userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
      if (userInteractionError) {
        console.error('Error creating UserInteraction.', userInteractionError);
      }
    });
  }
});
