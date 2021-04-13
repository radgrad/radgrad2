import React from 'react';
import _ from 'lodash';
import { useRouteMatch } from 'react-router-dom';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import { EntityLabel, EntityLabelPublicProps } from './EntityLabel';

/**
 * Returns a React Component representing a Career Goal label.
 * @param slug Required slug. Error if not found.
 * @param userID Optional userID. If provided, then Label will colored if present in the user's profile.
 * @param size Optional size. Defaults to 'Large'.
 */
const CareerGoalLabel: React.FC<EntityLabelPublicProps> = ({ slug, userID, size, style, rightside }) => {
  let inProfile = false;
  const match = useRouteMatch();
  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slug}`);
  const name = CareerGoals.findDocBySlug(slug).name; // will throw an error if slug is undefined.
  if (userID) {
    // Calculate inProfile and route.
    const profileEntityIDs = ProfileCareerGoals.findNonRetired({ userID: userID });
    const id = CareerGoals.findIdBySlug(slug);
    inProfile = _.includes(profileEntityIDs.map(doc => doc.careerGoalID), id);
  }
  return (
    <EntityLabel slug={slug} inProfile={inProfile} icon='briefcase' name={name} route={route} size={size} style={style} rightside={rightside}/>
  );
};

export default CareerGoalLabel;
