import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Interests } from '../../../api/interest/InterestCollection';
import InterestLabel from '../shared/label/InterestLabel';

interface LandingInterestsListProps {
  interestIDs: string[];
  size: SemanticSIZES;
}

const LandingInterestList: React.FC<LandingInterestsListProps> = ({ size, interestIDs }) => {
  const interests = interestIDs.map((id) => Interests.findDoc(id));
  const interestSlug = interests.map(interest => Interests.findSlugByID(interest));
  return (
    <Label.Group size={size}>
      {interestSlug.map((slug) =>
        <InterestLabel key={slug} slug={slug} size={size} />)}
    </Label.Group>
  );
};

export default LandingInterestList;
