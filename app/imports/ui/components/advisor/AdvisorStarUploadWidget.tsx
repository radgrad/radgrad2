import * as React from 'react';
import { Segment, Header, Form } from 'semantic-ui-react';
import { starLoadDataMethod } from '../../../api/star/StarProcessor.methods';
import { updateLevelMethod } from '../../../api/level/LevelProcessor.methods';
import { IStudentProfile } from '../../../typings/radgrad';

/* global FileReader */

export interface IAdvisorStarUploadWidgetProps {
  usernameDoc: IStudentProfile;
  advisorUsername: string;
}

export interface IAdvisorStarUploadWidgetState {
  fileData: string;
}

class AdvisorStarUploadWidget extends React.Component<IAdvisorStarUploadWidgetProps, IAdvisorStarUploadWidgetState> {
  state = { fileData: '' };

  private readFile = (e) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (event: { [k: string]: any }) => {
      this.setState({ fileData: event.target.result });
    };
  };

  private onSubmit = () => {
    console.log('Data submitted: ', this.state.fileData);
    // TODO -- find out more about how data is uploaded from STAR
    const advisor = this.props.advisorUsername;
    const studentDoc = this.props.usernameDoc;
    const csvData = this.state.fileData;
    starLoadDataMethod.call({ advisor, student: studentDoc.username, csvData }, (error) => {
      if (error) {
        console.log('Error loading STAR data', error);
      }
    });
    this.setState({ fileData: '' });
    updateLevelMethod.call({ studentID: studentDoc.userID }, (e) => {
      if (e) {
        console.log('Error updating student level', e);
      }
    });
  };

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment padded={true}>
        <Header as={'h4'} dividing={true}>UPLOAD STAR DATA</Header>
        <Form widths={'equal'} onSubmit={this.onSubmit}>
          <Form.Field>
            <Form.Input type={'file'} onChange={this.readFile} label={'STAR CSV'}/>
            <Form.Button basic={true} color={'green'} type={'Submit'}>LOAD STAR DATA</Form.Button>
          </Form.Field>
        </Form>
      </Segment>
    );

  }
}

export default AdvisorStarUploadWidget;
