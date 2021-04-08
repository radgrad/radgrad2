import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { Profile } from '../../../typings/radgrad';
import CareerGoalLabel from './label/CareerGoalLabel';
import { itemToSlugName } from './utilities/data-model';

interface ProfileCareerGoalListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileCareerGoalList: React.FC<ProfileCareerGoalListProps> = ({ profile, size }) => {
  const userID = profile.userID;
  const favGoals = ProfileCareerGoals.findNonRetired({ userID });
  const careerGoals = favGoals.map((fav) => CareerGoals.findDoc(fav.careerGoalID));
  return (
    <Label.Group size={size}>
      {careerGoals.map((careerGoal) => {
        const slug = itemToSlugName(careerGoal);
        return (
          <CareerGoalLabel key={slug} slug={slug} size={size} userID={profile.userID} />
        );
      })}
    </Label.Group>
  );
};

export default ProfileCareerGoalList;
