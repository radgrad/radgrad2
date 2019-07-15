import * as React from 'react';
import { Form, Grid, Header } from 'semantic-ui-react';
import { AutoForm, BoolField, SubmitField } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line

interface IStudentShareInfoWidgetProps {
  profile: IStudentProfile;
}

class StudentShareInfoWidget extends React.Component<IStudentShareInfoWidgetProps> {
  constructor(props) {
    super(props);
  }

  private handleUpdateInformation = (doc): void => {
    const updateData = doc;
    updateData.id = doc._id;
    const collectionName = StudentProfiles.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Update Succeeded',
          type: 'success',
          text: 'Your share information was successfully updated.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { profile } = this.props;
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
        <Header as="h4" dividing={true}>Share your Information with others</Header>
        <Grid stackable={true} style={marginTopStyle}>
          <AutoForm schema={schema} model={model} onSubmit={this.handleUpdateInformation}>
            <Form.Group>
              <BoolField name="shareUsername"/>
              <BoolField name="sharePicture"/>
              <BoolField name="shareWebsite"/>
              <BoolField name="shareInterests"/>
              <BoolField name="shareCareerGoals"/>
              <BoolField name="shareAcademicPlan"/>
              <BoolField name="shareCourses"/>
              <BoolField name="shareOpportunities"/>
              <BoolField name="shareLevel"/>
            </Form.Group>

            <SubmitField className="basic green shareInfo" value="Update Share Information"/>
          </AutoForm>
        </Grid>
      </React.Fragment>
    );
  }
}

export default StudentShareInfoWidget;
