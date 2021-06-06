import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../typings/radgrad';

interface DeleteItemButtonProps {
  item: CareerGoal | Course | Interest | Opportunity;
  type: PROFILE_ENTRY_TYPE;
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ item, type }) => {
  const [open, setOpen] = useState(false);

  let typeStr;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      typeStr = 'Career Goal';
      break;
    case PROFILE_ENTRY_TYPE.COURSE:
      typeStr = 'Course';
      break;
    case PROFILE_ENTRY_TYPE.INTEREST:
      typeStr = 'Interest';
      break;
    case PROFILE_ENTRY_TYPE.OPPORTUNITY:
      typeStr = 'Opportunity';
      break;
  }

  const handleDelete = () => {
    let collectionName;
    let title;
    let text;
    switch (type) {
      case PROFILE_ENTRY_TYPE.CAREERGOAL:
        collectionName = CareerGoals.getCollectionName();
        title = 'Career Goal Deleted';
        text = 'Successfully deleted career goal.';
        break;
      case PROFILE_ENTRY_TYPE.COURSE:
        collectionName = Courses.getCollectionName();
        title = 'Course Deleted';
        text = 'Successfully deleted course.';
        break;
      case PROFILE_ENTRY_TYPE.INTEREST:
        collectionName = Interests.getCollectionName();
        title = 'Interest Deleted';
        text = 'Successfully deleted interest.';
        break;
      case PROFILE_ENTRY_TYPE.OPPORTUNITY:
        collectionName = Opportunities.getCollectionName();
        title = 'Opportunity Deleted';
        text = 'Successfully deleted opportunity.';
        break;
    }
    const instance = item._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => { RadGradAlert.success(title, text);})
      .catch((error) => { RadGradAlert.failure('Delete Failed', error.message, error);});
    setOpen(false);
  };

  return (
    <Modal key={`${item._id}-modal-delete`}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='red' key={`${item._id}-delete-button`}>DELETE</Button>}>
      <Modal.Header>{`Delete ${typeStr} ${item.name}?`}</Modal.Header>
      <Modal.Content>Do you really want to delete the {`${typeStr}`}, &quot;{`${item.name}`}&quot; ?</Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={handleDelete}>YES</Button>
        <Button color='red' onClick={() => setOpen(false)}>NO</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteItemButton;
