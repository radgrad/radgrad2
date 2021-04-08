import React from 'react';
import _ from 'lodash';
import { useRouteMatch } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import { EntityLabel, EntityLabelPublicProps } from './EntityLabel';
import { Interests } from '../../../../api/interest/InterestCollection';
import { ProfileInterests } from '../../../../api/user/profile-entries/ProfileInterestCollection';

/**
 * Returns a React Component representing a Interest label.
 * @param slug Required slug. Error if not found.
 * @param userID Optional userID. If provided, then Label will colored if present in the user's profile.
 * @param size Optional size. Defaults to 'Large'.
 */
const InterestLabel: React.FC<EntityLabelPublicProps> = ({ slug, userID, size, style }) => {
  let inProfile = false;
  const match = useRouteMatch();
  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`);
  const name = Interests.findDocBySlug(slug).name; // will throw an error if slug is undefined.
  if (userID) {
    // Calculate inProfile and route.
    const profileEntityIDs = ProfileInterests.findNonRetired({ userID: userID });
    const id = Interests.findIdBySlug(slug);
    inProfile = _.includes(profileEntityIDs.map(doc => doc.interestID), id);
  }
  return (
    <EntityLabel key={slug} slug={slug} inProfile={inProfile} icon='heart outline' name={name} route={route} size={size} style={style}/>
  );
};

export default InterestLabel;
