import * as React from 'react';
import {connect} from 'react-redux';
import { _ } from 'meteor/erasaur:meteor-lodash';
import {withTracker} from 'meteor/react-meteor-data';
import {Segment, Grid, Header, Tab, Form, Button, Card, Image, Label, Popup} from 'semantic-ui-react';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {IStudentProfile} from '../../../typings/radgrad';
import {
  advisorHomeSetCount,
  advisorHomeSetFirstName,
  advisorHomeSetLastName,
  advisorHomeSetUsername,
  advisorHomeClearFilter,
  advisorHomeSetSelectedStudentUsername,
} from '../../../redux/actions/pageAdvisorActions';

interface IAdvisorStudentSelectorWidgetProps {
  instanceCount: number;
  instanceKey: number;
  dispatch: any;
  firstName: string;
  lastName: string;
  username: string;
  students: IStudentProfile[];
}

const mapStateToProps = (state) => ({
  instanceCount: state.page.advisor.home.count,
  instanceKey: state.page.advisor.home.doNotChange,
  firstName: state.page.advisor.home.firstName,
  lastName: state.page.advisor.home.lastName,
  username: state.page.advisor.home.username,
})

class AdvisorStudentSelectorWidget extends React.Component<IAdvisorStudentSelectorWidgetProps> {
  
  public handleChangeFirstName = (event) => {
    this.props.dispatch(advisorHomeSetFirstName(event.target.value));
  };
  
  public handleChangeLastName = (event) => {
    this.props.dispatch(advisorHomeSetLastName(event.target.value));
  };
  
  public handleChangeUserName = (event) => {
    this.props.dispatch(advisorHomeSetUsername(event.target.value));
  };
  
  public clearFilter = () => {
    this.props.dispatch(advisorHomeClearFilter());
  };
  
  public handleSelectStudent = (event, data) => {
    this.props.dispatch(advisorHomeSetSelectedStudentUsername(data.studentusername));
  };
  
  public render() {
    const columnStyle = {
      padding: 2,
    };
    
    const buttonStyle = {
      overflow: 'hidden',
    };
    
    const filterFirst = _.filter(this.props.students, s => s.firstName.toLowerCase().includes(this.props.firstName.toLowerCase()));
    const filterLast = _.filter(filterFirst, s => s.lastName.toLowerCase().includes(this.props.lastName.toLowerCase()));
    const filteredStudents = _.filter(filterLast, s => s.username.toLowerCase().includes(this.props.username.toLowerCase()));
    
    const panes = [
      {
        menuItem: 'Update Existing',
        render: () =>
          <Tab.Pane key={'update'}>
            <Header as="h4" dividing={true}>FILTER STUDENTS</Header>
            <Form onSubmit={this.clearFilter}>
              <Form.Group inline>
                <Form.Field>
                  <Form.Input name="firstName"
                              label={{basic: 'true', children: 'First Name:'}}
                              value={this.props.firstName}
                              onChange={this.handleChangeFirstName}/>
                </Form.Field>
                <Form.Field>
                  <Form.Input name="lastName"
                              label={{basic: 'true', children: 'Last Name:'}}
                              value={this.props.lastName}
                              onChange={this.handleChangeLastName}/>
                </Form.Field>
                <Form.Field>
                  <Form.Input name="userName"
                              label={{basic: 'true', children: 'Username:'}}
                              value={this.props.username}
                              onChange={this.handleChangeUserName}/>
                </Form.Field>
                <Form.Button basic={true} color={'green'} content={'Clear Filter'}/>
              </Form.Group>
            </Form>
            <Header as="h4">{'Header here'}</Header>
            <Tab panes={[
              {
                menuItem: `Students (${this.props.students.length})`,
                render: () =>
                  <Tab.Pane>
                    <Grid stackable>
                      {filteredStudents.map((student, index) => (
                        <Grid.Column style={columnStyle} width={3} key={index}>
                          <Popup content={`${student.lastName}, ${student.firstName}`} position='top center'
                                 trigger={<Button basic={true} color={'grey'} fluid={true} style={buttonStyle}
                                                  studentusername={student.username}
                                                  onClick={this.handleSelectStudent}>
                                   <Image avatar src={`/images/level-icons/radgrad-level-${student.level}-icon.png`}/>
                                   {student.lastName}, {student.firstName}<br/>{student.username}
                                 </Button>}/>
                        </Grid.Column>
                      ))}
                    </Grid>
                  </Tab.Pane>
              }
            ]}/>
          </Tab.Pane>
        ,
      },
      {
        menuItem: 'Add New',
        render: () =>
          <Tab.Pane key={'new'}>
            {/*<Header content={'ADD NEW'}/>*/}
            <Header content={`The one key: ${this.props.instanceKey}`}/>
          </Tab.Pane>
        ,
      },
      {
        menuItem: 'Bulk STAR Upload',
        render: () =>
          <Tab.Pane key={'upload'}>
            <Header content={'BULK STAR UPL'}/>
          </Tab.Pane>
        ,
      },
    ];
    
    return (
      <Segment>
        <Header as="h4" dividing={true}>SELECT STUDENT</Header>
        <Tab panes={panes}/>
      </Segment>
    );
  }
}

const AdvisorStudentSelectorWidgetContainer = withTracker(() => ({
  students: StudentProfiles.find({}, {sort: {lastName: 1, firstName: 1}}).fetch(),
}))(AdvisorStudentSelectorWidget);

export default connect(mapStateToProps)(AdvisorStudentSelectorWidgetContainer);