import { Accounts } from 'meteor/accounts-base';
import { ROLE } from '../../api/role/Role';
import { IUserInteractionDefine } from '../../typings/radgrad';
import { USERINTERACTIONSNOTYPEDATA, UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../api/analytic/UserInteractionCollection.methods';

Accounts.config({
  forbidClientAccountCreation: true,
});

Accounts.onLogout(function logout() {
  const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  if (isStudent) {
    const username = Meteor.user().username;
    const interactionData: IUserInteractionDefine = {
      username,
      type: UserInteractionsTypes.LOGOUT,
      typeData: [USERINTERACTIONSNOTYPEDATA],
    };
    userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
      if (userInteractionError) {
        console.error('Error creating UserInteraction.', userInteractionError);
      }
    });
  }
});
