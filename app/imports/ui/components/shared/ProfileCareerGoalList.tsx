import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { CareerGoal, Profile } from '../../../typings/radgrad';
import CareerGoalLabel from './label/CareerGoalLabel';
import { itemToSlugName } from './utilities/data-model';

interface ProfileCareerGoalListProps {
  profile: Profile;
  careerGoals: CareerGoal[];
  size: SemanticSIZES;
}

const ProfileCareerGoalList: React.FC<ProfileCareerGoalListProps> = ({ profile, size, careerGoals }) => (
  <Label.Group size={size}>
    {careerGoals.map((careerGoal) => {
      const slug = itemToSlugName(careerGoal);
      return (
        <CareerGoalLabel key={slug} slug={slug} size={size} userID={profile.userID} />
      );
    })}
  </Label.Group>
);

export default ProfileCareerGoalList;
