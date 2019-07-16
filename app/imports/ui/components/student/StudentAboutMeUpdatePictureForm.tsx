import * as React from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { Users } from '../../../api/user/UserCollection';

interface IStudentAboutMeUpdatePictureFormProps {
  username: string;
  picture: string;
  docID: string;
  collectionName: string;
}

interface IStudentAboutMeUpdatePictureFormState {
  picture: string;
}

class StudentAboutMeUpdatePictureForm extends React.Component<IStudentAboutMeUpdatePictureFormProps, IStudentAboutMeUpdatePictureFormState> {
  constructor(props) {
    super(props);
    this.state = { picture: this.props.picture };
  }

  // private prePopulateForm = (picture) => {
  //   this.setState({ picture: picture });
  // }

  private handleFormChange = (e, { value }) => this.setState({ picture: value });

  private handleUpdatePicture = async (e): Promise<void> => {
    e.preventDefault();
    const { username, collectionName } = this.props;
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      const profile = Users.getProfile(username);
      const updateData: { id: string; picture: string; } = { id: profile._id, picture: cloudinaryResult.info.url };
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          Swal.fire({
            title: 'Update Failed',
            text: error.message,
            type: 'error',
          });
        } else {
          this.setState({ picture: cloudinaryResult.info.url });
          Swal.fire({
            title: 'Update Succeeded',
            type: 'success',
            text: 'Your picture has been successfully updated.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
        }
      });
    }
  }

  // componentDidUpdate(prevProps: Readonly<IStudentAboutMeUpdatePictureFormProps>): void {
  //   const prop = this.props.picture;
  //   if (prop !== prevProps.picture) this.prePopulateForm(this.props.picture);
  // }

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
          <Image src={picture} style={imageStyle} floated="left"/>
          <Button basic={true} color="green" floated="right" onClick={this.handleUpdatePicture}>Upload</Button>
        </Grid.Column>
      </React.Fragment>
    );
  }
}

export default StudentAboutMeUpdatePictureForm;
