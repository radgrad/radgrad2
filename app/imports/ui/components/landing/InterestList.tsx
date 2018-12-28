import * as React from 'react';
import { Label } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Interests } from '../../../api/interest/InterestCollection';

interface IWithInterestsProps {
  interestIDs: string[];
}

const InterestList = (props: IWithInterestsProps) => {
  // console.log(Interests.find().fetch());
  // console.log(props.interestIDs);
  const interests = _.map(props.interestIDs, (id) => Interests.findDoc(id));
  // console.log(interests);
  return (
    <div>
      {interests.map((interest) => <Label key={interest._id} color="grey">{interest.name}</Label>)}
    </div>
  );
};

export default InterestList;
