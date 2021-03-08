import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { Profile } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { docToName, itemToSlugName } from './utilities/data-model';
import * as Router from './utilities/router';

interface ProfileInterestListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileInterestList: React.FC<ProfileInterestListProps> = ({ profile, size }) => {
  const match = useRouteMatch();
  const interests = Users.getInterestIDs(profile.userID);
  const userInterests = interests.map((interestID) => Interests.findDoc(interestID));
  return (
    <Label.Group size={size}>
      {userInterests.map((interest) => {
        const interestSlug = itemToSlugName(interest);
        return (
          <Label as={Link} key={interest._id} to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${interestSlug}`)} size={size}>
            <i className="fitted star icon" /> {docToName(interest)}
          </Label>
        );
      })}
    </Label.Group>
  );
};

export default ProfileInterestList;
