import React, { useState } from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { useRouteMatch } from 'react-router-dom';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { openCloudinaryWidget } from '../../shared/OpenCloudinaryWidget';
import { getUsername } from '../../shared/utilities/router';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';
import { UserInteractionDefine } from '../../../../typings/radgrad';

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
            Swal.fire({
              title: 'Update Failed',
              text: error.message,
              icon: 'error',
            });
          } else {
            setPicture(cloudinaryResult.info.secure_url);
            Swal.fire({
              title: 'Update Succeeded',
              icon: 'success',
              text: 'Your picture has been successfully updated.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            });
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
      Swal.fire({
        title: 'Failed to Upload Photo',
        icon: 'error',
        text: error.statusText,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
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