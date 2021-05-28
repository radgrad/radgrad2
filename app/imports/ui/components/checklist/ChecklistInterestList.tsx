import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Interests } from '../../../api/interest/InterestCollection';
import { Interest, Profile } from '../../../typings/radgrad';
import { EXPLORER } from '../../layouts/utilities/route-constants';
import { ButtonLink } from '../shared/button/ButtonLink';

interface ChecklistInterestListProps {
  interests: Interest[];
  size: SemanticSIZES;
  profile: Profile;
}

const ChecklistInterestList: React.FC<ChecklistInterestListProps> = ({ interests, size, profile }) => (
  <Label.Group>
    {interests.map((interest) => {
      const slug = Interests.findSlugByID(interest._id);
      const url = `/${profile.role.toLowerCase()}/${profile.username}/${EXPLORER.INTERESTS}/${slug}`;
      return <ButtonLink url={url} label={interest.name} size={size} key={`${interest._id}-button-link`}/>;
    })}
  </Label.Group>
);

export default ChecklistInterestList;
