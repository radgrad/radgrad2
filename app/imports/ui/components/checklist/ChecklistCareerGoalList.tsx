import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CareerGoal, Profile } from '../../../typings/radgrad';
import { EXPLORER } from '../../layouts/utilities/route-constants';
import { ButtonLink } from '../shared/button/ButtonLink';

interface ChecklistCareerGoalListProps {
  careerGoals: CareerGoal[];
  size: SemanticSIZES;
  profile: Profile;
}

const ChecklistCareerGoalList: React.FC<ChecklistCareerGoalListProps> = ({ careerGoals, size, profile }) => (
  <Label.Group>
    {careerGoals.map((goal) => {
      const slug = CareerGoals.findSlugByID(goal._id);
      const url = `/${profile.role.toLowerCase()}/${profile.username}/${EXPLORER.CAREERGOALS}/${slug}`;
      return <ButtonLink url={url} label={goal.name} size={size} />;
    })}
  </Label.Group>
);

export default ChecklistCareerGoalList;
