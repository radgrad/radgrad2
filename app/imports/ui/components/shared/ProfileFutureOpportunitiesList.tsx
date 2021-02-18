import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Profile } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { getFutureOpportunities, itemToSlugName } from './utilities/data-model';
import * as Router from './utilities/router';


interface ProfileFutureOpportunitiesListProps {
  size: SemanticSIZES;
  profile: Profile;
}

const ProfileFutureOpportuntiesList: React.FC<ProfileFutureOpportunitiesListProps> = ({ profile, size }) => {
  const match = useRouteMatch();
  const studentID = profile.userID;
  const futureOpportunities = getFutureOpportunities(studentID);
  return (
    <Label.Group size={size}>
      {futureOpportunities.map((opp) => {
        const slug = itemToSlugName(opp);
        return (
          <Label as={Link} key={opp._id}
                 to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`)}
                 size={size}>
            {opp.name}
          </Label>
        );
      })}
    </Label.Group>
  );
};

export default ProfileFutureOpportuntiesList;
