import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  DateField,
  TextField,
  LongTextField,
  SelectField,
  NumField,
  BoolField,
  SubmitField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { Feeds } from '../../../../../api/feed/FeedCollection';
import {
  academicTermToName,
  courseToName,
  docToName,
  opportunityIdToName,
  profileToName, userIdToName,
} from '../../../shared/utilities/data-model';
import { IAcademicTerm, ICourse, IOpportunity, IStudentProfile } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';
import { cloudinaryActions } from '../../../../../redux/shared/cloudinary';

interface IUpdateFeedFormProps {
  academicTerms: IAcademicTerm[];
  courses: ICourse[];
  opportunities: IOpportunity[];
  students: IStudentProfile[];
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
  setAdminDataModelFeedsIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setAdminDataModelFeedsCloudinaryUrl: (cloudinaryUrl: string) => any;
}

const mapDispatchToProps = (dispatch: any): unknown => ({
  setAdminDataModelFeedsIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setAdminDataModelFeedsIsCloudinaryUsed(isCloudinaryUsed)),
  setAdminDataModelFeedsCloudinaryUrl: (cloudinaryUrl: string) => dispatch(cloudinaryActions.setAdminDataModelFeedsCloudinaryUrl(cloudinaryUrl)),
});

const UpdateFeedForm = (props: IUpdateFeedFormProps) => {
  const [pictureURL, setPictureURL] = useState(props.collection.findDoc(props.id).picture);

  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        props.setAdminDataModelFeedsIsCloudinaryUsed(true);
        props.setAdminDataModelFeedsCloudinaryUrl(cloudinaryResult.info.url);
        setPictureURL(cloudinaryResult.info.url);
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

  const handlePictureUrlChange = (value) => {
    setPictureURL(value);
  };

  const model = props.collection.findDoc(props.id);
  model.opportunity = opportunityIdToName(model.opportunityID);
  model.users = _.map(model.userIDs, userIdToName);
  // console.log(model);
  const academicTermNames = _.map(props.academicTerms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = _.map(props.courses, courseToName);
  const opportunityNames = _.map(props.opportunities, docToName);
  const studentNames = _.map(props.students, profileToName);
  const schema = new SimpleSchema({
    timestamp: Date,
    feedType: String,
    description: String,
    retired: { type: Boolean, optional: true },
  });
  const newCourseSchema = new SimpleSchema({
    course: { type: String, allowedValues: courseNames, defaultValue: courseNames[22], optional: true },
  });
  const newCourseReviewSchema = new SimpleSchema({
    course: { type: String, allowedValues: courseNames, defaultValue: courseNames[22], optional: true },
    user: { type: String, allowedValues: studentNames, defaultValue: studentNames[0], optional: true },
  });
  const newOpportunitySchema = new SimpleSchema({
    opportunity: {
      type: String,
      allowedValues: opportunityNames,
      defaultValue: opportunityNames[opportunityNames.length / 2],
      optional: true,
    },
  });
  const newOpportunityReviewSchema = new SimpleSchema({
    opportunity: { type: String, allowedValues: opportunityNames, optional: true },
    user: { type: String, allowedValues: studentNames, optional: true },
  });
  const newLevelSchema = new SimpleSchema({
    user: { type: String, allowedValues: studentNames, optional: true },
    level: { type: SimpleSchema.Integer, min: 1, max: 6, defaultValue: 1, optional: true },
  });
  const newUserSchema = new SimpleSchema({
    users: { type: Array, optional: true },
    'users.$': { type: String, allowedValues: studentNames },
    picture: {
      type: String,
      label:
  <React.Fragment>
    Picture (
    <button type="button" onClick={handleUpload}>Upload</button>
    )
  </React.Fragment>,
      defaultValue: model.picture,
      optional: true,
    },
  });
  const verifiedOpportunitySchema = new SimpleSchema({
    user: {
      type: String,
      allowedValues: studentNames,
      optional: true,
    },
    academicTerm: { type: String, allowedValues: academicTermNames, defaultValue: currentTermName, optional: true },
    opportunity: {
      type: String,
      allowedValues: opportunityNames,
      defaultValue: opportunityNames[opportunityNames.length / 2],
      optional: true,
    },
  });
  switch (model.feedType) {
    case Feeds.NEW_USER:
      schema.extend(newUserSchema);
      break;
    case Feeds.NEW_COURSE:
      schema.extend(newCourseSchema);
      break;
    case Feeds.NEW_COURSE_REVIEW:
      schema.extend(newCourseReviewSchema);
      break;
    case Feeds.NEW_LEVEL:
      schema.extend(newLevelSchema);
      break;
    case Feeds.NEW_OPPORTUNITY:
      schema.extend(newOpportunitySchema);
      break;
    case Feeds.NEW_OPPORTUNITY_REVIEW:
      schema.extend(newOpportunityReviewSchema);
      break;
    case Feeds.VERIFIED_OPPORTUNITY:
      schema.extend(verifiedOpportunitySchema);
      break;
    default:
  }
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {props.collection.getType()}
        :
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        ref={props.formRef}
        schema={formSchema}
        model={model}
        onSubmit={props.handleUpdate}
      >
        <Form.Group widths="equal">
          <DateField name="timestamp" disabled />
          <TextField name="feedType" disabled />
        </Form.Group>
        <LongTextField name="description" />
        {model.feedType === Feeds.NEW_COURSE ? (
          <div>
            <Header dividing as="h4">New course field</Header>
            <Form.Group widths="equal">
              <SelectField name="course" />
            </Form.Group>
          </div>
        ) : ''}
        {model.feedType === Feeds.NEW_COURSE_REVIEW ? (
          <div>
            <Header dividing as="h4">New course review fields</Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <SelectField name="course" />
            </Form.Group>
          </div>
        ) : ''}
        {model.feedType === Feeds.NEW_LEVEL ? (
          <div>
            <Header dividing as="h4">New course review fields</Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <NumField name="level" />
            </Form.Group>
          </div>
        ) : ''}
        {model.feedType === Feeds.NEW_OPPORTUNITY ? (
          <div>
            <Header dividing as="h4">New opportunity field</Header>
            <Form.Group widths="equal">
              <SelectField name="opportunity" />
            </Form.Group>
          </div>
        ) : ''}
        {model.feedType === Feeds.NEW_OPPORTUNITY_REVIEW ? (
          <div>
            <Header dividing as="h4">New opportunity review fields</Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <SelectField name="opportunity" />
            </Form.Group>
          </div>
        ) : ''}
        {model.feedType === Feeds.NEW_USER ? (
          <div>
            <Header dividing as="h4">New user fields</Header>
            <Form.Group widths="equal">
              <MultiSelectField name="users" />
              <TextField name="picture" value={pictureURL} onChange={handlePictureUrlChange} />
            </Form.Group>
          </div>
        ) : ''}
        {model.feedType === Feeds.VERIFIED_OPPORTUNITY ? (
          <div>
            <Header dividing as="h4">New verified opportunity fields</Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <SelectField name="opportunity" />
              <SelectField name="academicTerm" />
            </Form.Group>
          </div>
        ) : ''}
        <Form.Group widths="equal">
          <BoolField name="retired" />
        </Form.Group>
        <p />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default connect(null, mapDispatchToProps)(UpdateFeedForm);
