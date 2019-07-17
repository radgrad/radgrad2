import * as React from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import {
  Segment,
  Header,
  Form,
  Radio,
  // eslint-disable-next-line no-unused-vars
  InputOnChangeData, CheckboxProps,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import {
  advisorHomeSetIsLoaded,
  advisorHomeSetSelectedStudentUsername,
} from '../../../redux/actions/pageAdvisorActions';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { RadGrad } from '../../../api/radgrad/RadGrad';
import { defaultCalcLevel } from '../../../api/level/LevelProcessor';
// eslint-disable-next-line no-unused-vars
import { ICareerGoal, IInterest } from '../../../typings/radgrad';

interface IAdvisorUpdateStudentWidgetProps {
  dispatch: (any) => void;
  selectedUsername: string;
  isLoaded: boolean;
  usernameDoc: { [key: string]: any };
  studentCollectionName: string;
  // These are parameters for reactivity
  interests: { [key: string]: any }[];
  careerGoals: { [key: string]: any }[];
}

interface IAdvisorUpdateStudentWidgetState {
  firstName: string;
  lastName: string;
  picture: string;
  website: string;
  careerGoals: string[];
  userInterests: string[];
  isAlumni: boolean;
  declaredAcademicTerm?: string;
  academicPlanID: string;
}

const mapStateToProps = (state) => ({
  selectedUsername: state.advisor.home.selectedUsername,
  isLoaded: state.advisor.home.isLoaded,
});

class AdvisorUpdateStudentWidget extends React.Component<IAdvisorUpdateStudentWidgetProps, IAdvisorUpdateStudentWidgetState> {
  constructor(props) {
    super(props);
    const doc = this.props.usernameDoc;
    this.state = {
      firstName: doc.firstName,
      lastName: doc.lastName,
      picture: doc.picture,
      website: doc.website,
      careerGoals: doc ? doc.careerGoalIDs : [],
      userInterests: doc ? doc.interestIDs : [],
      isAlumni: doc.isAlumni,
      declaredAcademicTerm: doc.declaredAcademicTerm || '',
      academicPlanID: doc.academicPlanID,
    };
  }

  private handleUploadClick = () => {
    openCloudinaryWidget('picture');
  }

  private prePopulateForm = (doc) => {
    this.setState({
      firstName: doc.firstName,
      lastName: doc.lastName,
      picture: doc.picture,
      website: doc.website,
      careerGoals: doc ? doc.careerGoalIDs : [],
      userInterests: doc ? doc.interestIDs : [],
      isAlumni: doc.isAlumni,
      declaredAcademicTerm: doc.declaredAcademicTerm || '',
      academicPlanID: doc.academicPlanID,
    });
    this.props.dispatch(advisorHomeSetIsLoaded(true));
  }

  private handleFormChange = (e, { name, value }: { name: string, value: string }): void => {
    const k = name;
    let v: any = value;
    if (v === 'true' || v === 'false') {
      v = v === 'true';
    }
    const newState = {
      ...this.state,
      [k]: v,
    };

    this.setState(newState);
  }


  // TODO -- find a way to confirm logic behind these calculations (calcLevel & hasNewLevel)
  private calcLevel = () => (RadGrad.calcLevel ? RadGrad.calcLevel(this.props.usernameDoc.userID) : defaultCalcLevel(this.props.usernameDoc.userID));

  private hasNewLevel = () => {
    const student = this.props.usernameDoc;
    // console.log('calcLevel', RadGrad.calcLevel);
    // console.log('radgrad.calcLevel, student.level, defaultCalcLevel()',
    //   RadGrad.calcLevel, student.level, defaultCalcLevel(student.userID));
    return RadGrad.calcLevel ? student.level !== RadGrad.calcLevel(student.userID) : student.level !== defaultCalcLevel(student.userID);
  }

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
    updateData.level = this.calcLevel();
    updateData.academicPlanID = this.state.academicPlanID;
    const prop = this.state.declaredAcademicTerm;
    if ((prop !== '') && (prop)) updateData.declaredAcademicTerm = prop;

    updateMethod.call({ collectionName, updateData }, (error) => {
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
    });
  }

  public handleCancel = () => {
    this.props.dispatch(advisorHomeSetSelectedStudentUsername(''));
  }

  componentDidUpdate(prevProps: Readonly<IAdvisorUpdateStudentWidgetProps>): void {
    const prop = this.props.selectedUsername;
    if ((prop !== prevProps.selectedUsername) && (prop !== '')) this.prePopulateForm(this.props.usernameDoc);
  }

  public render() {
    const {
      firstName,
      lastName,
      picture,
      website,
      careerGoals,
      userInterests,
      isAlumni,
      declaredAcademicTerm,
      academicPlanID,
    } = this.state;

    return (
      <Segment padded={true}>
        <Header as="h4" dividing={true}>UPDATE STUDENT</Header>
        <Form onSubmit={this.handleUpdateSubmit}>
          <Form.Group widths={'equal'}>
            <Form.Input name="username"
                        label={'Username'}
                        value={this.props.usernameDoc.username}
                        disabled={true}/>
            <Form.Input name="role"
                        label={'Role'}
                        value={this.props.usernameDoc.role}
                        disabled={true}/>
          </Form.Group>
          <Form.Group widths={'equal'}>
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
          <Header as={'h4'} dividing={true}>Optional fields (all users)</Header>
          <Form.Group widths={'equal'}>
            <Form.Input name="picture"
                        label={
                          <div>
                            Picture (<a onClick={(e) => {
                            e.preventDefault();
                            this.handleUploadClick();
                          }}
                                        href={''}>Upload</a>)
                          </div>}
                        value={picture}/>
            <Form.Input name="website"
                        label={'Website'}
                        onChange={this.handleFormChange}
                        value={website || ''}/>
          </Form.Group>
          <Form.Group widths={'equal'}>
            <Form.Dropdown selection multiple
                           name={'careerGoals'}
                           label={'Select Career Goal(s)'}
                           placeholder={'Select Career Goal(s)'}
                           onChange={this.handleFormChange}
                           options={this.props.careerGoals.map(
                             (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                           )}
                           value={careerGoals}/>
            <Form.Dropdown selection multiple
                           name={'userInterests'}
                           label={'Select Interest(s)'}
                           placeholder={'Select Interest(s)'}
                           onChange={this.handleFormChange}
                           options={this.props.interests.map(
                             (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                           )}
                           value={userInterests}/>

          </Form.Group>
          <Form.Group widths={'equal'}>
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
                          value={this.props.usernameDoc.level}
                          disabled={true}/>
            </Form.Field>
          </Form.Group>
          <Form.Group widths={'equal'}>
            <Form.Field>
              <Form.Dropdown name="declaredAcademicTerm"
                             label={'Declared Semester'}
                             selection={true}
                             placeholder={'Select Semester'}
                             onChange={this.handleFormChange}
                             options={AcademicTerms.findNonRetired().map(
                               (ele, i) => ({ key: i, text: `${ele.term} ${ele.year}`, value: ele._id }),
                             )}
                             value={declaredAcademicTerm}/>
            </Form.Field>
            <Form.Field>
              <Form.Dropdown name="academicPlanID"
                             label={'Academic Plan'}
                             selection={true}
                             placeholder={'Select Academic Plan'}
                             onChange={this.handleFormChange}
                             options={AcademicPlans.findNonRetired().map(
                               (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                             )}
                             value={academicPlanID}/>
            </Form.Field>
          </Form.Group>
          {// TODO -- Find a way to test RadGrad.calcLevel
          }
          {this.hasNewLevel() ?
            <Segment inverted color={'green'} secondary><Header as={'h3'}>New Level!!</Header></Segment> : undefined}
          <Form.Group inline={true}>
            <Form.Button content={'Update'} type={'Submit'} basic={true} color={'green'}/>
            <Form.Button content={'Cancel'} onClick={this.handleCancel} basic={true} color={'green'}/>
          </Form.Group>
        </Form>
        <b>{`View ${this.props.usernameDoc.firstName}'s degree plan: `}</b>
        <Link
          target={'blank'}
          rel={'noopener noreferrer'}
          to={`/student/${this.props.usernameDoc.username}/degree-planner/`}>
          /student/{this.props.usernameDoc.username}/degree-planner
        </Link>
      </Segment>
    );
  }
}

export default connect(mapStateToProps)(AdvisorUpdateStudentWidget);
