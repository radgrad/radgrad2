import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, ErrorsField, LongTextField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { updateMethod } from '../../../../../api/base/BaseCollection.methods';
import { Courses } from '../../../../../api/course/CourseCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { Course, CourseUpdate, Interest } from '../../../../../typings/radgrad';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import PictureField from '../../../form-fields/PictureField';

interface EditCourseButtonProps {
  course: Course;
  courses: Course[];
  interests: Interest[];
}

const EditCourseButton: React.FC<EditCourseButtonProps> = ({ course, courses, interests }) => {
  const [open, setOpen] = useState(false);
  const interestNames = interests.map((interest) => interest.name);
  const courseName = Courses.getName(course._id);
  const model: CourseUpdate = course;
  model.interests = course.interestIDs.map((id) => Interests.findDoc(id).name);

  const handleSubmit = (doc) => {
    // console.log('handleSubmit', doc);
    const collectionName = Courses.getCollectionName();
    const updateData: CourseUpdate = doc;
    updateData.id = doc._id;
    // convert the interest names to IDs for the update
    updateData.interests = doc.interests.map((name) => Interests.findDoc(name)._id);
    // console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .then((result) =>  { RadGradAlert.success('Course Updated', result);})
      .catch((error) => { RadGradAlert.failure('Updated Failed', error.message, error);});
  };

  const updateSchema = new SimpleSchema({
    name: { type: String, optional: true },
    shortName: { type: String, optional: true },
    description: { type: String, optional: true },
    creditHrs: {
      type: SimpleSchema.Integer,
      optional: true,
      min: 1,
      max: 15,
      defaultValue: 3,
    },
    num: { type: String, optional: true },
    picture: { type: String, optional: true },
    interests: Array,
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    syllabus: { type: String, optional: true },
    repeatable: { type: Boolean, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(updateSchema);

  return (
    <Modal key={`${course._id}-modal`}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='green' key={`${course._id}-edit-button`}>EDIT</Button>}>
      <Modal.Header>{`Edit ${courseName}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={formSchema} showInlineError onSubmit={(doc) => {
          handleSubmit(doc);
          setOpen(false);
        }}>
          <Form.Group widths="equal">
            <TextField name="name"/>
            <TextField name="shortName"/>
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="creditHrs" />
            <TextField name="num" />
          </Form.Group>
          <LongTextField name="description"/>
          <MultiSelectField name="interests"/>
          <PictureField name="picture" placeholder='https://mywebsite.com/picture.png' />
          <TextField name="syllabus"/>
          <Form.Group>
            <BoolField name="repeatable"/>
            <BoolField name="retired"/>
          </Form.Group>
          <p/>
          <ErrorsField/>
          <SubmitField/>
          <Button color='red' onClick={() => setOpen(false)}>
                        Cancel
          </Button>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );

};

export default EditCourseButton;
