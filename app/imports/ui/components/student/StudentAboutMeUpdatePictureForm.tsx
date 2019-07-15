import * as React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

interface IStudentAboutMeUpdatePictureFormProps {
  username: string;
  picture: string;
  docID: string;
  collectionName: string;
}

class StudentAboutMeUpdatePictureForm extends React.Component<IStudentAboutMeUpdatePictureFormProps> {
  state = { picture: this.props.picture };

  // private prePopulateForm = (picture) => {
  //   this.setState({ picture: picture });
  // }

  private handleFormChange = (e, { value }) => this.setState({ picture: value });

  private handleUpdatePicture = (e): void => {
    e.preventDefault();
    const collectionName = this.props.collectionName;
    const updateData = { id: this.props.docID, picture: this.state.picture };

    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          type: 'error',
        });
      } else {
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

  // componentDidUpdate(prevProps: Readonly<IStudentAboutMeUpdatePictureFormProps>): void {
  //   const prop = this.props.picture;
  //   if (prop !== prevProps.picture) this.prePopulateForm(this.props.picture);
  // }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // TODO: Cloudinary functionality
    const { picture } = this.state;
    return (
      <React.Fragment>
        <Grid.Column width={2}><b>Picture</b>(<a id="image-upload-widget">Upload</a>)</Grid.Column>
        <Grid.Column width={6}>
          <Form onSubmit={this.handleUpdatePicture}>
            <Form.Group>
              <Form.Input onChange={this.handleFormChange}
                          value={picture}
                          disabled={true}/>
              <Form.Button basic={true} color="green">Update</Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </React.Fragment>
    );
  }
}

export default StudentAboutMeUpdatePictureForm;
