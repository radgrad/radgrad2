import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface IRemoveItWidgetProps {
  collectionName: string;
  id: string;
  name: string;
}

interface IRemoveItWidgetState {
  modalOpen: boolean;
}

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
  }

  render() {
    return (
      <Modal
        trigger={<Icon name="remove circle" color="red" />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size="small"
      >
        <Header>
          Delete
          {this.props.name}
        </Header>
        <Modal.Actions>
          <Button color="green" onClick={this.handleRemoveIt} inverted>
            <Icon name="checkmark" />
            Yes
          </Button>
          <Button color="red" onClick={this.handleRemoveIt} inverted>
            <Icon name="cancel" />
            No
          </Button>
        </Modal.Actions>

      </Modal>
    );
  }
}

export default RemoveItWidget;
