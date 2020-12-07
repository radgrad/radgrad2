import React, { useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { useRouteMatch } from 'react-router-dom';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { getUsername } from '../../shared/utilities/router';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { IUserInteractionDefine } from '../../../../typings/radgrad';

interface IStudentAboutMeUpdateWebsiteFormProps {
  website: string;
  docID: string;
  collectionName: string;
}

const StudentAboutMeUpdateWebsiteForm: React.FC<IStudentAboutMeUpdateWebsiteFormProps> = ({ website, docID, collectionName }) => {
  const [websiteState, setWebsite] = useState(website);
  const match = useRouteMatch();
  const handleFormChange = (e, { value }) => setWebsite(value);

  const handleUpdateWebsite = (e): void => {
    e.preventDefault();
    const updateData = { id: docID, website: websiteState };

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
        const username = getUsername(match);
        const interactionData: IUserInteractionDefine = {
          username,
          type: UserInteractionsTypes.WEBSITE,
          typeData: [websiteState],
        };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.error('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      <Grid.Column>
        <Form onSubmit={handleUpdateWebsite}>
          <Form.Group>
            <Form.Input
              onChange={handleFormChange}
              value={websiteState}
            />
            <Form.Button basic color="green"> UPDATE</Form.Button>
          </Form.Group>
        </Form>
      </Grid.Column>
    </React.Fragment>
  );
};

export default StudentAboutMeUpdateWebsiteForm;
