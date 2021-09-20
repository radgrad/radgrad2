import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, NumField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Internships } from '../../../../../api/internship/InternshipCollection';
import { Interest, InternshipDefine, Location } from '../../../../../typings/radgrad';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import RadGradSegment from '../../../shared/RadGradSegment';
import { docToName } from '../../../shared/utilities/data-model';
import { interestSlugFromName } from '../../../shared/utilities/form';

interface AddInternshipFormProps {
  interests: Interest[];
}

const locationSchema = new SimpleSchema({
  city: { type: String, optional: true },
  country: { type: String, optional: true },
  state: { type: String, optional: true },
  zip: { type: String, optional: true },
});

const AddInternshipForm: React.FC<AddInternshipFormProps> = ({ interests }) => {
  const interestNames = interests.map(docToName);
  let formRef;
  const handleAdd = (doc) => {
    const collectionName = Internships.getCollectionName();
    const definitionData: InternshipDefine = {
      urls: doc.urls,
      interests: doc.interests.map(interestSlugFromName),
      description: doc.description,
      position: doc.position,
      lastScraped: new Date(),
      missedUploads: 0,
      company: doc.company,
      location: [doc.location],
      // contact?: string;
      // posted?: string;
      // due?: string;
    };
    defineMethod
      .callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Opportunity', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Opportunity Succeeded');
        formRef?.reset(); // CAM getting an error in TestCafe tests so adding ?
      });
  };

  // Hacky way of resetting pictureURL to be empty
  const handleAddInternship = (doc, fRef) => {
    fRef.reset();
    handleAdd(doc);
  };

  const schema = new SimpleSchema({
    urls: { type: Array },
    'urls.$': String,
    position: String,
    description: String,
    interests: { type: Array },
    'interests.$': String,
    company: { type: String, optional: true },
    location: { type: Array, optional: true },
    'location.$': { type: locationSchema },
    contact: { type: String, optional: true },
    posted: { type: String, optional: true },
    due: { type: String, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <RadGradSegment header='Add Internship'>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddInternship(doc, formRef)} ref={(ref) => (formRef = ref)} showInlineError/>
    </RadGradSegment>
  );
};

export default AddInternshipForm;
