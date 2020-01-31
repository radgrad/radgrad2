import React from 'react';
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

interface IRemoveItWidgetState {
  modalOpen: boolean;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
});

class RemoveItWidget extends React.Component<IRemoveItWidgetProps, IRemoveItWidgetState> {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => {
    this.setState({ modalOpen: false });
  }

  handleRemoveIt = () => {
    this.handleClose();
    console.log(this.props);
    const collectionName = this.props.collectionName;
    const instance = this.props.id;
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
    this.props.selectCourseInstance('');
  }

  render() {
    return (
      <Modal
        trigger={<Button icon basic size="mini" onClick={this.handleOpen}><Icon name="remove circle" color="red" /></Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size="small"
      >
        <Header>
          Delete&nbsp;
          {this.props.name}
        </Header>
        <Modal.Description>
          <p>
            Do you want to remove&nbsp;
            {this.props.courseNumber}
            &nbsp;
            {this.props.name}
            &nbsp;
            from your plan?
          </p>
        </Modal.Description>
        <Modal.Actions>
          <Button color="green" onClick={this.handleRemoveIt} inverted>
            <Icon name="checkmark" />
            Yes
          </Button>
          <Button color="red" onClick={this.handleClose} inverted>
            <Icon name="cancel" />
            No
          </Button>
        </Modal.Actions>

      </Modal>
    );
  }
}

export default connect(null, mapDispatchToProps)(RemoveItWidget);
