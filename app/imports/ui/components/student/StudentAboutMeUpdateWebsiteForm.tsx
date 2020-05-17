import React, { useState } from 'react';
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

const StudentAboutMeUpdateWebsiteForm = (props: IStudentAboutMeUpdateWebsiteFormProps) => {
  const [websiteState, setWebsite] = useState(props.website);

  const handleFormChange = (e, { value }) => setWebsite(value);

  const handleUpdateWebsite = (e): void => {
    e.preventDefault();
    const collectionName = props.collectionName;
    const updateData = { id: props.docID, website: websiteState };

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
        const username = getUsername(props.match);
        const interactionData: UserInteractionsDataType = {
          username,
          type: UserInteractionsTypes.WEBSITE,
          typeData: websiteState,
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.log('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      <Grid.Column width={2}><b>Website</b></Grid.Column>
      <Grid.Column width={6}>
        <Form onSubmit={handleUpdateWebsite}>
          <Form.Group>
            <Form.Input
              onChange={handleFormChange}
              value={websiteState}
            />
            <Form.Button basic color="green"> Update</Form.Button>
          </Form.Group>
        </Form>
      </Grid.Column>
    </React.Fragment>
  );
};

export default withRouter(StudentAboutMeUpdateWebsiteForm);
