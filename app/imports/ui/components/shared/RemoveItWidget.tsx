import React, { useState } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../redux/student/degree-planner';

interface IRemoveItWidgetProps {
  collectionName: string;
  id: string;
  name: string;
  courseNumber: string;
  selectCourseInstance: (courseInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
});

const RemoveItWidget = (props: IRemoveItWidgetProps) => {
  const [modalOpenState, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);

  const handleClose = () => setModalOpen(false);


  const handleRemoveIt = () => {
    handleClose();
    // console.log(props);
    const collectionName = props.collectionName;
    const instance = props.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error(`Remove ${collectionName}: ${instance} failed.`, error);
      } else {
        Swal.fire({
          title: 'Remove succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // TODO: UserInteraction remove planned item.
      }
    });
    props.selectCourseInstance('');
  };

  return (
    <Modal
      trigger={
        (
          <Button icon basic size="mini" onClick={handleOpen}>
            <Icon
              name="remove circle"
              color="red"
            />
          </Button>
        )
      }
      open={modalOpenState}
      onClose={handleClose}
      basic
      size="small"
    >
      <Header>
        Delete&nbsp;
        {props.name}
      </Header>
      <Modal.Description>
        <p>
          Do you want to remove&nbsp;
          {props.courseNumber}
          &nbsp;
          {props.name}
          &nbsp;
          from your plan?
        </p>
      </Modal.Description>
      <Modal.Actions>
        <Button color="green" onClick={handleRemoveIt} inverted>
          <Icon name="checkmark" />
          Yes
        </Button>
        <Button color="red" onClick={handleClose} inverted>
          <Icon name="cancel" />
          No
        </Button>
      </Modal.Actions>

    </Modal>
  );
};

export default connect(null, mapDispatchToProps)(RemoveItWidget);
