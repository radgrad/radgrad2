import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

/** Defines the legal strings used to represent roles in the system. */

/**
 * ROLE Provides ROLE.FACULTY, ROLE.STUDENT, ROLE.ADMIN, ROLE.ALUMNI.
 * @type { Object }
 * @memberOf api/role
 */
export const ROLE = {
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  ALUMNI: 'ALUMNI',
  ADVISOR: 'ADVISOR',
};

/**
 * The valid Roles in RadGrad.
 * @type {Array}
 * @memberOf api/role
 */
export const ROLES = _.values(ROLE);

/**
 * Predicate for determining if a string is a defined ROLE.
 * @param { String } role The role.
 * @returns {boolean} True if role is a defined ROLE.
 * @memberOf api/role
 */
export function isRole(role) {
  return (typeof role) === 'string' && _.includes(_.values(ROLE), role);
}

/**
 * Ensures that role(s) are valid roles.
 * @param role The role or an array of roles.
 * @throws { Meteor.Error } If any of role(s) are not valid.
 * @memberOf api/role
 */
export function assertRole(role) {
  const roleArray = (Array.isArray(role)) ? role : [role];
  roleArray.forEach((theRole) => {
    if (!isRole(theRole)) {
      throw new Meteor.Error(`${role} is not defined, or includes at least one undefined role.`);
    }
  });
}

// Initialize Roles to ROLENAMES by deleting all existing roles, then defining just those in ROLENAMES.

if (Meteor.isServer) {
  const allDefinedRoles = Roles.getAllRoles().fetch();
  const definedRoleNames = _.map(allDefinedRoles, (role) => role.name);
  _.values(ROLE).forEach((role) => {
    if (!_.includes(definedRoleNames, role)) {
      Roles.createRole(role, { unlessExists: true });
    }
  });
}
