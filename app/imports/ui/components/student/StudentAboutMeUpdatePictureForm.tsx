import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Form } from 'semantic-ui-react';

interface IStudentAboutMeUpdatePictureFormProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentAboutMeUpdatePictureForm extends React.Component<IStudentAboutMeUpdatePictureFormProps> {
  constructor(props) {
    super(props);
  }

  private handleUpdatePicture = (e): void => {
    e.preventDefault();
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    // TODO: Cloudinary functionality
    return (
      <React.Fragment>
        <Grid.Column width={2}><p><b>Picture</b>(<a id="image-upload-widget">Upload</a>)</p></Grid.Column>
        <Form onSubmit={this.handleUpdatePicture}>
          <Form.Field>
            <Form.Input/>
            <Form.Button basic={true} color="green">Update</Form.Button>
          </Form.Field>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentAboutMeUpdatePictureForm);
