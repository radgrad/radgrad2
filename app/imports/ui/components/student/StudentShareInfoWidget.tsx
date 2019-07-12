import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Grid, Header } from 'semantic-ui-react';
import { AutoForm, BoolField, SubmitField } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';

interface IStudentShareInfoWidgetProps {
  match: {
    isExact: boolean;
    path: Boolean;
    url: Boolean;
    params: {
      username: Boolean;
      course: Boolean;
    }
  };
}

class StudentShareInfoWidget extends React.Component<IStudentShareInfoWidgetProps> {
  constructor(props) {
    super(props);
  }

  private handleUpdateInformation = (e): void => {
    e.preventDefault();
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const schema = new SimpleSchema({
      shareUsername: { type: Boolean, label: 'Email', optional: true },
      sharePicture: { type: Boolean, label: 'Picture', optional: true },
      shareWebsite: { type: Boolean, label: 'Website', optional: true },
      shareInterests: { type: Boolean, label: 'Interests', optional: true },
      shareCareerGoals: { type: Boolean, label: 'Career Goals', optional: true },
      shareAcademicPlan: { type: Boolean, label: 'Academic Plan', optional: true },
      shareOpportunities: { type: Boolean, label: 'Courses', optional: true },
      shareCourses: { type: Boolean, label: 'Opportunities', optional: true },
      shareLevel: { type: Boolean, label: 'Level', optional: true },
    });
    return (
      <React.Fragment>
        <Header as="h4" dividing={true}>Share your Information with others</Header>
        <Grid stackable={true}>
          <AutoForm schema={schema} onSubmit={this.handleUpdateInformation}>
            <Form.Group>
              <BoolField name="shareUsername"/>
              <BoolField name="sharePicture"/>
              <BoolField name="shareWebsite"/>
              <BoolField name="shareInterests"/>
              <BoolField name="shareCareerGoals"/>
              <BoolField name="shareAcademicPlan"/>
              <BoolField name="shareOpportunities"/>
              <BoolField name="shareCourses"/>
              <BoolField name="shareLevel"/>
            </Form.Group>

            <SubmitField className="basic green shareInfo" value="Update Share Information"/>
          </AutoForm>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentShareInfoWidget);
