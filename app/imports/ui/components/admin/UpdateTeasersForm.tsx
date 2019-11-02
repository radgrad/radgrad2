import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicTerm, ICareerGoal, ICourse, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import {
  docToName,
  interestIdToName, itemToSlugName,
  opportunityIdToName,
} from '../shared/data-model-helper-functions';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import MultiSelectField from '../shared/MultiSelectField';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';

interface IUpdateTeaserFormProps {
  careerGoals: ICareerGoal[];
  courses: ICourse[];
  interests: IInterest[];
  opportunities: IOpportunity[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateTeaserForm = (props: IUpdateTeaserFormProps) => {
  const model = props.collection.findDoc(props.id);
  model.slug = itemToSlugName(model);
  model.opportunity = opportunityIdToName(model.opportunityID);
  model.interests = _.map(model.interestIDs, interestIdToName);
  model.youtubeID = model.url;
  const modelSlugAndType = slugIDToSlugNameAndType(model.targetSlugID);
  const interestNames = _.map(this.props.interests, docToName);
  const opportunitySlugs = _.map(this.props.opportunities, docToSlugNameAndType);
  const courseSlugs = _.map(this.props.courses, docToSlugNameAndType);
  const interestSlugs = _.map(this.props.interests, docToSlugNameAndType);
  const careerGoalSlugs = _.map(this.props.careerGoals, docToSlugNameAndType);
  const schema = new SimpleSchema({
    title: String,
    slug: String,
    author: { type: String, optional: true },
    youtubeID: { type: String, optional: true },
    description: { type: String, optional: true },
    duration: { type: String, optional: true },
    interests: {
      type: Array,
      optional: true,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    targetSlug: { type: String, allowedValues: opportunitySlugs.concat(courseSlugs.concat(interestSlugs.concat(careerGoalSlugs))), optional: true, defaultValue: modelSlugAndType },
    retired: { type: Boolean, optional: true },
  });
  return (
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm schema={schema} onSubmit={props.handleUpdate} ref={props.formRef}
                showInlineError={true} model={model}>
        <Form.Group widths="equal">
          <TextField name="title"/>
          <TextField name="slug" disabled={true}/>
          <TextField name="author"/>
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="targetSlug"/>
          <TextField name="youtubeID"/>
          <TextField name="duration"/>
        </Form.Group>
        <LongTextField name="description"/>
        <Form.Group widths="equal">
          <MultiSelectField name="interests"/>
        </Form.Group>
        <BoolField name="retired"/>
        <SubmitField/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

const UpdateTeaserFormContainer = withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  const interests = Interests.findNonRetired({}, { sort: { name: 1 } });
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(UpdateTeaserForm);

export default UpdateTeaserFormContainer;
