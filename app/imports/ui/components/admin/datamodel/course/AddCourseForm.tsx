import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, NumField, LongTextField, SubmitField, BoolField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Courses } from '../../../../../api/course/CourseCollection';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { Course, CourseDefine, Interest } from '../../../../../typings/radgrad';
import PictureField from '../../../form-fields/PictureField';
import { docToName } from '../../../shared/utilities/data-model';
import { interestSlugFromName } from '../../../shared/utilities/form';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';

interface AddCourseFormProps {
  interests: Interest[];
  courses: Course[];
}
const AddCourseForm: React.FC<AddCourseFormProps> = ({ interests, courses }) => {
  let formRef;
  const handleAdd = (doc) => {
    // console.log('CoursePage.handleAdd(%o)', doc);
    const collectionName = Courses.getCollectionName();
    const definitionData: CourseDefine = { name: doc.name, slug: doc.slug, num: doc.num, description: doc.description }; // create the definitionData may need to modify doc's values
    definitionData.interests = doc.interests.map(interestSlugFromName);
    if (doc.shortName) {
      definitionData.shortName = doc.shortName;
    } else {
      definitionData.shortName = doc.name;
    }
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Course', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Course Succeeded');
        formRef?.reset();
      });
  };

  const interestNames = interests.map(docToName);

  // console.log(interestNames);
  const schema = new SimpleSchema({
    slug: String,
    name: String,
    shortName: { type: String, optional: true },
    creditHours: {
      type: SimpleSchema.Integer,
      optional: true,
      min: 1,
      max: 15,
      defaultValue: 3,
    },
    num: String,
    description: String,
    syllabus: { type: String, optional: true },
    picture: { type: String, optional: true },
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
      // optional: true,
    },
    repeatable: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Course</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField id={COMPONENTIDS.DATA_MODEL_SLUG} name="slug" placeholder="dept_111" />
          <TextField id={COMPONENTIDS.DATA_MODEL_NAME} name="name" placeholder="Introduction to Science" />
        </Form.Group>
        <Form.Group widths="equal">
          <TextField id={COMPONENTIDS.DATA_MODEL_SHORT_NAME} name="shortName" placeholder="Introduction to Science" />
          <NumField id={COMPONENTIDS.DATA_MODEL_CREDIT_HOURS} name="creditHours" />
          <TextField id={COMPONENTIDS.DATA_MODEL_NUM} name="num" placeholder="DEPT 111" />
        </Form.Group>
        <LongTextField id={COMPONENTIDS.DATA_MODEL_DESCRIPTION} name="description" />
        <PictureField id={COMPONENTIDS.DATA_MODEL_PICTURE} name="picture" placeholder='https://mywebsite.com/picture.png' />
        <TextField id={COMPONENTIDS.DATA_MODEL_SYLLABUS} name="syllabus" placeholder="https://dept.foo.edu/dept_111/syllabus.html" />
        <Form.Group widths="equal">
          <MultiSelectField id={COMPONENTIDS.DATA_MODEL_INTERESTS} name="interests" placeholder="Select Interest(s)" />
        </Form.Group>
        <BoolField id={COMPONENTIDS.DATA_MODEL_REPEATABLE} name="repeatable" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddCourseForm;
