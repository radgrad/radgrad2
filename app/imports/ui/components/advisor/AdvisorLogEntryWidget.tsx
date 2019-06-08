import * as React from 'react';
import {Segment, Header, Form} from 'semantic-ui-react';
import {AdvisorLogs} from "../../../api/log/AdvisorLogCollection";
import {AdvisorProfiles} from "../../../api/user/AdvisorProfileCollection";
import {defineMethod} from '../../../api/base/BaseCollection.methods';
import Swal from "sweetalert2";

export interface IAdvisorLogEntryWidgetProps {
  advisorLogs: any;
  usernameDoc: any;
  advisorUsername: string;
}

export interface IAdvisorLogEntryWidgetState {
  advisorLogs: any;
  comment: string;
}

class AdvisorLogEntryWidget extends React.Component<IAdvisorLogEntryWidgetProps, IAdvisorLogEntryWidgetState> {
  state = {
    comment: '',
    advisorLogs: this.props.advisorLogs
  };
  
  // For use with Date.getMinutes()
  private formatMinuteString = (min) => {
    if (min === 0) { return '00'; }
    else if (0 < min && min < 10) { return `0${min}`; }
    else if (9 < min && min < 60) { return min.toString()}
    else { return 'formatMinuteString: error'; }
  };
  
  private handleForm = (e, {value}) => {
    this.setState({comment: value});
  }
  
  private onSubmit = () => {
    const collectionName = AdvisorLogs.getCollectionName();
    const definitionData: any = {};
    definitionData.advisor = this.props.advisorUsername;
    definitionData.student = this.props.usernameDoc.username;
    definitionData.text = this.state.comment;
    
    defineMethod.call({collectionName, definitionData}, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.setState({comment: ''})
      }
    });
  }
  
  componentDidUpdate(prevProps: Readonly<IAdvisorLogEntryWidgetProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props !== prevProps) {
      this.setState({advisorLogs: this.props.advisorLogs});
    }
  }
  
  public render() {
    
    return (
      <Segment padded={true}>
        <Header as="h4" dividing={true}>ADVISOR LOG</Header>
        <Form onSubmit={this.onSubmit} widths={'equal'}>
          <Form.TextArea label={'Comments'}
                         name={'comment'}
                         onChange={this.handleForm}
                         value={this.state.comment}/>
          <Form.Button content={'ADD COMMENTS'} type={'Submit'}/>
        </Form>
        <br/>
        <p style={{
          marginTop: '15px',
          display: 'block',
          margin: '0 0 .28571429rem 0',
          color: '#696969',
          fontSize: '.92857143em',
          fontWeight: 700,
          textTransform: 'none'
        }}>Past Advisor Logs</p>
        <div style={{"height": "200px"}}>
          <div style={{"height": "100%", "overflowY": "auto"}}>
            {this.state.advisorLogs.length > 0 ? this.state.advisorLogs.map(
              (ele, i) =>
                <Segment key={i}>
                  <strong>
                    {ele.createdOn.toDateString()} {ele.createdOn.getHours()}:{this.formatMinuteString(ele.createdOn.getMinutes())}:
                  </strong> {ele.text} <i>({AdvisorProfiles.find({userID: ele.advisorID}).fetch()[0].firstName})</i>
                </Segment>
            ) : <i>No past advisor logs with this student.</i>}
          </div>
        </div>
      </Segment>
    );
  }
}

export default AdvisorLogEntryWidget;