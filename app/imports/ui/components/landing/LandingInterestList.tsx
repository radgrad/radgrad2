import React from 'react';
import { Header, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { IInterest } from '../../../typings/radgrad';

interface IWithInterestsProps {
  interestIDs: string[];
}

const getSlugName = (interest: IInterest) => Slugs.getNameFromID(interest.slugID);

const LandingInterestList = (props: IWithInterestsProps) => {
  const interests: IInterest[] = _.map(props.interestIDs, (id) => Interests.findDoc(id));
  const labelStyle = { marginBottom: '2px' };
  return (
    <React.Fragment>
      <Header as="h4" dividing>Related Interests</Header>
      {interests.map((interest) => (
        <Label
          as={Link}
          key={interest._id}
          to={`/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${getSlugName(interest)}`}
          color="grey"
          style={labelStyle}
        >
          {interest.name}
        </Label>
      ))}
    </React.Fragment>
  );
};

export default LandingInterestList;
