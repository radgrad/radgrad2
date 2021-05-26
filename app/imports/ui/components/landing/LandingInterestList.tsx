import React from 'react';
import { Interests } from '../../../api/interest/InterestCollection';
import InterestLabel from '../shared/label/InterestLabel';

interface WithInterestsProps {
  interestIDs: string[];
}

const LandingInterestList: React.FC<WithInterestsProps> = ({ interestIDs }) => {
  const interests = interestIDs.map((id) => Interests.findDoc(id));
  const interestSlug = interests.map(interest => Interests.findSlugByID(interest));
  return (
  <React.Fragment>
    {interestSlug.map((slug) =>
    <InterestLabel key={slug} slug={slug} size='small'/>)}
  </React.Fragment>
  );
};

export default LandingInterestList;
