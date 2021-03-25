import React from 'react';
import _ from 'lodash';
import {SemanticSIZES} from 'semantic-ui-react';
import {useRouteMatch} from 'react-router-dom';
import {CareerGoals} from '../../../../api/career/CareerGoalCollection';
import {ProfileCareerGoals} from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import {EXPLORER_TYPE} from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import {EntityLabel, EntityLabelPublicProps} from './EntityLabel';

/**
 * Returns a React Component representing a Career Goal label.
 * @param slug Required slug. Error if not found.
 * @param profile Optional profile. If provided, then Label will be a link to the details page.
 * @param size Optional size. Defaults to 'Large'.
 */
const CareerGoalLabel: React.FC<EntityLabelPublicProps> = ({slug, profile, size = 'Large' as SemanticSIZES}) => {
  let route = '';
  let inProfile = false;
  const match = useRouteMatch();
  const name = CareerGoals.findDocBySlug(slug).name; // will throw an error if slug is undefined.
  if (profile) {
    // Calculate inProfile and route.
    const userID = profile.userID;
    const profileEntityIDs = ProfileCareerGoals.findNonRetired({userID: userID});
    const id = CareerGoals.findIdBySlug(slug);
    inProfile = _.includes(profileEntityIDs.map(doc => doc.careerGoalID), id);
    route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slug}`);
  }
  return (
    <EntityLabel slug={slug} inProfile={inProfile} icon='briefcase' name={name} route={route} size={size}/>
  );
};

export default CareerGoalLabel;
