import * as React from 'react';
import { Tab, Header, Form, Radio } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
// eslint-disable-next-line no-unused-vars
import { ICareerGoal, IInterest } from '../../../typings/radgrad';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';

export interface IAdvisorAddStudentWidgetProps {
  // These are parameters for reactivity
  interests: IInterest[];
  careerGoals: ICareerGoal[];
}

export interface IAdvisorAddStudentWidgetState {
  firstName: string;
  lastName: string;
  username: string;
  isAlumni: boolean;
  picture: string;
  website: string;
  careerGoals: string[];
  userInterests: string[];
  declaredAcademicTerm: string;
  academicPlanID: string;
}

class AdvisorAddStudentWidget extends React.Component<IAdvisorAddStudentWidgetProps, IAdvisorAddStudentWidgetState> {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    isAlumni: false,
    picture: undefined,
    website: undefined,
    careerGoals: [],
    userInterests: [],
    declaredAcademicTerm: undefined,
    academicPlanID: undefined,
  };

  private handleFormChange = (e, { name, value }) => {
    const k = name;
    let v = value;
    if (v === 'true' || v === 'false') {
      v = v === 'true';
    }
    const newState = {
      ...this.state,
      [k]: v,
    };

    this.setState(newState);
  }

  private onSubmit = () => {
    const collectionName: string = StudentProfiles.getCollectionName();
    const definitionData: any = {};
    definitionData.firstName = this.state.firstName;
    definitionData.lastName = this.state.lastName;
    definitionData.username = this.state.username;
    definitionData.isAlumni = this.state.isAlumni;
    definitionData.picture = this.state.picture;
    definitionData.website = this.state.website;
    definitionData.careerGoals = this.state.careerGoals;
    definitionData.userInterests = this.state.userInterests;
    definitionData.declaredAcademicTerm = this.state.declaredAcademicTerm;
    definitionData.academicPlanID = this.state.academicPlanID;
    definitionData.level = 1;

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed adding User', error);
        Swal.fire({
          title: 'Failed adding User',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add User Succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        const feedData = { feedType: Feeds.NEW_USER, user: definitionData.username };
        defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
        this.setState({
          firstName: '',
          lastName: '',
          username: '',
          isAlumni: false,
          picture: undefined,
          website: undefined,
          careerGoals: [],
          userInterests: [],
          declaredAcademicTerm: undefined,
          academicPlanID: undefined,
        });
      }
    });
  }

  private handleUploadClick = async (): Promise<void> => {
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      this.setState({ picture: cloudinaryResult.info.url });
    }
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {
      firstName,
      lastName,
      username,
      isAlumni,
      picture,
      website,
      careerGoals,
      userInterests,
      declaredAcademicTerm,
      academicPlanID,
    } = this.state;
    return (
      <Tab.Pane key={'new'}>
        <Header as="h4" dividing={true}>ADD STUDENT</Header>
        <Form widths={'equal'} onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Field>
              <Form.Input name={'firstName'}
                          label={'First Name'}
                          value={firstName}
                          onChange={this.handleFormChange}
                          required/>
            </Form.Field>
            <Form.Field>
              <Form.Input name={'lastName'}
                          label={'Last Name'}
                          value={lastName}
                          onChange={this.handleFormChange}
                          required/>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <Form.Input name={'username'}
                          label={'Username'}
                          value={username}
                          onChange={this.handleFormChange}
                          required/>
            </Form.Field>
            <Form.Field>
              <Form.Field>
                Alumni
              </Form.Field>
              <Form.Field>
                <Radio
                  name={'isAlumni'}
                  label={'True'}
                  value={'true'}
                  onChange={this.handleFormChange}
                  checked={isAlumni === true}
                  required
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  name={'isAlumni'}
                  label={'False'}
                  value={'false'}
                  onChange={this.handleFormChange}
                  checked={isAlumni === false}
                  required
                />
              </Form.Field>
            </Form.Field>
          </Form.Group>
          <Header as={'h4'} dividing={true}>Optional Fields</Header>
          <Form.Group>
            <Form.Field>
              <Form.Input name="picture"
                          label={<React.Fragment>
                            Picture (<a onClick={this.handleUploadClick}>Upload</a>)
                          </React.Fragment>}
                          onChange={this.handleFormChange}
                          value={picture || ''}/>
            </Form.Field>
            <Form.Field>
              <Form.Input name={'website'}
                          label={'Website'}
                          value={website || ''}
                          onChange={this.handleFormChange}/>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Dropdown selection multiple
                           name={'careerGoals'}
                           label={'Select Career Goal(s)'}
                           value={careerGoals}
                           onChange={this.handleFormChange}
                           options={this.props.careerGoals.map(
                             (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                           )}
                           placeholder={'Select Career Goal(s)'}/>
            <Form.Dropdown selection multiple
                           name={'userInterests'}
                           label={'Select Interest(s)'}
                           value={userInterests}
                           onChange={this.handleFormChange}
                           options={this.props.interests.map(
                             (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                           )}
                           placeholder={'Select Interest(s)'}/>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <Form.Dropdown name="declaredAcademicTerm"
                             label={'Declared Semester'}
                             value={declaredAcademicTerm}
                             onChange={this.handleFormChange}
                             options={AcademicTerms.findNonRetired().map(
                               (ele, i) => ({ key: i, text: `${ele.term} ${ele.year}`, value: ele._id }),
                             )}
                             selection={true}
                             placeholder={'Select Semester'}/>
            </Form.Field>
            <Form.Field>
              <Form.Dropdown selection
                             name="academicPlanID"
                             label={'Academic Plan'}
                             value={academicPlanID}
                             onChange={this.handleFormChange}
                             options={AcademicPlans.findNonRetired().map(
                               (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                             )}
                             placeholder={'Select Academic Plan'}/>
            </Form.Field>
          </Form.Group>
          <Form.Button basic color={'green'} content={'Add'} type={'Submit'}/>
        </Form>
      </Tab.Pane>
    );
  }
}

export default AdvisorAddStudentWidget;
