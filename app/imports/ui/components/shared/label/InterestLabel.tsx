import React from 'react';
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
const InterestLabel: React.FC<EntityLabelPublicProps> = ({ slug, userID, size, style, rightside }) => {
  let inProfile = false;
  const match = useRouteMatch();
  let route = `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`;
  const name = Interests.findDocBySlug(slug).name; // will throw an error if slug is undefined.
  if (userID) {
    route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`);
    // TODO does this need to be reactive? If so then it needs to be a property of the label and calculated elsewhere.
    // Calculate inProfile.
    const profileEntityIDs = ProfileInterests.findNonRetired({ userID: userID });
    const id = Interests.findIdBySlug(slug);
    inProfile = ((profileEntityIDs.map(doc => doc.interestID)).includes(id));
  }
  return (
    <EntityLabel key={slug} slug={slug} inProfile={inProfile} icon='heart outline' name={name} route={route} size={size} style={style} rightside={rightside} />
  );
};

export default InterestLabel;
