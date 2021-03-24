import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, DateField, SelectField, NumField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Feeds } from '../../../../../api/feed/FeedCollection';
import {
  academicTermNameToSlug,
  academicTermToName, courseNameToSlug,
  courseToName,
  docToName, opportunityNameToSlug,
  profileNameToUsername,
  profileToName,
} from '../../../shared/utilities/data-model';
import { AcademicTerm, Course, FeedDefine, Opportunity, StudentProfile } from '../../../../../typings/radgrad';
import { defineCallback } from '../utilities/add-form';

interface AddFeedFromProps {
  academicTerms: AcademicTerm[];
  courses: Course[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

const AddFeedForm: React.FC<AddFeedFromProps> = ({ academicTerms, courses, opportunities, students }) => {
  let formRef;
  const [feedType, setFeedType] = useState(Feeds.NEW_USER);

  const handleModelChange = (model) => {
    const newFeedType = model.feedType;
    setFeedType(newFeedType);
  };

  const handleAdd = (doc) => {
    // console.log('Feeds.handleAdd(%o)', doc);
    const collectionName = Feeds.getCollectionName();
    const definitionData: FeedDefine = doc; // create the definitionData may need to modify doc's values
    definitionData.feedType = doc.feedType;
    switch (doc.feedType) {
      case Feeds.NEW_USER:
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_COURSE:
        definitionData.course = courseNameToSlug(doc.course);
        break;
      case Feeds.NEW_COURSE_REVIEW:
        definitionData.course = courseNameToSlug(doc.course);
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_LEVEL:
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.NEW_OPPORTUNITY:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        break;
      case Feeds.NEW_OPPORTUNITY_REVIEW:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        definitionData.user = profileNameToUsername(doc.user);
        break;
      case Feeds.VERIFIED_OPPORTUNITY:
        definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
        definitionData.user = profileNameToUsername(doc.user);
        definitionData.academicTerm = academicTermNameToSlug(doc.academicTerm);
        break;
      default:
        break;
    }
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };


  const academicTermNames = academicTerms.map(academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = courses.map(courseToName);
  const opportunityNames = opportunities.map(docToName);
  const studentNames = students.map(profileToName);
  const feedTypes = [Feeds.NEW_COURSE, Feeds.NEW_COURSE_REVIEW, Feeds.NEW_LEVEL, Feeds.NEW_OPPORTUNITY, Feeds.NEW_OPPORTUNITY_REVIEW, Feeds.NEW_USER, Feeds.VERIFIED_OPPORTUNITY];
  const schema = new SimpleSchema({
    timestamp: { type: Date, optional: true },
    feedType: {
      type: String,
      allowedValues: feedTypes,
      defaultValue: feedTypes[5],
    },
  });
  const newCourseSchema = new SimpleSchema({
    course: { type: String, allowedValues: courseNames, defaultValue: courseNames[22], optional: true },
  });
  const newCourseReviewSchema = new SimpleSchema({
    course: { type: String, allowedValues: courseNames, defaultValue: courseNames[22], optional: true },
    user: { type: String, allowedValues: studentNames, defaultValue: studentNames[0] },
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
    user: { type: String, allowedValues: studentNames },
  });
  const newLevelSchema = new SimpleSchema({
    user: { type: String, allowedValues: studentNames },
    level: { type: SimpleSchema.Integer, min: 1, max: 6, defaultValue: 1, optional: true },
  });
  const newUserSchema = new SimpleSchema({
    user: { type: String, allowedValues: studentNames },
  });
  const verifiedOpportunitySchema = new SimpleSchema({
    user: {
      type: String,
      allowedValues: studentNames,
    },
    academicTerm: { type: String, allowedValues: academicTermNames, defaultValue: currentTermName, optional: true },
    opportunity: {
      type: String,
      allowedValues: opportunityNames,
      defaultValue: opportunityNames[opportunityNames.length / 2],
      optional: true,
    },
  });
  switch (feedType) {
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
  // console.log(schema);
  return (
    <Segment padded>
      <Header dividing>Add Feed</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError onChangeModel={handleModelChange}>
        <Form.Group widths="equal">
          <DateField name="timestamp" />
          <SelectField name="feedType" />
        </Form.Group>
        {feedType === Feeds.NEW_COURSE ? (
          <div>
            <Header dividing as="h4">
              New course field
            </Header>
            <Form.Group widths="equal">
              <SelectField name="course" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {feedType === Feeds.NEW_COURSE_REVIEW ? (
          <div>
            <Header dividing as="h4">
              New course review fields
            </Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <SelectField name="course" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {feedType === Feeds.NEW_LEVEL ? (
          <div>
            <Header dividing as="h4">
              New course review fields
            </Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <NumField name="level" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {feedType === Feeds.NEW_OPPORTUNITY ? (
          <div>
            <Header dividing as="h4">
              New opportunity field
            </Header>
            <Form.Group widths="equal">
              <SelectField name="opportunity" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {feedType === Feeds.NEW_OPPORTUNITY_REVIEW ? (
          <div>
            <Header dividing as="h4">
              New opportunity review fields
            </Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <SelectField name="opportunity" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {feedType === Feeds.NEW_USER ? (
          <div>
            <Header dividing as="h4">
              New user fields
            </Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {feedType === Feeds.VERIFIED_OPPORTUNITY ? (
          <div>
            <Header dividing as="h4">
              New verified opportunity fields
            </Header>
            <Form.Group widths="equal">
              <SelectField name="user" />
              <SelectField name="opportunity" />
              <SelectField name="academicTerm" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default AddFeedForm;
