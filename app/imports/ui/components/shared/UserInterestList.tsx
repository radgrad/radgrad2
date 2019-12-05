import * as React from 'react';
import { Label } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';

interface IUserInterestListProps {
  userID: string;
  interestIDs: string[];
}

const UserInterestList = (props: IUserInterestListProps) => {
  const userInterests = Users.getInterestIDs(props.userID);
  const uncommonIDs = _.difference(props.interestIDs, userInterests);
  const commonIDs = _.intersection(props.interestIDs, userInterests);
  const commonInterests = _.map(commonIDs, (id) => Interests.findDoc(id));
  const uncommonInterests = _.map(uncommonIDs, (id) => Interests.findDoc(id));
  return (
    <Label.Group>
      {commonInterests.map((interest) => <Label key={interest._id}
                                          color="green">{interest.name}</Label>)}
      {uncommonInterests.map((interest) => <Label key={interest._id}
                                                color="grey">{interest.name}</Label>)}
    </Label.Group>
  );
};

export default UserInterestList;
