import React, { useState } from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { getUsername } from '../shared/RouterHelperFunctions';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

interface IStudentAboutMeUpdatePictureFormProps {
  picture: string;
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

const StudentAboutMeUpdatePictureForm = (props: IStudentAboutMeUpdatePictureFormProps) => {
  const [pictureState, setPicture] = useState(props.picture);

  const handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    const { collectionName, docID } = props;
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        const updateData: { id: string; picture: string; } = { id: docID, picture: cloudinaryResult.info.url };
        updateMethod.call({ collectionName, updateData }, (error) => {
          if (error) {
            Swal.fire({
              title: 'Update Failed',
              text: error.message,
              icon: 'error',
            });
          } else {
            setPicture(cloudinaryResult.info.url);
            Swal.fire({
              title: 'Update Succeeded',
              icon: 'success',
              text: 'Your picture has been successfully updated.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            });
            const username = getUsername(props.match);
            const interactionData: UserInteractionsDataType = {
              username,
              type: UserInteractionsTypes.PICTURE,
              typeData: cloudinaryResult.info.url,
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
        <Button basic color="green" onClick={handleUploadPicture}>UPLOAD</Button>
      </Grid.Column>
    </React.Fragment>
  );
};

export default withRouter(StudentAboutMeUpdatePictureForm);
