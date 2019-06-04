import {Meteor} from 'meteor/meteor';
import * as React from 'react';
import Swal from 'sweetalert2';
import {connect} from 'react-redux';
import {Segment, Button, Image, Grid, Header, Form, Label, Dropdown, Radio} from 'semantic-ui-react';
import {AcademicTerms} from '../../../api/academic-term/AcademicTermCollection';
import {AcademicPlans} from '../../../api/degree-plan/AcademicPlanCollection';
import {openCloudinaryWidget} from '../shared/OpenCloudinaryWidget';
import {advisorHomeSetIsLoaded, advisorHomeSetSelectedStudentUsername} from "../../../redux/actions/pageAdvisorActions";
import {updateMethod} from '../../../api/base/BaseCollection.methods';

interface IAdvisorUpdateStudentWidgetProps {
  // instanceCount: any; TODO -- remove instanceCount code from all other files
  dispatch: any;
  selectedUsername: string;
  isLoaded: boolean;
  usernameDoc: any;
  studentCollectionName: string;
  // These are parameters for reactivity
  interests: any;
  careerGoals: any;
}

interface IAdvisorUpdateStudentWidgetState {
  firstName: string;
  lastName: string;
  picture: string;
  website: string;
  careerGoals: any;
  userInterests: any;
  isAlumni: boolean;
  level: number;
  declaredAcademicTerm?: string;
  academicPlanID: string;
}

const mapStateToProps = (state) => ({
  // instanceCount: state.page.advisor.home.count,
  selectedUsername: state.page.advisor.home.selectedUsername,
  isLoaded: state.page.advisor.home.isLoaded,
});

class AdvisorUpdateStudentWidget extends React.Component<IAdvisorUpdateStudentWidgetProps, IAdvisorUpdateStudentWidgetState> {
  constructor(props) {
    super(props);
    // const doc = this.props.usernameDoc;
    // console.log('doc', doc);
    this.state = {
      firstName: '',
      lastName: '',
      picture: '',
      website: '',
      careerGoals: [],
      userInterests: [],
      isAlumni: undefined,
      level: -1,
      declaredAcademicTerm: '',
      academicPlanID: '',
    };
  }
  
  private handleUploadClick = () => {
    openCloudinaryWidget('picture');
  }
  
  private prePopulateForm = (doc) => {
    console.log('doc', doc);
    this.setState({
      firstName: doc.firstName,
      lastName: doc.lastName,
      picture: doc.picture,
      website: doc.website,
      careerGoals: doc ? doc.careerGoalIDs : [],
      userInterests: doc ? doc.interestIDs : [],
      isAlumni: doc.isAlumni,
      level: doc.level,
      declaredAcademicTerm: doc.declaredAcademicTerm || '',
      academicPlanID: doc.academicPlanID,
    });
    this.props.dispatch(advisorHomeSetIsLoaded(true));
  }
  
  private handleFormChange = (e, {name, value}) => {
    console.log(`${name}: `, value);
    if (value === 'true' || value === 'false') {
      value = value === 'true';
    }
    console.log(`state change: ${name}: `, value);
    
    // TODO -- gbarcelo - find out why typescript is complaining
    // @ts-ignore
    this.setState({[name]: value});
  }
  
  private handleInterestSelection = (e, {userInterests}) => this.setState({userInterests});
  
  private handleUpdateSubmit = () => {
    const collectionName = this.props.studentCollectionName;
    const updateData: any = {};
    updateData.firstName = this.state.firstName;
    updateData.id = this.props.usernameDoc._id;
    updateData.lastName = this.state.lastName;
    updateData.picture = this.state.picture;
    updateData.website = this.state.website;
    updateData.careerGoals = this.state.careerGoals;
    updateData.userInterests = this.state.userInterests;
    updateData.isAlumni = this.state.isAlumni;
    updateData.level = this.state.level;
    updateData.academicPlanID = this.state.academicPlanID;
    const compare = this.state.declaredAcademicTerm;
    if ((compare !== '') && (compare)) {
      updateData.declaredAcademicTerm = compare
    }
    
    console.log('updateMethod: firstname', updateData.firstName);
    console.log('updateMethod: collectionName', collectionName);
    console.log('updateMethod: id', updateData.id);
    const bool = updateMethod.call({collectionName, updateData}, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
    console.log('updateMethod return: ', bool);
  }
  
  public handleCancel = () => {
    this.props.dispatch(advisorHomeSetSelectedStudentUsername(''))
  }
  
  public render() {
    return ((this.props.selectedUsername === '') ? '' : this.renderUpdateComponent());
  }
  
  public renderUpdateComponent() {
    if (!this.props.isLoaded) this.prePopulateForm(this.props.usernameDoc)
    const {
      firstName,
      lastName,
      picture,
      website,
      careerGoals,
      userInterests,
      isAlumni,
      level,
      declaredAcademicTerm,
      academicPlanID,
    } = this.state;
    console.log('rendered doc: ', this.props.usernameDoc);
    
    return (
      <Segment>
        <Header as="h4" dividing={true}>UPDATE STUDENT</Header>
        <Form onSubmit={this.handleUpdateSubmit}>
          <Form.Group widths={"equal"}>
            <Form.Input name="username"
                        label={'Username'}
                        value={this.props.usernameDoc.username}
                        disabled={true}/>
            <Form.Input name="role"
                        label={'Role'}
                        value={this.props.usernameDoc.role}
                        disabled={true}/>
          </Form.Group>
          <Form.Group widths={"equal"}>
            <Form.Input name="firstName"
                        label={'First'}
                        onChange={this.handleFormChange}
                        value={firstName}
                        required={true}/>
            <Form.Input name="lastName"
                        label={'Last'}
                        onChange={this.handleFormChange}
                        value={lastName}
                        required={true}/>
          </Form.Group>
          <Header as={"h4"} dividing={true}>Optional fields (all users)</Header>
          <Form.Group widths={"equal"}>
            <Form.Input name="picture"
                        label={
                          <div>
                            Picture (<a onClick={this.handleUploadClick}
                                        href={'javascript:void(0)'}>Upload</a>)
                          </div>}
                        value={picture}/>
            <Form.Input name="website"
                        label={'Website'}
                        onChange={this.handleFormChange}
                        value={website || ''}/>
          </Form.Group>
          <Form.Group widths={"equal"}>
            <Form.Dropdown selection multiple
                           name={'careerGoals'}
                           label={'Select Career Goal(s)'}
                           placeholder={'Select Career Goal(s)'}
                           onChange={this.handleFormChange}
                           options={this.props.careerGoals.map(
                             (ele, i) => ({'key': i, 'text': ele.name, 'value': ele._id}))}
                           value={careerGoals}/>
            <Form.Dropdown selection multiple
                           name={'userInterests'}
                           label={'Select Interest(s)'}
                           placeholder={'Select Interest(s)'}
                           onChange={this.handleFormChange}
                           options={this.props.interests.map(
                             (ele, i) => ({'key': i, 'text': ele.name, 'value': ele._id}))}
                           value={userInterests}/>
          
          </Form.Group>
          <Form.Group widths={"equal"}>
            <Form.Field>
              <Form.Field>
                Is Alumni
              </Form.Field>
              <Form.Field>
                <Radio
                  label={'True'}
                  name={'isAlumni'}
                  value={'true'}
                  checked={isAlumni === true}
                  onChange={this.handleFormChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label={'False'}
                  name={'isAlumni'}
                  value={'false'}
                  checked={isAlumni === false}
                  onChange={this.handleFormChange}
                />
              </Form.Field>
            </Form.Field>
            <Form.Field>
              <Form.Input name="level"
                          label={'Level'}
                          onChange={this.handleFormChange}
                          value={level}/>
            </Form.Field>
          </Form.Group>
          <Form.Group widths={"equal"}>
            <Form.Field>
              <Form.Dropdown name="declaredAcademicTerm"
                             label={'Declared Semester'}
                             selection={true}
                             placeholder={'Select Semester'}
                             onChange={this.handleFormChange}
                             options={AcademicTerms.findNonRetired().map(
                               (ele, i) => ({'key': i, 'text': `${ele.term} ${ele.year}`, 'value': ele._id}))}
                             value={declaredAcademicTerm}/>
            </Form.Field>
            <Form.Field>
              <Form.Dropdown name="academicPlanID"
                             label={'Academic Plan'}
                             selection={true}
                             placeholder={'Select Academic Plan'}
                             onChange={this.handleFormChange}
                             options={AcademicPlans.findNonRetired().map(
                               (ele, i) => ({'key': i, 'text': ele.name, 'value': ele._id}))}
                             value={academicPlanID}/>
            </Form.Field>
          </Form.Group>
          <Form.Group inline={true}>
            <Form.Button content={'Update'} type={'Submit'}/>
            <Form.Button content={'Cancel'} onClick={this.handleCancel}/>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
}

export default connect(mapStateToProps)(AdvisorUpdateStudentWidget);
