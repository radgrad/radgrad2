import * as React from 'react';
import {Segment, Header, Form} from 'semantic-ui-react';

export interface IAdvisorStarUploadWidgetProps {
  usernameDoc: any;
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
  
    reader.onload = e => {
      // TODO -- figure out why typescript doesn't think result exists when it does
      // @ts-ignore
      this.setState({fileData: e.target.result})
    };
  };
  
  private onSubmit = () => {
    // TODO -- Placeholder submit until we find out how to process STAR CSV
    console.log('Data submitted: ', this.state.fileData);
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