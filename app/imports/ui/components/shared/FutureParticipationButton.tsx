import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { Course, Opportunity } from '../../../typings/radgrad';
import { ButtonAction } from './button/ButtonAction';
import FutureParticipation from './explorer/FutureParticipation';

interface FutureParticipationButtonProps {
  item: Course | Opportunity;
}

const FutureParticipationButton: React.FC<FutureParticipationButtonProps> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal key={`${item._id}-forecast-modal`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<ButtonAction color='green' key={`${item._id}-view-button`} label='View Future Participation' onClick={() => setOpen(true)} size='mini' />}>
      <Modal.Header>Future Participation for {item.name}</Modal.Header>
      <Modal.Content>
        <FutureParticipation item={item} />
      </Modal.Content>
      <Modal.Actions>
        <ButtonAction color='green' onClick={() => setOpen(false)} label='CLOSE' icon='close'/>
      </Modal.Actions>
    </Modal>
  );
};

export default FutureParticipationButton;
