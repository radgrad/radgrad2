import React from 'react';
import { SemanticSIZES } from 'semantic-ui-react';
import { Profile } from '../../../typings/radgrad';
import OpportunityList from './OpportunityList';
import { getFutureOpportunities } from './utilities/data-model';


interface ProfileFutureOpportunitiesListProps {
  size: SemanticSIZES;
  profile: Profile;
}

const ProfileFutureOpportuntiesList: React.FC<ProfileFutureOpportunitiesListProps> = ({ profile, size }) => {
  const studentID = profile.userID;
  const futureOpportunities = getFutureOpportunities(studentID);
  return (
    <OpportunityList opportunities={futureOpportunities} size={size} />
  );
};

export default ProfileFutureOpportuntiesList;
