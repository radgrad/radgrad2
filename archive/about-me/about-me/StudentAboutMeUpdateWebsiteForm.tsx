import React, { useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { getUsername } from '../../shared/utilities/router';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionDefine } from '../../../../typings/radgrad';
import RadGradAlert from '../../../app/imports/ui/utilities/RadGradAlert';

interface StudentAboutMeUpdateWebsiteFormProps {
  website: string;
  docID: string;
  collectionName: string;
}

const StudentAboutMeUpdateWebsiteForm: React.FC<StudentAboutMeUpdateWebsiteFormProps> = ({ website, docID, collectionName }) => {
  const [websiteState, setWebsite] = useState(website);
  const match = useRouteMatch();
  const handleFormChange = (e, { value }) => setWebsite(value);

  const handleUpdateWebsite = (e): void => {
    e.preventDefault();
    const updateData = { id: docID, website: websiteState };

    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        RadGradAlert.failure('Update Failed', error.message, error);
      } else {
        RadGradAlert.success('Update Succeeded');
        const username = getUsername(match);
        const interactionData: UserInteractionDefine = {
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
            <Form.Input onChange={handleFormChange} value={websiteState} />
            <Form.Button basic color="green">
              {' '}
              UPDATE
            </Form.Button>
          </Form.Group>
        </Form>
      </Grid.Column>
    </React.Fragment>
  );
};

export default StudentAboutMeUpdateWebsiteForm;
