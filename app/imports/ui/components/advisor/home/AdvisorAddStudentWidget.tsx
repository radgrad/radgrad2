import React, { useState } from 'react';
import { Tab, Header, Form, Radio } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Feeds } from '../../../../api/feed/FeedCollection';
import { CareerGoal, Interest } from '../../../../typings/radgrad';
import { openCloudinaryWidget } from '../../shared/OpenCloudinaryWidget';

export interface AdvisorAddStudentWidgetProps {
  interests: Interest[];
  careerGoals: CareerGoal[];
}

const AdvisorAddStudentWidget: React.FC<AdvisorAddStudentWidgetProps> = ({ interests, careerGoals }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isAlumni, setIsAlumni] = useState(false);
  const [picture, setPicture] = useState(undefined);
  const [website, setWebsite] = useState(undefined);
  const [careerGoalsState, setCareerGoals] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [declaredAcademicTerm, setDeclaredAcademicTerm] = useState(undefined);

  const handleFormChange = (e, { name, value }) => {
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'isAlumni':
        setIsAlumni(value === 'true');
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
      case 'declaredAcademicTerm':
        setDeclaredAcademicTerm(value);
        break;
      default:
    }
  };

  const onSubmit = () => {
    const collectionName: string = StudentProfiles.getCollectionName();
    const definitionData: any = {};
    definitionData.firstName = firstName;
    definitionData.lastName = lastName;
    definitionData.username = username;
    definitionData.isAlumni = isAlumni;
    definitionData.picture = picture;
    definitionData.website = website;
    definitionData.careerGoals = careerGoalsState;
    definitionData.userInterests = userInterests;
    definitionData.declaredAcademicTerm = declaredAcademicTerm;
    definitionData.level = 1;

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed adding User', error);
        Swal.fire({
          title: 'Failed adding User',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add User Succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        const feedData = { feedType: Feeds.NEW_USER, user: definitionData.username };
        defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
        setFirstName('');
        setLastName('');
        setUsername('');
        setIsAlumni(false);
        setPicture(undefined);
        setWebsite(undefined);
        setCareerGoals([]);
        setUserInterests([]);
        setDeclaredAcademicTerm(undefined);
      }
    });
  };

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

  return (
    <Tab.Pane key="new">
      <Header as="h4" dividing>
        ADD STUDENT
      </Header>
      {/* TODO should we be using Uniforms? */}
      <Form widths="equal" onSubmit={onSubmit}>
        <Form.Group>
          <Form.Field>
            <Form.Input name="firstName" label="First Name" value={firstName} onChange={handleFormChange} required />
          </Form.Field>
          <Form.Field>
            <Form.Input name="lastName" label="Last Name" value={lastName} onChange={handleFormChange} required />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <Form.Input name="username" label="Username" value={username} onChange={handleFormChange} required />
          </Form.Field>
          <Form.Field>
            <Form.Field>Alumni</Form.Field>
            <Form.Field>
              <Radio name="isAlumni" label="True" value="true" onChange={handleFormChange} checked={isAlumni === true} required />
            </Form.Field>
            <Form.Field>
              <Radio name="isAlumni" label="False" value="false" onChange={handleFormChange} checked={isAlumni === false} required />
            </Form.Field>
          </Form.Field>
        </Form.Group>
        <Header as="h4" dividing>
          Optional Fields
        </Header>
        <Form.Group>
          <Form.Field>
            <Form.Input
              name="picture"
              label={
                <React.Fragment>
                  Picture (
                  <button type="button" onClick={handleUploadClick}>
                    Upload
                  </button>
                  )
                </React.Fragment>
              }
              onChange={handleFormChange}
              value={picture || ''}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input name="website" label="Website" value={website || ''} onChange={handleFormChange} />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Dropdown
            selection
            multiple
            name="careerGoals"
            label="Select Career Goal(s)"
            value={careerGoalsState}
            onChange={handleFormChange}
            options={careerGoals.map((ele, i) => ({ key: i, text: ele.name, value: ele._id }))}
            placeholder="Select Career Goal(s)"
          />
          <Form.Dropdown
            selection
            multiple
            name="userInterests"
            label="Select Interest(s)"
            value={userInterests}
            onChange={handleFormChange}
            options={interests.map((ele, i) => ({ key: i, text: ele.name, value: ele._id }))}
            placeholder="Select Interest(s)"
          />
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <Form.Dropdown
              name="declaredAcademicTerm"
              label="Declared Academic Term"
              value={declaredAcademicTerm}
              onChange={handleFormChange}
              options={AcademicTerms.findNonRetired().map((ele, i) => ({ key: i, text: `${ele.term} ${ele.year}`, value: ele._id }))}
              selection
              placeholder="Select AcademicTerm"
            />
          </Form.Field>
        </Form.Group>
        <Form.Button basic color="green" content="Add" type="Submit" />
      </Form>
    </Tab.Pane>
  );
};

export default AdvisorAddStudentWidget;
