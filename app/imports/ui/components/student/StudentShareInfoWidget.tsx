import React from 'react';
import { Form, Grid, Header } from 'semantic-ui-react';
import { AutoForm, BoolField, SubmitField } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IStudentProfile } from '../../../typings/radgrad';
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';


interface IStudentShareInfoWidgetProps {
  profile: IStudentProfile;
}

const handleUpdateInformation = (doc): void => {
  const updateData = doc;
  updateData.id = doc._id;
  const collectionName = StudentProfiles.getCollectionName();
  const username = doc.username;
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      Swal.fire({
        title: 'Update Failed',
        text: error.message,
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Update Succeeded',
        icon: 'success',
        text: 'Your share information was successfully updated.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      // Define a user interaction that describes a user updating their share information
      const keys = ['shareUsername', 'sharePicture', 'shareWebsite', 'shareInterests', 'shareCareerGoals', 'shareAcademicPlan', 'shareCourses', 'shareOpportunities', 'shareLevel'];
      const modifiedList = [];
      const previousStudentProfileData = StudentProfiles.findNonRetired({ username });
      if (previousStudentProfileData.length > 1) {
        console.log(`Error creating a UserInteraction: Found more than one student profile with the same username: ${username}`);
        return;
      }
      // For the type data, we only record the specific information that was modified
      keys.forEach((key, index) => {
        if (doc[key] !== previousStudentProfileData[0][key]) {
          modifiedList.push(`${key}:${doc[key]}`);
        }
      });
      const interactionData: UserInteractionsDataType = {
        username,
        type: UserInteractionsTypes.SHAREINFORMATION,
        typeData: modifiedList,
      };
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.log('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
};

const StudentShareInfoWidget = (props: IStudentShareInfoWidgetProps) => {
  const { profile } = props;
  const marginTopStyle = { marginTop: 10 };
  const model = profile;
  const schema = new SimpleSchema({
    shareUsername: {
      type: Boolean,
      label: 'Email',
      optional: true,
    },
    sharePicture: {
      type: Boolean,
      label: 'Picture',
      optional: true,
    },
    shareWebsite: {
      type: Boolean,
      label: 'Website',
      optional: true,
    },
    shareInterests: {
      type: Boolean,
      label: 'Interests',
      optional: true,
    },
    shareCareerGoals: {
      type: Boolean,
      label: 'Career Goals',
      optional: true,
    },
    shareAcademicPlan: {
      type: Boolean,
      label: 'Academic Plan',
      optional: true,
    },
    shareOpportunities: {
      type: Boolean,
      label: 'Opportunities',
      optional: true,
    },
    shareCourses: {
      type: Boolean,
      label: 'Courses',
      optional: true,
    },
    shareLevel: {
      type: Boolean,
      label: 'Level',
      optional: true,
    },
  });

  return (
    <React.Fragment>
      <Header as="h4" dividing>Share your Information with others</Header>
      <Grid stackable style={marginTopStyle}>
        <AutoForm schema={schema} model={model} onSubmit={handleUpdateInformation}>
          <Form.Group>
            <BoolField name="shareUsername" />
            <BoolField name="sharePicture" />
            <BoolField name="shareWebsite" />
            <BoolField name="shareInterests" />
            <BoolField name="shareCareerGoals" />
            <BoolField name="shareAcademicPlan" />
            <BoolField name="shareCourses" />
            <BoolField name="shareOpportunities" />
            <BoolField name="shareLevel" />
          </Form.Group>

          <SubmitField
            className="basic green shareInfo"
            value="Update Share Information"
            disabled={false}
            inputRef={undefined}
          />
        </AutoForm>
      </Grid>
    </React.Fragment>
  );
};

export default StudentShareInfoWidget;
