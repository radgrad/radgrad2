import React from 'react';
import { SemanticSIZES } from 'semantic-ui-react';
import { Profile } from '../../../typings/radgrad';
import OpportunityList from './OpportunityList';
import { getUniqFutureOpportunities } from './utilities/data-model';


interface ProfileFutureOpportunitiesListProps {
  size: SemanticSIZES;
  profile: Profile;
}

const ProfileFutureOpportuntiesList: React.FC<ProfileFutureOpportunitiesListProps> = ({ profile, size }) => {
  const studentID = profile.userID;
  const futureOpportunities = getUniqFutureOpportunities(studentID);
  return (
    <OpportunityList opportunities={futureOpportunities} size={size} keyStr="futureOpps" userID={profile.userID} />
  );
};

export default ProfileFutureOpportuntiesList;
