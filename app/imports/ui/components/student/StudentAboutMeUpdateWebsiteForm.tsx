import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { getUsername } from '../shared/RouterHelperFunctions';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

interface IStudentAboutMeUpdateWebsiteFormProps {
  website: string;
  docID: string;
  collectionName: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

interface IStudentAboutMeUpdateWebsiteFormState {
  website: string;
}

class StudentAboutMeUpdateWebsiteForm extends React.Component<IStudentAboutMeUpdateWebsiteFormProps, IStudentAboutMeUpdateWebsiteFormState> {
  constructor(props) {
    super(props);
    this.state = { website: this.props.website };
  }

  private handleFormChange = (e, { value }) => this.setState({ website: value });

  private handleUpdateWebsite = (e): void => {
    e.preventDefault();
    const collectionName = this.props.collectionName;
    const updateData = { id: this.props.docID, website: this.state.website };

    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          icon: 'success',
          text: 'Your website link has been successfully updated.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        const username = getUsername(this.props.match);
        const interactionData: UserInteractionsDataType = {
          username,
          type: UserInteractionsTypes.WEBSITE,
          typeData: this.state.website,
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.log('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { website } = this.state;
    return (
      <React.Fragment>
        <Grid.Column width={2}><b>Website</b></Grid.Column>
        <Grid.Column width={6}>
          <Form onSubmit={this.handleUpdateWebsite}>
            <Form.Group>
              <Form.Input
                onChange={this.handleFormChange}
                value={website}
              />
              <Form.Button basic color="green"> Update</Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentAboutMeUpdateWebsiteForm);
