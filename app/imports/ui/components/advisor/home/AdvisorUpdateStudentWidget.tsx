import React, { useState } from 'react';
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
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { openCloudinaryWidget } from '../../shared/OpenCloudinaryWidget';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { RadGrad } from '../../../../api/radgrad/RadGrad';
import { defaultCalcLevel } from '../../../../api/level/LevelProcessor';
import { setSelectedStudentUsername } from '../../../../redux/advisor/home/actions';
import { FavoriteInterests } from '../../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../../api/favorite/FavoriteCareerGoalCollection';
import { RootState } from '../../../../redux/types';
import { BaseProfile, CareerGoal, Interest } from '../../../../typings/radgrad';

interface AdvisorUpdateStudentWidgetProps {
  dispatch: (any) => void;
  selectedUsername: string;
  isLoaded: boolean;
  usernameDoc: BaseProfile;
  studentCollectionName: string;
  interests: Interest[];
  careerGoals: CareerGoal[];
}

const mapStateToProps = (state: RootState) => ({
  selectedUsername: state.advisor.home.selectedUsername,
  isLoaded: state.advisor.home.isLoaded,
});

const AdvisorUpdateStudentWidget: React.FC<AdvisorUpdateStudentWidgetProps> = ({ dispatch, interests, careerGoals, usernameDoc, isLoaded, selectedUsername, studentCollectionName }) => {
  // console.log('AdvisorUpdateStudentWidget', props);
  const doc = usernameDoc;
  const userID = doc.userID;
  const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
  const careerGoalIDs = _.map(favCareerGoals, (fav) => fav.careerGoalID);
  const favInterests = FavoriteInterests.findNonRetired({ userID });
  const interestIDs = _.map(favInterests, (fav) => fav.interestID);
  const [firstNameState, setFirstName] = useState(doc.firstName);
  const [lastNameState, setLastName] = useState(doc.lastName);
  const [pictureState, setPicture] = useState(doc.picture);
  const [websiteState, setWebsite] = useState(doc.website);
  const [careerGoalsState, setCareerGoals] = useState(careerGoalIDs);
  const [userInterestsState, setUserInterests] = useState(interestIDs);
  const [isAlumniState, setIsAlumni] = useState(doc.isAlumni);
  const [declaredAcademicTermState, setDeclaredAcademicTerm] = useState(doc.declaredAcademicTermID || '');

  const handleUploadClick = async (): Promise<void> => {
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        setPicture(cloudinaryResult.info.url);
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed to Upload Photo',
        icon: 'error',
        text: error.statusText,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  const handleFormChange = (e, { name, value }): void => {
    // console.log(`handleFormChange name=${name}`, value);
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'picture':
        setPicture(value);
        break;
      case 'website':
        setWebsite(value);
        break;
      case 'careerGoals':
        setCareerGoals(value);
        break;
      case 'userInterests':
        setUserInterests(value);
        break;
      case 'isAlumni':
        setIsAlumni(value === 'true');
        break;
      case 'declaredAcademicTerm':
        setDeclaredAcademicTerm(value);
        break;
      default:
      // do nothing
    }
  };

  // TODO -- find a way to confirm logic behind these calculations (calcLevel & hasNewLevel)
  const calcLevel = () => (RadGrad.calcLevel ? RadGrad.calcLevel(usernameDoc.userID) : defaultCalcLevel(usernameDoc.userID));

  const hasNewLevel = () => {
    const student = usernameDoc;
    // console.log('calcLevel', RadGrad.calcLevel);
    // console.log('radgrad.calcLevel, student.level, defaultCalcLevel()',
    //   RadGrad.calcLevel, student.level, defaultCalcLevel(student.userID));
    return RadGrad.calcLevel ? student.level !== RadGrad.calcLevel(student.userID) : student.level !== defaultCalcLevel(student.userID);
  };

  const handleUpdateSubmit = () => {
    const collectionName = studentCollectionName;
    const updateData: any = {};
    updateData.firstName = firstNameState;
    updateData.id = usernameDoc._id;
    updateData.lastName = lastNameState;
    updateData.picture = pictureState;
    updateData.website = websiteState;
    updateData.isAlumni = isAlumniState;
    updateData.level = calcLevel();
    const prop = declaredAcademicTermState;
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
  };

  const handleCancel = () => {
    dispatch(setSelectedStudentUsername(''));
  };

  return (
    <Segment padded>
      <Header as="h4" dividing>UPDATE STUDENT</Header>
      <Form onSubmit={handleUpdateSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            name="username"
            label="Username"
            value={usernameDoc.username}
            disabled
          />
          <Form.Input
            name="role"
            label="Role"
            value={usernameDoc.role}
            disabled
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            name="firstName"
            label="First"
            onChange={handleFormChange}
            value={firstNameState}
            required
          />
          <Form.Input
            name="lastName"
            label="Last"
            onChange={handleFormChange}
            value={lastNameState}
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
                <button type="button" onClick={handleUploadClick}>Upload</button>
                )
              </React.Fragment>
            )}
            onChange={handleFormChange}
            value={pictureState}
          />
          <Form.Input
            name="website"
            label="Website"
            onChange={handleFormChange}
            value={websiteState || ''}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Dropdown
            selection
            multiple
            name="careerGoals"
            label="Select Career Goal(s)"
            placeholder="Select Career Goal(s)"
            onChange={handleFormChange}
            options={careerGoals.map(
              (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
            )}
            value={careerGoalsState}
          />
          <Form.Dropdown
            selection
            multiple
            name="userInterests"
            label="Select Interest(s)"
            placeholder="Select Interest(s)"
            onChange={handleFormChange}
            options={interests.map(
              (ele, i) => ({ key: i, text: ele.name, value: ele._id }),
            )}
            value={userInterestsState}
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
                checked={isAlumniState === true}
                onChange={handleFormChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="False"
                name="isAlumni"
                value="false"
                checked={isAlumniState === false}
                onChange={handleFormChange}
              />
            </Form.Field>
          </Form.Field>
          <Form.Field>
            <Form.Input
              name="level"
              label="Level"
              onChange={handleFormChange}
              value={usernameDoc.level}
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
              onChange={handleFormChange}
              options={AcademicTerms.findNonRetired().map(
                (ele, i) => ({ key: i, text: `${ele.term} ${ele.year}`, value: ele._id }),
              )}
              value={declaredAcademicTermState}
            />
          </Form.Field>
        </Form.Group>
        {// TODO -- Find a way to test RadGrad.calcLevel
        }
        {hasNewLevel() ?
          <Segment inverted color="green" secondary><Header as="h3">New Level!!</Header></Segment> : undefined}
        <Form.Group inline>
          <Form.Button content="Update" type="Submit" basic color="green" />
          <Form.Button content="Cancel" onClick={handleCancel} basic color="green" />
        </Form.Group>
      </Form>
      <b>{`View ${usernameDoc.firstName}'s degree plan: `}</b>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        to={`/student/${usernameDoc.username}/degree-planner/`}
      >
        /student/
        {usernameDoc.username}
        /degree-planner
      </Link>
    </Segment>
  );
};

export default connect(mapStateToProps)(AdvisorUpdateStudentWidget);
