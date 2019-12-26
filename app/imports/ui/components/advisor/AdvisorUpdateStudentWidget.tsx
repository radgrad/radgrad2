import React from 'react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import {
  Segment,
  Header,
  Form,
  Radio,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { RadGrad } from '../../../api/radgrad/RadGrad';
import { defaultCalcLevel } from '../../../api/level/LevelProcessor';
import { setIsLoaded, setSelectedStudentUsername } from '../../../redux/advisor/home/actions';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';

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
  favoriteAcademicPlans: string[];
}

const mapStateToProps = (state) => ({
  selectedUsername: state.advisor.home.selectedUsername,
  isLoaded: state.advisor.home.isLoaded,
});

class AdvisorUpdateStudentWidget extends React.Component<IAdvisorUpdateStudentWidgetProps, IAdvisorUpdateStudentWidgetState> {
  constructor(props) {
    super(props);
    console.log('AdvisorUpdateStudentWidget', props);
    const doc = this.props.usernameDoc;
    const userID = doc.userID;
    const favInterests = FavoriteInterests.findNonRetired({ userID });
    const interestIDs = _.map(favInterests, (fav) => fav.interestID);
    const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
    const careerGoalIDs = _.map(favCareerGoals, (fav) => fav.careerGoalID);
    const favPlans = FavoriteAcademicPlans.findNonRetired({ studentID: userID });
    const favPlanIDs = _.map(favPlans, (fav) => fav.academicPlanID);
    this.state = {
      firstName: doc.firstName,
      lastName: doc.lastName,
      picture: doc.picture,
      website: doc.website,
      careerGoals: careerGoalIDs,
      userInterests: interestIDs,
      isAlumni: doc.isAlumni,
      declaredAcademicTerm: doc.declaredAcademicTerm || '',
      favoriteAcademicPlans: favPlanIDs,
    };
    console.log(this.state);
  }

  private handleUploadClick = async (): Promise<void> => {
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      this.setState({ picture: cloudinaryResult.info.url });
    }
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
      favoriteAcademicPlans: [],
    });
    this.props.dispatch(setIsLoaded(true));
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
    updateData.isAlumni = this.state.isAlumni;
    updateData.level = this.calcLevel();
    updateData.favoriteAcademicPlans = this.state.favoriteAcademicPlans;
    const prop = this.state.declaredAcademicTerm;
    if ((prop !== '') && (prop)) updateData.declaredAcademicTerm = prop;

    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  public handleCancel = () => {
    this.props.dispatch(setSelectedStudentUsername(''));
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
      favoriteAcademicPlans,
    } = this.state;

    return (
      <Segment padded>
        <Header as="h4" dividing>UPDATE STUDENT</Header>
        <Form onSubmit={this.handleUpdateSubmit}>
          <Form.Group widths="equal">
            <Form.Input
              name="username"
              label="Username"
              value={this.props.usernameDoc.username}
              disabled
            />
            <Form.Input
              name="role"
              label="Role"
              value={this.props.usernameDoc.role}
              disabled
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              name="firstName"
              label="First"
              onChange={this.handleFormChange}
              value={firstName}
              required
            />
            <Form.Input
              name="lastName"
              label="Last"
              onChange={this.handleFormChange}
              value={lastName}
              required
            />
          </Form.Group>
          <Header as="h4" dividing>Optional fields (all users)</Header>
          <Form.Group widths="equal">
            <Form.Input
              name="picture"
              label={(
                <React.Fragment>
                          Picture (
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                  <a onClick={this.handleUploadClick}>Upload</a>
)
                </React.Fragment>
)}
              onChange={this.handleFormChange}
              value={picture}
            />
            <Form.Input
              name="website"
              label="Website"
              onChange={this.handleFormChange}
              value={website || ''}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Dropdown
              selection
              multiple
              name="careerGoals"
              label="Select Career Goal(s)"
              placeholder="Select Career Goal(s)"
              onChange={this.handleFormChange}
              options={this.props.careerGoals.map(
                             (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                           )}
              value={careerGoals}
            />
            <Form.Dropdown
              selection
              multiple
              name="userInterests"
              label="Select Interest(s)"
              placeholder="Select Interest(s)"
              onChange={this.handleFormChange}
              options={this.props.interests.map(
                             (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                           )}
              value={userInterests}
            />

          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Field>
                Is Alumni
              </Form.Field>
              <Form.Field>
                <Radio
                  label="True"
                  name="isAlumni"
                  value="true"
                  checked={isAlumni === true}
                  onChange={this.handleFormChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="False"
                  name="isAlumni"
                  value="false"
                  checked={isAlumni === false}
                  onChange={this.handleFormChange}
                />
              </Form.Field>
            </Form.Field>
            <Form.Field>
              <Form.Input
                name="level"
                label="Level"
                onChange={this.handleFormChange}
                value={this.props.usernameDoc.level}
                disabled
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Dropdown
                name="declaredAcademicTerm"
                label="Declared Semester"
                selection
                placeholder="Select Semester"
                onChange={this.handleFormChange}
                options={AcademicTerms.findNonRetired().map(
                               (ele, i) => ({ key: i, text: `${ele.term} ${ele.year}`, value: ele._id }),
                             )}
                value={declaredAcademicTerm}
              />
            </Form.Field>
            <Form.Field>
              <Form.Dropdown
                name="favoriteAcademicPlans"
                label="Academic Plans"
                selection
                multiple
                placeholder="Select Academic Plan"
                onChange={this.handleFormChange}
                options={AcademicPlans.findNonRetired().map(
                               (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
                             )}
                value={favoriteAcademicPlans}
              />
            </Form.Field>
          </Form.Group>
          {// TODO -- Find a way to test RadGrad.calcLevel
          }
          {this.hasNewLevel() ?
            <Segment inverted color="green" secondary><Header as="h3">New Level!!</Header></Segment> : undefined}
          <Form.Group inline>
            <Form.Button content="Update" type="Submit" basic color="green" />
            <Form.Button content="Cancel" onClick={this.handleCancel} basic color="green" />
          </Form.Group>
        </Form>
        <b>{`View ${this.props.usernameDoc.firstName}'s degree plan: `}</b>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          to={`/student/${this.props.usernameDoc.username}/degree-planner/`}
        >
          /student/
          {this.props.usernameDoc.username}
/degree-planner
        </Link>
      </Segment>
    );
  }
}

export default connect(mapStateToProps)(AdvisorUpdateStudentWidget);
