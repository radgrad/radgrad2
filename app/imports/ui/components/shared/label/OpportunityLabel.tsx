import React from 'react';
import _ from 'lodash';
import { useRouteMatch } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import { EntityLabel, EntityLabelPublicProps } from './EntityLabel';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { ProfileOpportunities } from '../../../../api/user/profile-entries/ProfileOpportunityCollection';

/**
 * Returns a React Component representing an Opportunity label.
 * @param slug Required slug. Error if not found.
 * @param userID Optional userID. If provided, then Label will colored if present in the user's profile.
 * @param size Optional size. Defaults to 'Large'.
 */
const OpportunityLabel: React.FC<EntityLabelPublicProps> = ({ slug, userID, size, style, rightside }) => {
  let inProfile = false;
  const match = useRouteMatch();
  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`);
  const opportunity = Opportunities.findDocBySlug(slug);
  const name = opportunity.name; // will throw an error if slug is undefined.
  if (userID) {
    // Calculate inProfile.
    const profileEntityIDs = ProfileOpportunities.findNonRetired({ studentID: userID });
    const id = opportunity._id;
    inProfile = _.includes(profileEntityIDs.map(doc => doc.opportunityID), id) || opportunity.sponsorID === userID;
  }
  return (
    <EntityLabel slug={slug} inProfile={inProfile} icon='lightbulb outline' name={name} route={route} size={size}
                 style={style} rightside={rightside}/>
  );
};

export default OpportunityLabel;
