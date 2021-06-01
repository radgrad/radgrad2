import React, { useState } from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { openCloudinaryWidget } from '../../shared/OpenCloudinaryWidget';
import { getUsername } from '../../shared/utilities/router';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionDefine } from '../../../../typings/radgrad';
import RadGradAlert from '../../../app/imports/ui/utilities/RadGradAlert';

interface StudentAboutMeUpdatePictureFormProps {
  picture: string;
  docID: string;
  collectionName: string;
}

const StudentAboutMeUpdatePictureForm: React.FC<StudentAboutMeUpdatePictureFormProps> = ({ picture, collectionName, docID }) => {
  const [pictureState, setPicture] = useState(picture);
  const match = useRouteMatch();
  const handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        const updateData: { id: string; picture: string } = { id: docID, picture: cloudinaryResult.info.secure_url };
        updateMethod.call({ collectionName, updateData }, (error) => {
          if (error) {
            RadGradAlert.failure('Update Failed', error.message, error);
          } else {
            setPicture(cloudinaryResult.info.secure_url);
            RadGradAlert.success('Update Succeeded');
            const username = getUsername(match);
            const interactionData: UserInteractionDefine = {
              username,
              type: UserInteractionsTypes.PICTURE,
              typeData: [cloudinaryResult.info.secure_url],
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
              if (userInteractionError) {
                console.error('Error creating UserInteraction.', userInteractionError);
              }
            });
          }
        });
      }
    } catch (error) {
      RadGradAlert.failure('Failed to Upload Photo', error.statusText, error);
    }
  };

  const imageStyle = {
    maxHeight: 90,
    maxWidth: 150,
    paddingRight: 30,
  };

  return (
    <React.Fragment>
      <Grid.Column width={6}>
        <Image src={pictureState} style={imageStyle} floated="left" />
        <Button basic color="green" onClick={handleUploadPicture}>
          UPLOAD
        </Button>
      </Grid.Column>
    </React.Fragment>
  );
};

export default StudentAboutMeUpdatePictureForm;
