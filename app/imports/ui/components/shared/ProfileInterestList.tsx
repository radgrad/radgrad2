import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { Profile } from '../../../typings/radgrad';
import InterestLabel from './label/InterestLabel';
import { itemToSlugName } from './utilities/data-model';

interface ProfileInterestListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileInterestList: React.FC<ProfileInterestListProps> = ({ profile, size }) => {
  const interests = Users.getInterestIDs(profile.userID);
  const userInterests = interests.map((interestID) => Interests.findDoc(interestID));
  return (
    <Label.Group size={size}>
      {userInterests.map((interest) => {
        const interestSlug = itemToSlugName(interest);
        return (
          <InterestLabel key={interestSlug} slug={interestSlug} size={size} userID={profile.userID} />
        );
      })}
    </Label.Group>
  );
};

export default ProfileInterestList;
