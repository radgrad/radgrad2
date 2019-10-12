import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import DateField from 'uniforms-semantic/DateField';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumberField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import {
  academicTermToName,
  courseToName,
  docToName,
  opportunityIdToName,
  profileToName, userIdToName,
} from '../shared/data-model-helper-functions';
import { IAcademicTerm, ICourse, IOpportunity, IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import MultiSelectField from '../shared/MultiSelectField';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { ReduxState } from '../../../redux/store'; // eslint-disable-line
import { cloudinaryActions } from '../../../redux/shared/cloudinary';
import {
  SET_ADMIN_DATAMODEL_FEEDS_CLOUDINARY_URL,
  SET_ADMIN_DATAMODEL_FEEDS_IS_CLOUDINARY_USED,
} from '../../../redux/shared/cloudinary/types';

interface IUpdateFeedFormProps {
  academicTerms: IAcademicTerm[];
  courses: ICourse[];
  opportunities: IOpportunity[];
  students: IStudentProfile[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
  setIsCloudinaryUsed: (type: string, isCloudinaryUsed: boolean) => any;
  setCloudinaryUrl: (type: string, cloudinaryUrl: string) => any;
}

interface IUpdateFeedFormState {
  pictureURL: string;
}

const mapDispatchToProps = (dispatch: any): object => ({
  setIsCloudinaryUsed: (type: string, isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setIsCloudinaryUsed(type, isCloudinaryUsed)),
  setCloudinaryUrl: (type: string, cloudinaryUrl: string) => dispatch(cloudinaryActions.setCloudinaryUrl(type, cloudinaryUrl)),
});

class UpdateFeedForm extends React.Component<IUpdateFeedFormProps, IUpdateFeedFormState> {
  constructor(props) {
    super(props);
    this.state = {
      pictureURL: this.props.collection.findDoc(this.props.id).picture,
    };
  }

  private handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      this.props.setIsCloudinaryUsed(SET_ADMIN_DATAMODEL_FEEDS_IS_CLOUDINARY_USED, true);
      this.props.setCloudinaryUrl(SET_ADMIN_DATAMODEL_FEEDS_CLOUDINARY_URL, cloudinaryResult.info.url);
      this.setState({ pictureURL: cloudinaryResult.info.url });
    }
  }

  private handlePictureUrlChange = (value) => {
    this.setState({ pictureURL: value });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.collection.findDoc(this.props.id);
    model.opportunity = opportunityIdToName(model.opportunityID);
    model.users = _.map(model.userIDs, userIdToName);
    // console.log(model);
    const academicTermNames = _.map(this.props.academicTerms, academicTermToName);
    const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
    const courseNames = _.map(this.props.courses, courseToName);
    const opportunityNames = _.map(this.props.opportunities, docToName);
    const studentNames = _.map(this.props.students, profileToName);
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
        label: <React.Fragment>Picture (<a onClick={this.handleUpload}>Upload</a>)</React.Fragment>,
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
    const { pictureURL } = this.state;
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm
          ref={this.props.formRef}
          schema={schema}
          model={model}
          onSubmit={this.props.handleUpdate}>
          <Form.Group widths="equal">
            <DateField name="timestamp" disabled={true}/>
            <TextField name="feedType" disabled={true}/>
          </Form.Group>
          <LongTextField name="description"/>
          {model.feedType === Feeds.NEW_COURSE ? (
            <div>
              <Header dividing={true} as="h4">New course field</Header>
              <Form.Group widths="equal">
                <SelectField name="course"/>
              </Form.Group>
            </div>
          ) : ''}
          {model.feedType === Feeds.NEW_COURSE_REVIEW ? (
            <div>
              <Header dividing={true} as="h4">New course review fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <SelectField name="course"/>
              </Form.Group>
            </div>
          ) : ''}
          {model.feedType === Feeds.NEW_LEVEL ? (
            <div>
              <Header dividing={true} as="h4">New course review fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <NumberField name="level"/>
              </Form.Group>
            </div>
          ) : ''}
          {model.feedType === Feeds.NEW_OPPORTUNITY ? (
            <div>
              <Header dividing={true} as="h4">New opportunity field</Header>
              <Form.Group widths="equal">
                <SelectField name="opportunity"/>
              </Form.Group>
            </div>
          ) : ''}
          {model.feedType === Feeds.NEW_OPPORTUNITY_REVIEW ? (
            <div>
              <Header dividing={true} as="h4">New opportunity review fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <SelectField name="opportunity"/>
              </Form.Group>
            </div>
          ) : ''}
          {model.feedType === Feeds.NEW_USER ? (
            <div>
              <Header dividing={true} as="h4">New user fields</Header>
              <Form.Group widths="equal">
                <MultiSelectField name="users"/>
                <TextField name="picture" value={pictureURL} onChange={this.handlePictureUrlChange}/>
              </Form.Group>
            </div>
          ) : ''}
          {model.feedType === Feeds.VERIFIED_OPPORTUNITY ? (
            <div>
              <Header dividing={true} as="h4">New verified opportunity fields</Header>
              <Form.Group widths="equal">
                <SelectField name="user"/>
                <SelectField name="opportunity"/>
                <SelectField name="academicTerm"/>
              </Form.Group>
            </div>
          ) : ''}
          <Form.Group widths="equal">
            <BoolField name="retired"/>
          </Form.Group>
          <p/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateFeedFormContainer = withTracker(() => ({
  academicTerms: AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch(),
  courses: Courses.find({}, { sort: { num: 1 } }).fetch(),
  opportunities: Opportunities.find({}, { sort: { name: 1 } }).fetch(),
  students: StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
}))(UpdateFeedForm);

export default connect(null, mapDispatchToProps)(UpdateFeedFormContainer);
