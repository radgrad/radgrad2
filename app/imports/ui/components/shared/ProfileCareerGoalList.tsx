import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { Profile } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { docToName, itemToSlugName } from './utilities/data-model';
import * as Router from './utilities/router';

interface ProfileCareerGoalListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileCareerGoalList: React.FC<ProfileCareerGoalListProps> = ({ profile, size }) => {
  const match = useRouteMatch();
  const userID = profile.userID;
  const favGoals = ProfileCareerGoals.findNonRetired({ userID });
  const careerGoals = favGoals.map((fav) => CareerGoals.findDoc(fav.careerGoalID));
  return (
    <Label.Group size={size}>
      {careerGoals.map((careerGoal) => {
        const slug = itemToSlugName(careerGoal);
        return (
          <Label as={Link} key={careerGoal._id}
                 to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slug}`)}
                 size={size}>
            <i className="fitted briefcase icon" /> {docToName(careerGoal)}
          </Label>
        );
      })}
    </Label.Group>
  );
};

export default ProfileCareerGoalList;
