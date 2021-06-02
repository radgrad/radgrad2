import React, { useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { IProfileEntryTypes } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { Users } from '../../../../../api/user/UserCollection';
import { CareerGoal, Course, Interest, Opportunity, ProfileCareerGoal,
  Profile } from '../../../../../typings/radgrad';
import RadGradHeader from '../../RadGradHeader';
import * as Router from '../../utilities/router';

type ItemType = CareerGoal | Course | Interest | Opportunity;

interface interestModalInterface {
  item: ItemType;
  studentID: string;
  type: IProfileEntryTypes;
  career: CareerGoal;
  profile: Profile;
  profileCareerGoal: ProfileCareerGoal[];
  interests: Interest[];
}

const AddInterestModal: React.FC<interestModalInterface> = ({ type, item, studentID, career, profile, interests, profileCareerGoal }) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [open, setOpen] = useState(false);
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const profileItems = Users.getInterestIDs(userID).map((id) => Interests.findDoc(id));
  return (
    <Modal basic onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} size = 'small' trigger={<Button>Basic Modal</Button>}>
      <RadGradHeader title= "See interests associated with the career"/>
      <Modal.Content>
        <b> Interests In Your Profile</b><br/>
        {Users.getInterestIDs(userID).map((id) => Interests.findDoc(id))}
        <b> Interests Not In Your Profile</b><br/>
        {Interests.findNonRetired().filter(md => profileItems.every(fd => fd._id !== md._id))}
      </Modal.Content>
    </Modal>
  );
};

export default AddInterestModal;
