import React from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router';
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

interface IStudentAboutMeUpdatePictureFormState {
  picture: string;
}

class StudentAboutMeUpdatePictureForm extends React.Component<IStudentAboutMeUpdatePictureFormProps, IStudentAboutMeUpdatePictureFormState> {
  constructor(props) {
    super(props);
    this.state = { picture: this.props.picture };
  }

  private handleFormChange = (e, { value }) => this.setState({ picture: value });

  private handleUploadPicture = async (e): Promise<void> => {
    e.preventDefault();
    const { collectionName, docID } = this.props;
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
            this.setState({ picture: cloudinaryResult.info.url });
            Swal.fire({
              title: 'Update Succeeded',
              icon: 'success',
              text: 'Your picture has been successfully updated.',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
            });
            const username = getUsername(this.props.match);
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
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { picture } = this.state;
    const imageStyle = {
      maxHeight: 90,
      maxWidth: 150,
      paddingRight: 30,
    };

    return (
      <React.Fragment>
        <Grid.Column width={2}><b>Picture</b></Grid.Column>
        <Grid.Column width={6}>
          <Image src={picture} style={imageStyle} floated="left" />
          <Button basic color="green" onClick={this.handleUploadPicture}>Upload</Button>
        </Grid.Column>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentAboutMeUpdatePictureForm);
